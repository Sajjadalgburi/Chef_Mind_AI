"use client";

import { MealPlanResponse } from "@/types";
import React, { useState, useEffect } from "react";
import { getUserRecipes } from "@/actions";
import useAuth from "@/hooks/useAuth";
import { getSupabaseClient } from "@/config/supbaseClient";

const Profile = () => {
  // const [dislikedRecipes, setDislikedRecipes] = useState<string[]>([]);
  const [userRecipes, setUserRecipes] = useState<MealPlanResponse["recipes"]>(
    []
  );

  // const handleSave = (recipe: MealPlanResponse["recipes"][0]) => {};

  // const handleDislike = (recipeTitle: string) => {};

  const { user, session } = useAuth();
  const userId = user?.id as string;
  console.log(userId);

  useEffect(() => {
    if (!userId || !session) return;

    const { supabaseAccessToken } = session;

    if (!supabaseAccessToken || getSupabaseClient(supabaseAccessToken)) return;

    const fetchUserRecipes = async () => {
      const recipes = await getUserRecipes(
        userId,
        getSupabaseClient(supabaseAccessToken)
      );

      if (!recipes) return;

      setUserRecipes(recipes as unknown as MealPlanResponse["recipes"]);
    };

    fetchUserRecipes();
  }, [userId, session]);

  return (
    <section className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Your Saved Recipes
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Easily access your favorite meal plans anytime.
        </p>

        {!userRecipes.length ? (
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No saved meals yet!
            </h2>
            <p className="text-gray-500">
              Start exploring and save meals for quick access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* {userRecipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipe={recipe}
                isSaved={userRecipes.some((r) => r.title === recipe.title)}
                isDisliked={dislikedRecipes.includes(recipe.title)}
                onSave={handleSave}
                onDislike={handleDislike}
              />
            ))} */}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
