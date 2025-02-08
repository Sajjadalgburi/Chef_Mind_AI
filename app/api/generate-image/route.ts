/**
 * Route for generating an image based on a recipe description
 */

import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = "edge";

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

    const {
      imagePrompt,
    }: {
      imagePrompt: string;
    } = await request.json();

    if (!imagePrompt) {
      return NextResponse.json(
        { error: "No image prompt provided" },
        { status: 400 }
      );
    }

    const mainPrompt: string = `
You are a highly skilled food photographer and chef. Your task is to generate a realistic and visually appealing image of the dish based on the following recipe description. Ensure that the presentation is professional, with vibrant colors, perfect lighting, and an appetizing composition.

Recipe Details:
${imagePrompt}

Consider the following aspects:
- The ingredients and their textures
- The plating and presentation style
- The background setting (e.g., rustic, modern, minimalistic)
- The lighting (natural, warm, moody, etc.)
- The garnishes and final touches that enhance appeal

Generate a high-quality, mouthwatering image that looks as if it were taken for a gourmet food magazine or a high-end restaurant menu.
`;

    const response = await openai.images.generate({
      model: "dall-e-2",
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
