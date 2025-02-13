"use server";

import { signIn, signOut } from "@/app/auth";
import { MealPlanResponse } from "@/types";
import { createClient } from "@/utils/server";

export const signInWithProvider = async (provider: "github" | "google") => {
  await signIn(provider, { redirectTo: "/" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

// get a single recipe from the saved_recipes table
export const getSingleRecipe = async (recipeId: number) => {
  const supabaseClient = await createClient();

  const { data, error } = await supabaseClient
    .from("saved_recipes")
    .select("*")
    .eq("recipe_id", recipeId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { data, success: true };
};

export const createManyRecipe = async (
  recipes: MealPlanResponse["recipes"], // an array of recipes
  userId: string
) => {
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return { error: "Invalid recipes array" };
  }

  if (!userId) {
    return { error: "User ID is required" };
  }

  const supabaseClient = await createClient();

  const formattedRecipes = recipes.map((recipe) => ({
    user_id: userId,
    title: recipe.title,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    prepTime: String(recipe.prepTime),
    cookTime: String(recipe.cookTime),
    servings: String(recipe.servings),
    ingredients: recipe.ingredients.map((ingredient) => ({
      item: ingredient.item,
      amount: ingredient.amount,
      required: ingredient.required,
      substitute: ingredient.substitute,
    })), // jsonb array (no need to stringify)
    instructions: recipe.instructions.map((instruction) => ({
      instruction: instruction as string,
    })), // jsonb array
    nutritionalInfo: {
      calories: recipe.nutritionalInfo.calories as string,
      protein: recipe.nutritionalInfo.protein as string,
      carbs: recipe.nutritionalInfo.carbs as string,
      fat: recipe.nutritionalInfo.fat as string,
    }, // jsonb object
    imageUrl: recipe.imageUrl,
    tips: recipe.tips.map((tip) => ({
      tip: tip as string,
    })), // jsonb array
    source: recipe.source,
  }));

  const { data, error } = await supabaseClient
    .from("recipes")
    .insert(formattedRecipes)
    .select("id, title");

  if (error) {
    console.error("Error inserting recipes:", error);
    return { error: error.message };
  }

  console.log(
    "----recived data-----",
    data.map((recipe) => ({ title: recipe.title, id: recipe.id }))
  );

  return { message: "Recipes created successfully", data };
};

export const createRecipe = async (recipe: MealPlanResponse["recipes"][0]) => {
  const supabaseClient = await createClient();
  const { error } = await supabaseClient.from("recipes").insert({
    title: recipe.title,
    cuisine: recipe.cuisine,
    difficulty: recipe.difficulty,
    prepTime: String(recipe.prepTime),
    cookTime: String(recipe.cookTime),
    servings: String(recipe.servings),
    ingredients: JSON.stringify(recipe.ingredients),
    instructions: JSON.stringify(recipe.instructions),
    nutritionalInfo: JSON.stringify(recipe.nutritionalInfo),
    imageUrl: recipe.imageUrl,
    tips: JSON.stringify(recipe.tips),
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

export const saveRecipe = async (userId: string, recipeId: number) => {
  const supabaseClient = await createClient();

  if (!userId) {
    return { error: "User ID is required" };
  }

  if (!recipeId) {
    return { error: "Recipe ID is required" };
  }

  try {
    // Check if recipe is already saved
    const { data } = await getSingleRecipe(recipeId);

    if (data && data.length > 0) {
      return { error: "Recipe already saved" };
    }

    // If not saved, proceed with saving
    const { error } = await supabaseClient.from("saved_recipes").insert({
      user_id: userId,
      recipe_id: recipeId,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to save recipe", error);
    return { error: "Failed to save recipe" };
  }
};

export const removeRecipe = async (recipeId: number, userId: string) => {
  const supabaseClient = await createClient();

  if (!userId) {
    return { error: "User ID is required" };
  }

  if (!recipeId) {
    return { error: "Recipe ID is required" };
  }

  try {
    // Check if the recipe exists before trying to delete
    const { data, error: recipeError } = await getSingleRecipe(recipeId);

    if (recipeError) {
      return { error: recipeError };
    }

    if (!data || data.length === 0) {
      return { error: "Recipe not found in saved recipes" };
    }

    const { error } = await supabaseClient
      .from("saved_recipes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);

    if (error) {
      return { error: error.message };
    }

    console.log("recipe removed successfully");
    return { success: true };
  } catch (error) {
    console.error("Error in removeRecipe:", error);
    return { error: "Failed to remove recipe" };
  }
};

export const getAllRecipes = async () => {
  const supabaseClient = await createClient();

  const { data, error } = await supabaseClient.from("recipes").select("*");

  if (error) {
    return { error: "Cannot fetch recipes" };
  }

  return data as MealPlanResponse["recipes"];
};
