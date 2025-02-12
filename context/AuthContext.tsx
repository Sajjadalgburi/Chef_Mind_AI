"use client";

import { createContext, ReactNode } from "react";
import { Session } from "next-auth";

export type UserProps = {
  id: string | null | undefined;
  email: string | null | undefined;
  name: string | null | undefined;
  image: string | null | undefined;
};

type AuthContextType = {
  session: Session | null;
  user: UserProps | null | undefined;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
  session,
  user,
}: {
  children: ReactNode;
  session: Session | null;
  user: UserProps | null;
}) {
  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  );
}
