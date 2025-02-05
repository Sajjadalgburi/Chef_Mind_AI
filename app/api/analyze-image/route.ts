import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import fridge from "@/public/testing-image.jpg";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mainPrompt = `
You are a professional chef and food expert with advanced knowledge in ingredient identification.
Your task is to analyze the following list of detected items and extract a structured list of ingredients.

### Guidelines:
- If possible, estimate the **quantity** of each ingredient based on the confidence scores
- Return the **name**, **estimated quantity**, and **category** (e.g., vegetable, dairy, protein, grain)
- If an ingredient is unclear, indicate uncertainty (e.g., "Possibly cheddar cheese")
- Do NOT assume missing ingredients—only list what is detected
- Do not include any other text or comments in your response, instead just output the JSON directly

### **Expected Output Format:**
{
  "ingredients": [
    {
      "name": "Tomato",
      "quantity": "3 pieces",
      "category": "Vegetable"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Construct the full URL for the Google Cloud Vision API
    const visionApiUrl = `${req.nextUrl.origin}/api/google-cloud-vision`;

    // 1. First, get Google Cloud Vision analysis
    const visionResponse = await fetch(visionApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: fridge }),
    });

    if (!visionResponse.ok) {
      throw new Error("Failed to analyze image with Google Cloud Vision");
    }

    console.log("---- GPT-4 Analysis Endpoint Hit ----");

    const { detectedItems } = await visionResponse.json();

    // 2. Then, use GPT-4 to analyze the detected items
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: mainPrompt,
        },
        {
          role: "user",
          content: `Analyze these detected items and their confidence scores: ${JSON.stringify(
            detectedItems
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const ingredients =
      response.choices[0]?.message?.content || "No ingredients detected";

    return NextResponse.json({ ingredients }, { status: 200 });
  } catch (error) {
    console.error("Error analyzing fridge image:", error);
    return NextResponse.json(
      { error: "Failed to analyze fridge image" },
      { status: 500 }
    );
  }
}
