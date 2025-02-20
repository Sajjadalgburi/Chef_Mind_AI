"use client";

import { MealPlanResponse } from "@/types";
import React, { useState, useEffect } from "react";
import { getUserRecipes, saveRecipe, removeRecipe } from "@/actions";
import useAuth from "@/hooks/useAuth";
import toast from "react-hot-toast";
import RecipeCard from "@/components/recipe_card_components/RecipeCard";
import { useRouter } from "next/navigation";
import LoadingStateSkeleton from "@/components/LoadingStateSkeleton";

const Profile = () => {
  const [userRecipes, setUserRecipes] = useState<MealPlanResponse["recipes"]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user, session } = useAuth();
  const router = useRouter();
  const userId = user?.id;
  const [isCreatingRecipes, setIsCreatingRecipes] = useState(true);
  const [recipeIds, setRecipeIds] = useState<{ [key: string]: number }>({});
  const [savedRecipes, setSavedRecipes] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [dislikedRecipes, setDislikedRecipes] = useState<{
    [key: string]: boolean;
  }>({});
  const [recievedResponse, setRecievedResponse] = useState(false);

  useEffect(() => {
    if (!userId || !session) {
      router.push("/auth_page");
      return;
    }

    if (!recievedResponse) {
      setTimeout(async () => {
        try {
          setLoading(true);
          setError(null);

          const { data, hasMore, error } = await getUserRecipes(userId, page);

          if (error || !data) {
            throw new Error(error);
          }

          // Ensure `data` is always an array
          const normalizedData = Array.isArray(data) ? data : [data];

          const idMap = normalizedData.reduce(
            (
              acc: { [key: string]: number },
              recipe: { id: number; title: string }
            ) => {
              acc[recipe.title] = recipe.id;
              return acc;
            },
            {}
          );

          // Create a map of saved recipes, setting all to true
          const savedMap = normalizedData.reduce(
            (acc: { [key: string]: boolean }, recipe) => {
              acc[recipe.title] = true;
              return acc;
            },
            {}
          );

          setRecipeIds(idMap);
          setUserRecipes((prev) => [...prev, ...normalizedData]);
          setSavedRecipes((prev) => ({ ...prev, ...savedMap }));
          setRecievedResponse(true);
          setIsCreatingRecipes(false);
          setHasMore(hasMore || false);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch recipes";
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }, 2000);
    }
  }, [userId, session, page, router, recievedResponse]);

  const loadMoreRecipes = () => {
    setPage((prev) => prev + 1);
  };

  if (error) {
    return (
      <div className="min-h-screen p-10 text-center">
        <h1 className="text-2xl text-red-600">Error: {error}</h1>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

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

      setUserRecipes((prev) =>
        prev.filter((recipe) => recipe.title !== recipe_title)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove recipe";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen bg-base-200 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Your Saved Recipes
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Easily access your favorite meal plans anytime.
        </p>

        {loading ? (
          <LoadingStateSkeleton />
        ) : userRecipes.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-1 ${
                userRecipes.length > 1 ? "lg:grid-cols-3" : "max-w-md mx-auto"
              } gap-6 mt-10`}
            >
              {userRecipes.map((recipe, index) => (
                <RecipeCard
                  key={`${recipe.title}-${index}`}
                  recipe={recipe}
                  isSaved={savedRecipes[recipe.title]}
                  isDisliked={dislikedRecipes[recipe.title]}
                  onSave={handleSave}
                  isCreatingRecipes={isCreatingRecipes}
                  onDislike={handleDislike}
                />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMoreRecipes}
                  className="px-6 py-3 bg-olive text-white rounded-lg hover:bg-olive/90"
                >
                  Load More Recipes
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-10 p-8 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-600">No saved recipes yet!</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-6 py-3 bg-olive text-white rounded-lg hover:bg-olive/90"
            >
              Discover Recipes
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
