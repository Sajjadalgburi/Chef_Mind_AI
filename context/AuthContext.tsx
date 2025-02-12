"use client";

import { createContext, ReactNode } from "react";
import { Session } from "next-auth";

type AuthContextType = {
  session: Session | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
}
