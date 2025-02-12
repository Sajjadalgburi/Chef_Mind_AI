"use server";

import { signIn, signOut } from "@/app/auth";
import { MealPlanResponse } from "@/types";
import { createClient } from "@/utils/server";
import { toast } from "react-hot-toast";

export const signInWithProvider = async (provider: "github" | "google") => {
  await signIn(provider, { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

export const createManyRecipe = async (
  recipes: MealPlanResponse["recipes"]
) => {
  const supabaseClient = await createClient();

  const { error } = await supabaseClient.from("recipes").insert(
    recipes.map((recipe) => ({
      title: recipe.title,
      ingredients: recipe.ingredients,
      cuisine: recipe.cuisine,
      difficulty: recipe.difficulty,
      instructions: recipe.instructions,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
    }))
  );

  if (error) {
    return { error: error.message };
  }

  return "Recipes created successfully";
};

export const createRecipe = async (recipe: MealPlanResponse["recipes"][0]) => {
  const supabaseClient = await createClient();
  const { error } = await supabaseClient.from("recipes").insert({
    title: recipe.title,
    ingredients: recipe.ingredients,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    instructions: recipe.instructions,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    nutritionalInfo: recipe.nutritionalInfo,
    imageUrl: recipe.imageUrl,
    tips: recipe.tips,
    prepTime: recipe.prepTime,
    source: recipe.source,
  });

  if (error) {
    return { error: error.message };
  }

  return "Recipe created successfully";
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

export const saveRecipe = async (
  recipe: MealPlanResponse["recipes"][0],
  userId: string
) => {
  const supabaseClient = await createClient();

  try {
    const { error } = await supabaseClient.from("recipes").insert({
      ...recipe,
      user_id: userId,
    });

    if (error) {
      toast.error("Error saving recipe");
      return { error: error.message };
    }

    toast.success("Recipe saved successfully");
    return { success: true };
  } catch (error) {
    console.error("Error in saveRecipe:", error);
    toast.error("Failed to save recipe");
    return { error: "Failed to save recipe" };
  }
};

export const removeRecipe = async (recipeTitle: string, userId: string) => {
  const supabaseClient = await createClient();

  try {
    const { error } = await supabaseClient
      .from("recipes")
      .delete()
      .match({ title: recipeTitle, user_id: userId });

    if (error) {
      toast.error("Error removing recipe");
      return { error: error.message };
    }

    toast.success("Recipe removed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error in removeRecipe:", error);
    toast.error("Failed to remove recipe");
    return { error: "Failed to remove recipe" };
  }
};
