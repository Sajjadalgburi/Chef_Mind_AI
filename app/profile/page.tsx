"use client";

import { MealPlanResponse } from "@/types";
import React, { useState, useEffect } from "react";
import { getUserRecipes, saveRecipe, removeRecipe } from "@/actions";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import RecipeCard from "@/components/recipe_card_components/RecipeCard";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    if (!userId || !session) {
      router.push("/auth_page");
      return;
    }

    const fetchUserRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUserRecipes(userId, page);

        if ("error" in response) {
          throw new Error(response.error);
        }

        setUserRecipes(response.data as MealPlanResponse["recipes"]);
        setHasMore(response.hasMore);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch recipes";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [userId, session, page, router]);

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

    try {
      const result = await saveRecipe(recipe, userId);

      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh the recipes list
      const response = await getUserRecipes(userId, page);
      if ("error" in response) {
        throw new Error(response.error);
      }

      setUserRecipes(response.data as MealPlanResponse["recipes"]);
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
      const response = await getUserRecipes(userId, page);
      if ("error" in response) {
        throw new Error(response.error);
      }

      setUserRecipes(response.data as MealPlanResponse["recipes"]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove recipe";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Your Saved Recipes
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Easily access your favorite meal plans anytime.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : userRecipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
              {userRecipes.map((recipe, index) => (
                <RecipeCard
                  key={`${recipe.title}-${index}`}
                  recipe={recipe}
                  isSaved={true}
                  isDisliked={false}
                  onSave={handleSave}
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
