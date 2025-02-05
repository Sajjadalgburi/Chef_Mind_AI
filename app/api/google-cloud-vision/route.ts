export const runtime = "nodejs";

import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import fs from "fs";

export async function GET() {
  try {
    // Ensure environment variable is set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        { error: "Google Cloud credentials are not set" },
        { status: 500 }
      );
    }

    console.log("---- Google Cloud Vision Endpoint Hit ----");

    // Create Google Cloud Vision client
    const client = new vision.ImageAnnotatorClient();

    const filePath = `${process.cwd()}/public/testing-image.jpg`;

    const request = {
      image: { content: fs.readFileSync(filePath) },
    };

    if (!client || typeof client.objectLocalization !== "function") {
      return NextResponse.json(
        {
          error:
            "Google Cloud Vision client is not properly initialized or method is unavailable",
        },
        { status: 500 }
      );
    }

    if (!request?.image?.content) {
      return NextResponse.json(
        {
          error:
            "No image provided. Maybe imported incorrectly? Check the file path.",
        },
        { status: 400 }
      );
    }

    // Perform Object Detection
    const [result] = await client.objectLocalization(request);

    console.log("---- Google Cloud Vision Result ----");
    console.log(result);
    console.log("---- End of Google Cloud Vision Result ----");

    if (!result?.localizedObjectAnnotations?.length) {
      return NextResponse.json(
        { error: "No objects detected in the image" },
        { status: 400 }
      );
    }

    const err = result.error?.message;
    if (err) {
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const objects = result.localizedObjectAnnotations.map((obj) => ({
      name: obj.name,
      confidence: obj.score,
    }));

    console.log("---- Objects ----", objects);

    return NextResponse.json({ objects }, { status: 200 });
  } catch (error) {
    console.error("Error in Google Cloud Vision:", error);
    return NextResponse.json(
      { error: "Failed to analyze image with Google Cloud Vision" },
      { status: 500 }
    );
  }
}
