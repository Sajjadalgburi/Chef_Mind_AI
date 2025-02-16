"use client";

import { useEffect, useState } from "react";
import { getUserRecipes } from "@/actions";
import { MealPlanResponse } from "@/types";
import RecipeCard from "@/components/recipe_card_components/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function UserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const [recipes, setRecipes] = useState<MealPlanResponse["recipes"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const { data, error } = await getUserRecipes(params.userId);

        if (error) {
          toast.error(error);
          return;
        }

        if (data) {
          setRecipes(data);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch user recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [params.userId]);

  return (
    <section className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          User Recipes
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={`${recipe.title}-${index}`}
                recipe={recipe}
                isSaved={false}
                isDisliked={false}
                onSave={() => {}}
                isCreatingRecipes={false}
                onDislike={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
