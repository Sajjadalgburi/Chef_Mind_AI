/**
 * Route for analyzing the users fridge image/pantry photo
 * and returning a list of ingredients that are in the image
 */

import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const mainPrompt = `
  You are a professional chef and food expert.
  Your job is to analyze images of a users fridge/pantry.
  You will return a list of ingredients that are in the image.
  You will also return the quantity of each ingredient.
  I will need this data so that I can generate a recipe based on the ingredients that are in the image.

  OUTPUT:
  <ingredients>
    <ingredient-name>
      <quantity>Quantity</quantity>
    </ingredient-name>
  </ingredients>

`;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: mainPrompt },
        { role: "user", content: image },
      ],
      temperature: 0.8,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["</ingredients>"],
    });

    const data = response.choices[0].message.content;

    return NextResponse.json(
      { data },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
