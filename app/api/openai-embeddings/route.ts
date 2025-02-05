import { NextResponse } from "next/server";
import OpenAI from "openai";
import { IngredientsType } from "../analyze-image/route";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log("---- OpenAI Embeddings Endpoint Hit ----");
    const { ingredients } = await request.json();

    const ingredientsArray = ingredients as IngredientsType;

    if (!ingredientsArray || !Array.isArray(ingredientsArray)) {
      return NextResponse.json(
        { error: "Invalid ingredients format" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not set" },
        { status: 500 }
      );
    }

    const mapThroughIngredients = ingredientsArray
      .map((ingredient) => ingredient.name)
      .join(", ");

    console.log("---- mapThroughIngredients ----", mapThroughIngredients);

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: mapThroughIngredients,
      encoding_format: "float",
    });

    return NextResponse.json({ embedding });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}
