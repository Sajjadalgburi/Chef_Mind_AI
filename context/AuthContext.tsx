/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "@/config/supabase-config-client";

// Create a context for the auth state
export const AuthContext = createContext<{
  user: User | null | undefined;
  session: Session | null | undefined;
  signOut?: () => Promise<void>;
}>({
  user: null,
  session: null,
  signOut: async () => {},
});

/**
 * This is a context provider for the auth state
 */
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode | any;
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gets initial session and uses that session to set the user
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) throw error;

      setSession(session);
      setUser(session?.user);
      setLoading(false);
    };

    // This listens for any event changes and updates the user session and user
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    getSession();

    // On Unmount, unsubscribe from the auth listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session: session,
    user: user,
    signOut: async () => {
      await supabaseClient.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
