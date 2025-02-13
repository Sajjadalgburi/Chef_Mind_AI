import React, { useEffect, useState } from "react";
import { MealCardsProps, MealPlanResponse } from "@/types";
import { LoadingCard } from "./LoadingCard";
import { createManyRecipe, removeRecipe, saveRecipe } from "@/actions";
import useAuth from "@/hooks/useAuth";
import RecipeCard from "../recipe_card_components/RecipeCard";
import toast from "react-hot-toast";

const MealCards: React.FC<MealCardsProps> = ({
  isMealPlanLoading = true,
  recipes,
  setRecipes,
}) => {
  const [visibleSkeletons, setVisibleSkeletons] = useState(1);
  const { user } = useAuth();
  const [isCreatingRecipes, setIsCreatingRecipes] = useState(true);
  const [recipeIds, setRecipeIds] = useState<{ [key: string]: number }>({});
  const [savedRecipes, setSavedRecipes] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [dislikedRecipes, setDislikedRecipes] = useState<{
    [key: string]: boolean;
  }>({});
  const [recievedResponse, setRecievedResponse] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    const saveRecipes = async () => {
      if (!recipes || recipes.length === 0 || !user || !userId) return;

      // Add a delay to ensure recipes are displayed first

      // if did not recieve response, then allow to save recipes in the database
      if (recievedResponse === false) {
        setTimeout(async () => {
          try {
            const { data, error } = await createManyRecipe(recipes, userId);

            if (error || !data) {
              throw new Error(error);
            }

            const idMap = data.reduce(
              (
                acc: { [key: string]: number },
                recipe: { id: number; title: string }
              ) => {
                acc[recipe.title] = recipe.id;
                return acc;
              },
              {}
            );
            setRecievedResponse(true); // set to true to prevent from saving recipes in the database again
            setRecipeIds(idMap);
            setIsCreatingRecipes(false);
            toast.success("Recipes saved successfully!");
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Failed to save recipes"
            );
            setIsCreatingRecipes(false);
          }
        }, 2500); // 2 second delay
      }
    };

    // Only run when recipes are loaded and not empty
    if (
      !isMealPlanLoading &&
      recipes?.length &&
      recipes.every((recipe) => recipe.title)
    ) {
      saveRecipes();
    }
  }, [recipes, isMealPlanLoading, user, userId, recievedResponse]);

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

    const recipeId = recipeIds[recipe.title];
    if (!recipeId) {
      toast.error("Recipe ID not found");
      return;
    }

    try {
      const { error, success } = await saveRecipe(userId, recipeId);

      if (error || !success) {
        toast.error(error);
        return;
      }

      setSavedRecipes((prev) => ({
        ...prev,
        [recipe.title]: !prev[recipe.title],
      }));

      // If recipe was disliked, remove dislike when liking
      if (dislikedRecipes[recipe.title]) {
        setDislikedRecipes((prev) => ({
          ...prev,
          [recipe.title]: false,
        }));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save recipe";
      toast.error(errorMessage);
    }
  };

  const handleDislike = async (recipe_title: string) => {
    if (!userId) {
      toast.error("Please login to manage recipes");
      return;
    }

    const recipeId = recipeIds[recipe_title];
    if (!recipeId) {
      toast.error("Recipe ID not found");
      return;
    }

    try {
      const { success, error } = await removeRecipe(recipeId, userId);

      if (error || !success) {
        toast.error(error);
        return;
      }

      setDislikedRecipes((prev) => ({
        ...prev,
        [recipe_title]: !prev[recipe_title],
      }));

      // If recipe was liked, remove like when disliking
      if (savedRecipes[recipe_title]) {
        setSavedRecipes((prev) => ({
          ...prev,
          [recipe_title]: false,
        }));
      }

      setRecipes((prev) =>
        prev.filter((recipe) => recipe.title !== recipe_title)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove recipe";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="gap-8 mx-auto px-4 mb-[5rem] sm:mb-0 py-6 sm:py-[5rem] flex flex-col items-center">
      {!isMealPlanLoading ? (
        <>
          <h1 className="md:text-6xl text-left font-bold text-gray-800">
            Your Personalized Meal Plan
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={`${recipe.title}-${index}`}
                recipe={recipe}
                isCreatingRecipes={isCreatingRecipes}
                isSaved={savedRecipes[recipe.title] || false}
                isDisliked={dislikedRecipes[recipe.title] || false}
                onSave={handleSave}
                onDislike={handleDislike}
              />
            ))}
          </div>
        </>
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
