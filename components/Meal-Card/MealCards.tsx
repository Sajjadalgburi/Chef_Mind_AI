import React, { useEffect, useState } from "react";
import { MealCardsProps, MealPlanResponse } from "@/types";
import { LoadingCard } from "./LoadingCard";
import {
  createManyRecipe,
  createRecipe,
  getUserRecipes,
  removeRecipe,
  saveRecipe,
} from "@/actions";
import useAuth from "@/hooks/useAuth";
import RecipeCard from "../recipe_card_components/RecipeCard";
import toast from "react-hot-toast";

const MealCards: React.FC<MealCardsProps> = ({
  isMealPlanLoading = true,
  recipes,
}) => {
  const [visibleSkeletons, setVisibleSkeletons] = useState(1);
  const { user } = useAuth();

  const [isCreatingRecipes, setIsCreatingRecipes] = useState(true);

  const userId = user?.id;
  useEffect(() => {
    const saveRecipes = async () => {
      if (!recipes || recipes.length === 0 || !user) return;

      if (recipes.length === 0) {
        await createRecipe(recipes[0]);
        setIsCreatingRecipes(false);
      }

      await createManyRecipe(recipes);
      setIsCreatingRecipes(false);
    };

    if (!isMealPlanLoading && recipes) {
      saveRecipes();
    }
  }, [recipes, isMealPlanLoading, user]);

  useEffect(() => {
    if (!recipes && !isMealPlanLoading) return;

    if (isMealPlanLoading) {
      const interval = setInterval(() => {
        setVisibleSkeletons((prev) => (prev < 8 ? prev + 1 : prev));
      }, 5500);

      return () => clearInterval(interval);
    } else {
      setVisibleSkeletons(1);
    }
  }, [isMealPlanLoading, recipes]);

  const handleSave = async (recipe: MealPlanResponse["recipes"][0]) => {
    if (!userId) {
      toast.error("Please login to save recipes");
      return;
    }

    try {
      const result = await saveRecipe(recipe, userId);

      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh the recipes list
      const response = await getUserRecipes(userId);
      if ("error" in response) {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save recipe";
      toast.error(errorMessage);
    }
  };

  const handleDislike = async (recipeTitle: string) => {
    if (!userId) {
      toast.error("Please login to manage recipes");
      return;
    }

    try {
      const result = await removeRecipe(recipeTitle, userId);

      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh the recipes list
      const response = await getUserRecipes(userId);
      if ("error" in response) {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove recipe";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="gap-8 mx-auto px-4 mb-[5rem] sm:mb-0 py-6 sm:py-[5rem] flex flex-col items-center">
      {!isMealPlanLoading ? (
        <div className="w-full max-w-[80vw]">
          <h1 className="md:text-6xl text-left mb-8 font-bold text-gray-800">
            Your Personalized Meal Plan
          </h1>
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={`${recipe.title}-${index}`}
              recipe={recipe}
              isCreatingRecipes={isCreatingRecipes}
              isSaved={true}
              isDisliked={false}
              onSave={handleSave}
              onDislike={handleDislike}
            />
          ))}{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {Array.from({ length: visibleSkeletons }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MealCards;
