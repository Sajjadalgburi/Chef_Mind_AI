import { NextRequest, NextResponse } from "next/server";
import vision from "@google-cloud/vision";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Ensure environment variable is set
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        { error: "Google Cloud credentials are not set" },
        { status: 500 }
      );
    }

    console.log("---- Google Cloud Vision Object Detection ----");

    // Read image as a binary buffer
    const imageBuffer = await request.arrayBuffer(); // Use arrayBuffer() to get raw binary data

    if (!imageBuffer) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Create Google Cloud Vision client
    const client = new vision.ImageAnnotatorClient();

    if (!client || typeof client.objectLocalization !== "function") {
      return NextResponse.json(
        {
          error:
            "Google Cloud Vision client is not properly initialized or method is unavailable",
        },
        { status: 500 }
      );
    }

    // Perform Object Detection
    const [result] = await client.objectLocalization({
      image: { content: Buffer.from(imageBuffer) }, // Pass binary image data directly
    });

    console.log("---- Google Cloud Vision Result ----");
    console.log(result);
    console.log("---- End of Google Cloud Vision Result ----");

    if (!result?.localizedObjectAnnotations?.length) {
      return NextResponse.json(
        { error: "No objects detected in the image" },
        { status: 400 }
      );
    }

    const objects = result.localizedObjectAnnotations.map((obj) => ({
      name: obj.name,
      confidence: obj.score,
    }));

    return NextResponse.json({ objects });
  } catch (error) {
    console.error("Error in Google Cloud Vision:", error);
    return NextResponse.json(
      { error: "Failed to analyze image with Google Cloud Vision" },
      { status: 500 }
    );
  }
}
