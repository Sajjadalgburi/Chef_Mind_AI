"use client";

import React, { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
  loading: boolean;
}>({
  user: null,
  session: null,
  loading: true,
});

const supabase = createClient();

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gets initial session and uses that session to set the user
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserSession(session);
      setUser(session?.user ?? null);
    };

    getSession();

    // This listens for any event changes and updates the user session and user
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session); // Added debug log
        setUserSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // On Unmount, unsubscribe from the auth listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session: userSession,
    user: user,
    loading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
