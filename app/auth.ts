import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  throw new Error("AUTH_GITHUB_ID and AUTH_GITHUB_SECRET must be set");
}

if (!process.env.AUTH_GOOGLE_CLIENT_ID || !process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_CLIENT_ID and AUTH_GOOGLE_SECRET must be set");
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID! as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET! as string,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET! as string,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
});
