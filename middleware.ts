import { auth } from "@/app/auth";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Checks if the path is an API route
 * @param path - The path to check
 * @returns True if the path is an API route, false otherwise
 */
const isAPI = (path: string) => {
  return path.startsWith("/api/") || path.startsWith("/app/api/");
};

export const protectedRoutes = [
  "/api/generate-meal-plan",
  "/api/analyze-image",
  "/api/generate-image",
  "/api/openai-embeddings",
  "/api/pinecone-embeddings",
  "/profile",
];

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "86400 s"), // 10 requests per day
  ephemeralCache: new Map(),
  analytics: true,
});

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in the environment variables"
  );
}

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

  //Rate limit APIs
  if (isAPI(pathname)) {
    const userId = session?.user?.id as string;
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `${userId}`
    );

    const res = success
      ? NextResponse.next()
      : NextResponse.json(
          { errorMessage: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());

    if (!success) return res;
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
