"use server";

import { signIn, signOut } from "@/app/auth";
import { supabaseClient } from "@/config/supbaseClient";
import { MealPlanResponse } from "@/types";
import toast from "react-hot-toast";

export const signInWithProvider = async (provider: "github" | "google") => {
  await signIn(provider, { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

export const createRecipe = async ({
  title,
  ingredients,
  cuisine,
  difficulty,
  instructions,
  cookTime,
  servings,
  nutritionalInfo,
  imageUrl,
  tips,
}: MealPlanResponse["recipes"][0]) => {
  const { error } = await supabaseClient.from("recipes").insert({
    title,
    ingredients,
    cuisine,
    difficulty,
    instructions,
    cookTime,
    servings,
    nutritionalInfo,
    imageUrl,
    tips,
  });

  if (error) {
    toast.error("Error creating recipe");
    return { error: error.message };
  }

  return toast.success("Recipe created successfully");
};
