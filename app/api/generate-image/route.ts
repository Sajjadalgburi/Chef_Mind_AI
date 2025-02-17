/**
 * Route for generating an image based on a recipe description and saving it to Supabase Storage.
 */

import { createClient } from "@/utils/server";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not set" },
        { status: 500 }
      );
    }

    console.log("---- Generating Image Route ----");

    // Initialize Supabase
    const supabase = await createClient();

    const { imagePrompt }: { imagePrompt: string } = await request.json();

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

    // Generate Image with DALL·E
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: mainPrompt,
      n: 1,
      size: "1024x1024",
    });

    if (!response || !response.data || !response.data[0].url) {
      throw new Error("Failed to generate image");
    }

    const imageUrl = response.data[0].url;
    console.log("Generated Image URL:", imageUrl);

    // Fetch the image data
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to fetch generated image");
    }

    const imageBlob = await imageResponse.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `images/${imagePrompt.replace(
      /\s+/g,
      "-"
    )}-${timestamp}.png`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("dalle-images")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error("Supabase Upload Error:", error);
      throw new Error("Failed to upload image to Supabase");
    }

    // Get the public URL of the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("dalle-images").getPublicUrl(fileName);
    console.log("Stored Image URL:", publicUrl);

    return NextResponse.json({ success: true, imageUrl: publicUrl });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error generating or uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate and save image" },
      { status: 500 }
    );
  }
}
