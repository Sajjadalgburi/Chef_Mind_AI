import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";

export { auth } from "@/app/auth";

export const protectedRoutes = [
  "/api/generate-meal-plan",
  "/api/analyze-image",
  "/api/generate-image",
  "/api/openai-embeddings",
  "/api/pinecone-embeddings",
  "/profile",
];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await auth();

  const pathname = nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) => {
    return pathname.startsWith(route);
  });

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth_page", nextUrl));
  }

  return NextResponse.next();
}
