/**
 * Route for generating an image based on a recipe description
 */

import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    // Make sure to check if the API key is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not set" },
        { status: 500 }
      );
    }

    console.log("---- Generating Image Route ----");

    // ! Make sure to make the recipe food type or interface
    const { imagePrompt } = await request.json();

    if (!imagePrompt) {
      return NextResponse.json(
        { error: "No image prompt provided" },
        { status: 400 }
      );
    }

    const mainPrompt: string = `
You are a chef. You are given a recipe description. You need to generate an image for the recipe.

Recipe Description:
${imagePrompt}
`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: mainPrompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
