import { NextResponse } from "next/server";
import OpenAI from "openai";
import { IngredientsType } from "@/types";

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
      .map((ingredient) => `${ingredient.category} ${ingredient.name}`)
      .join(", ");

    const res = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: mapThroughIngredients,
      encoding_format: "float",
    });

    const embeddingData = res.data?.[0]?.embedding;

    if (!embeddingData) {
      return NextResponse.json(
        { error: "Failed to generate embeddings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ embedding: embeddingData }, { status: 200 });
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }
}
