import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { SignJWT } from "jose"; // Import SignJWT from jose

if (!process.env.AUTH_GITHUB_ID || !process.env.AUTH_GITHUB_SECRET) {
  throw new Error("AUTH_GITHUB_ID and AUTH_GITHUB_SECRET must be set");
}

if (!process.env.AUTH_GOOGLE_CLIENT_ID || !process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_CLIENT_ID and AUTH_GOOGLE_SECRET must be set");
}

if (!process.env.SUPABASE_JWT_SECRET) {
  throw new Error("SUPABASE_JWT_SECRET must be set");
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
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET ?? "";
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };

        // Use jose to sign the JWT
        session.supabaseAccessToken = await new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("2h") // Set expiration time as needed
          .sign(new TextEncoder().encode(signingSecret));
      }
      return session;
    },
  },
});
