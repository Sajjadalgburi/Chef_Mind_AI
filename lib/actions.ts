"use server";

import { signIn, signOut } from "@/app/auth";

export const signInWithProvider = async (provider: "github" | "google") => {
  await signIn(provider, { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
