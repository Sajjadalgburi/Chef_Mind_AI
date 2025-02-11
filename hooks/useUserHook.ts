"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useUser = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a AuthContextProvider.");
  }

  return context;
};
