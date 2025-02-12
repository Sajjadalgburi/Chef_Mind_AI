"use server";

import { signIn, signOut } from "@/app/auth";
import { MealPlanResponse } from "@/types";
import { Database } from "@/types/chef_mind_types";
import { SupabaseClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export const signInWithProvider = async (provider: "github" | "google") => {
  await signIn(provider, { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

export const createRecipe = async (
  {
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
    prepTime,
    source,
  }: MealPlanResponse["recipes"][0],
  supabaseClient: SupabaseClient<Database>
) => {
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
    prepTime,
    source,
  });

  if (error) {
    toast.error("Error creating recipe");
    return { error: error.message };
  }

  return toast.success("Recipe created successfully");
};

export const getUserRecipes = async (
  userId: string,
  supabaseClient: SupabaseClient<Database>
) => {
  if (!supabaseClient) {
    console.log("Supabase client not found");
    return;
  }

  const { data, error } = await supabaseClient
    .from("recipes")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    toast.error(`Error in getting recipes for user ${userId}`);
    return { error: error.message };
  }

  return data;
};
