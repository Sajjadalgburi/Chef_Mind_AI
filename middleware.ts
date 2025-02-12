import { auth } from "@/app/auth";

import { NextRequest, NextResponse } from "next/server";

export { auth as middleware } from "@/app/auth";

export const protectedRoutes = [
  "/api/generate-meal-plan",
  "/api/analyze-image",
  "/api/generate-image",
  "/api/openai-embeddings",
  "/api/pinecone-embeddings",
];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();

  const pathname = nextUrl.pathname;

  const isProtected = protectedRoutes.some((r) => {
    return pathname.startsWith(r);
  });

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/generate-meal-plan",
    "/api/analyze-image",
    "/api/generate-image",
    "/api/openai-embeddings",
    "/api/pinecone-embeddings",
  ],
};
