"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
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

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      await supabase.auth.getSession().then(({ data: { session } }) => {
        setUserSession(session);
        setUser(session?.user ?? null);
      });

      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (e, session) => {
        setTimeout(async () => {
          if (e === "INITIAL_SESSION") {
            console.log("INITIAL_SESSION");
            setUserSession(session);
            setUser(session?.user as User);
          } else if (e === "SIGNED_IN") {
            console.log("SIGNED_IN");
            setUserSession(session);
            setUser(session?.user as User);
          } else if (e === "SIGNED_OUT") {
            console.log("SIGNED_OUT");
            setUserSession(null);
            setUser(null);
          }

          setLoading(false);
        }, 0);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, user]);

  const value = {
    session: userSession,
    user: user,
    loading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a AuthContextProvider.");
  }

  return context;
};
