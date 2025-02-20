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

export const getAllRelatedRecipes = async (userId: string) => {
  const supabaseClient = await createClient();

  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    const { data, error } = await supabaseClient
      .from("saved_recipes")
      .select("recipe_id")
      .eq("user_id", userId);

    if (error) {
      console.error(`Error in getting recipe IDs for user ${userId}:`, error);
      return { error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: [], success: true };
    }

    const recipeIds = data.map((recipe) => recipe.recipe_id);

    const { data: recipes, error: recipeError } = await supabaseClient
      .from("recipes")
      .select("*")
      .in("id", recipeIds);

    if (recipeError) {
      console.error(
        `Error in getting recipes for user ${userId}:`,
        recipeError
      );
      return { error: recipeError.message };
    }

    return { data: recipes, success: true };
  } catch (error) {
    console.error(`Error in getAllRelatedRecipes:`, error);
    return { error: "Failed to fetch related recipes" };
  }
};

export const getUserRecipes = async (
  userId: string,
  page: number = 1,
  limit: number = 9
) => {
  const start = (page - 1) * limit;

  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    const { data: allRecipes, error } = await getAllRelatedRecipes(userId);

    if (error) {
      return { error };
    }

    if (!Array.isArray(allRecipes) || allRecipes.length === 0) {
      return { data: [], hasMore: false };
    }

    // Calculate pagination
    const paginatedRecipes = allRecipes.slice(start, start + limit);
    const hasMore = start + limit < allRecipes.length;

    return {
      data: paginatedRecipes,
      hasMore,
      total: allRecipes.length,
    };
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
    const { error } = await supabaseClient
      .from("saved_recipes")
      .delete()
      .eq("recipe_id", recipeId)
      .eq("user_id", userId);

    if (error) {
      return { error: error.message };
    }
    console.log("got here");

    return { success: true };
  } catch (error) {
    console.error("Error in removeRecipe:", error);
    return { error: "Failed to remove recipe" };
  }
};

export const getAllRecipes = async () => {
  const supabaseClient = await createClient();

  const { data: recipes, error: recipesError } = await supabaseClient
    .from("recipes")
    .select("*");

  // If there is an error fetching recipes, return early
  if (recipesError || !recipes) {
    return { error: { recipesError }, associatedUsers: null };
  }

  // Extract unique user IDs
  const userIds = [
    ...new Set(recipes.map((recipe) => recipe.user_id as string)),
  ];

  // If no user IDs are found, return early
  if (userIds.length === 0) {
    return { error: "No user IDs found", associatedUsers: null };
  }

  // Fetch users for those IDs
  const { data: users, error: userError } = await getAllUsers(userIds);

  if (users === undefined) {
    return { error: "No users found", associatedUsers: null };
  }

  // Create a map of users by their IDs for faster lookup
  const userMap = users.reduce((acc, user) => {
    acc[user.id] = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
    return acc;
  }, {} as Record<string, MealPlanResponse["recipes"][0]["user"]>);

  // Append user object to each recipe
  const recipesWithUsers = recipes.map((recipe) => ({
    ...recipe,
    user: userMap[recipe.user_id],
  }));

  return {
    associatedUsers: { users, recipes: recipesWithUsers },
    error: { recipesError, userError },
  };
};

export const getAllUsers = async (userIds: string[]) => {
  const supabaseClient = await createClient();

  const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .in("id", userIds);

  if (data === null || data === undefined) {
    return { error: "No users found" };
  }

  return { data, error };
};
