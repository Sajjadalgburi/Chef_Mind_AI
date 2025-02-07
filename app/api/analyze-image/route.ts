import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

const mainPrompt = `
You are a professional chef and food expert with advanced knowledge in ingredient identification.
Your task is to analyze the following list of detected items and extract a structured list of ingredients.

### Guidelines:
- If possible, estimate the **quantity** of each ingredient based on the confidence scores
- Return the **name**, **estimated quantity**, and **category** (e.g., vegetable, dairy, protein, grain)
- If an ingredient is unclear, indicate uncertainty (e.g., "Possibly cheddar cheese")
- Do NOT assume missing ingredients—only list what is detected
- Do not include any other text or comments in your response, instead just output the JSON directly

IMPORTANT:
- Do not include any other text or comments in your response, instead just output the JSON directly
- IF YOU CANNOT DETECT ANY INGREDIENTS OR IMAGE IS NOT CLEAR, RETURN AN EMPTY ARRAY
### **Expected Output Format:**
{
  "ingredients": [
    {
      "name": "Tomato",
      "quantity": "3 pieces",
      "category": "Vegetable"
    }
  ]
}

`;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    console.log("---- GPT-4 Analysis Endpoint Hit ----");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: mainPrompt },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
      store: true,
    });

    let responseText = response.choices[0]?.message?.content?.trim() || "{}";

    // Extract only the first valid JSON object
    const firstBraceIndex = responseText.indexOf("{");
    const lastBraceIndex = responseText.lastIndexOf("}");

    if (firstBraceIndex !== -1 && lastBraceIndex !== -1) {
      responseText = responseText.substring(
        firstBraceIndex,
        lastBraceIndex + 1
      );
    }

    const ingredients = JSON.parse(responseText);

    return NextResponse.json(
      { ingredients: ingredients.ingredients || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing fridge image:", error);
    return NextResponse.json(
      { error: "Failed to analyze fridge image" },
      { status: 500 }
    );
  }
}
