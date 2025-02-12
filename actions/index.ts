"use server";

import { signIn, signOut } from "@/app/auth";
import { MealPlanResponse } from "@/types";
import toast from "react-hot-toast";
import { createClient } from "@/utils/server";

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
  prepTime,
  source,
}: MealPlanResponse["recipes"][0]) => {
  const supabaseClient = await createClient();
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
  page: number = 1,
  limit: number = 9
) => {
  const supabaseClient = await createClient();

  const start = (page - 1) * limit;

  try {
    const { data, error, count } = await supabaseClient
      .from("recipes")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .range(start, start + limit - 1);

    if (error) {
      console.error(`Error in getting recipes for user ${userId}:`, error);
      return { error: error.message };
    }

    return { data, hasMore: count ? start + limit < count : false };
  } catch (error) {
    console.error(`Error in getUserRecipes:`, error);
    return { error: "Failed to fetch recipes" };
  }
};
