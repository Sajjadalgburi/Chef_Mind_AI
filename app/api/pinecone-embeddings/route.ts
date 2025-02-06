import { Pinecone } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { queryVector } = await req.json();
    if (!queryVector) {
      return NextResponse.json(
        { error: "No query vector provided" },
        { status: 400 }
      );
    }
    console.log("---- Pinecone Embeddings Endpoint Hit ----");

    const results = await pinecone.index("food-dataset").query({
      vector: queryVector,
      topK: 10, // return top 10 results
      includeMetadata: true,
    });

    const metadata = results.matches.map((match) => match.metadata);

    return NextResponse.json({ metadata }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
