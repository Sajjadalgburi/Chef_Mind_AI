"use client";

import { MealPlanResponse } from "@/types";
import React, { useState, useEffect } from "react";
import RecipeCard from "@/components/recipe_card_components/RecipeCard";

const Profile = () => {
  const [savedRecipes, setSavedRecipes] = useState<MealPlanResponse["recipes"]>(
    []
  );
  const [dislikedRecipes, setDislikedRecipes] = useState<string[]>([]);

  // Load disliked recipes from localStorage on mount
  useEffect(() => {
    const storedSaved = localStorage.getItem("savedRecipes");
    if (storedSaved) {
      setSavedRecipes(JSON.parse(storedSaved));
    }
  }, []);

  const handleSave = (recipe: MealPlanResponse["recipes"][0]) => {
    setSavedRecipes((prevSaved) => {
      if (prevSaved.some((r) => r.title === recipe.title)) {
        // If already saved, do nothing
        return prevSaved;
      }
      const updatedSaved = [...prevSaved, recipe];
      localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
      return updatedSaved;
    });

    setDislikedRecipes((prevDisliked) => {
      if (!prevDisliked.includes(recipe.title)) {
        return prevDisliked; // If not disliked, do nothing
      }
      const updatedDisliked = prevDisliked.filter(
        (title) => title !== recipe.title
      );
      localStorage.setItem("dislikedRecipes", JSON.stringify(updatedDisliked));
      return updatedDisliked;
    });
  };

  const handleDislike = (recipeTitle: string) => {
    setDislikedRecipes((prevDisliked) => {
      if (prevDisliked.includes(recipeTitle)) {
        return prevDisliked; // If already disliked, do nothing
      }
      const updatedDisliked = [...prevDisliked, recipeTitle];
      localStorage.setItem("dislikedRecipes", JSON.stringify(updatedDisliked));
      return updatedDisliked;
    });

    setSavedRecipes((prevSaved) => {
      if (!prevSaved.some((r) => r.title === recipeTitle)) {
        return prevSaved; // If not saved, do nothing
      }
      const updatedSaved = prevSaved.filter((r) => r.title !== recipeTitle);
      localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
      return updatedSaved;
    });
  };

  return (
    <section className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Your Saved Recipes
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Easily access your favorite meal plans anytime.
        </p>

        {!savedRecipes.length ? (
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
            {savedRecipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipe={recipe}
                isSaved={savedRecipes.some((r) => r.title === recipe.title)}
                isDisliked={dislikedRecipes.includes(recipe.title)}
                onSave={handleSave}
                onDislike={handleDislike}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
