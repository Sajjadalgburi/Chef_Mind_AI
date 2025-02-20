"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import {
  Clock,
  ChefHat,
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MealPlanResponse } from "@/types";
import toast from "react-hot-toast";

const RecipePage = () => {
  const searchParams = useSearchParams();
  const recipeId = searchParams.get("id");
  const [recipe, setRecipe] = useState<MealPlanResponse["recipes"][0] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!recipeId) return;

      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("recipes")
          .select("*, user:users(*)")
          .eq("id", recipeId)
          .single();

        if (error) throw error;
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <div className="card bg-base-100 shadow-xl">
            <Skeleton className="h-[400px] w-full rounded-t-2xl" />
            <div className="card-body">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div>
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          <div className="card bg-base-100 shadow-xl text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
            <p className="text-base-content/70 mb-6">
              The recipe you&rsquo;re looking for doesn&lsquo;t exist or has
              been removed.
            </p>
            <Link href="/" className="btn btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = recipe.created_at
    ? formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })
    : "Recently";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="btn btn-ghost gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Recipes
          </Link>
          <div className="flex gap-2">
            <button onClick={handleShare} className="btn btn-ghost btn-circle">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="btn btn-ghost btn-circle">
              <Heart className="w-5 h-5" />
            </button>
            <button className="btn btn-ghost btn-circle">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <figure className="relative h-[400px]">
            <Image
              src={recipe.imageUrl || "/images/placeholder-image.jpg"}
              alt={recipe.title}
              fill
              priority
              className="object-cover"
            />
          </figure>

          <div className="card-body">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="badge badge-primary">{recipe.cuisine}</div>
              <div
                className={`badge ${
                  recipe.difficulty === "Easy"
                    ? "badge-success"
                    : recipe.difficulty === "Medium"
                    ? "badge-warning"
                    : "badge-error"
                }`}
              >
                {recipe.difficulty}
              </div>
            </div>

            <h1 className="card-title text-4xl mb-4">{recipe.title}</h1>

            <div className="stats shadow mb-8">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="stat-title">Prep Time</div>
                <div className="stat-value text-lg">{recipe.prepTime}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div className="stat-title">Servings</div>
                <div className="stat-value text-lg">{recipe.servings}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Ingredients</h2>
                  <ul className="space-y-3">
                    {recipe?.ingredients?.map((ingredient, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                        />
                        <span className="flex-1">{ingredient.item}</span>
                        {!ingredient.required && (
                          <span className="badge badge-ghost">optional</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Nutritional Info</h2>
                  <div className="stats stats-vertical shadow">
                    <div className="stat">
                      <div className="stat-title">Calories</div>
                      <div className="stat-value text-lg">
                        {recipe.nutritionalInfo?.calories}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Protein</div>
                      <div className="stat-value text-lg">
                        {recipe.nutritionalInfo?.protein}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Carbs</div>
                      <div className="stat-value text-lg">
                        {recipe.nutritionalInfo?.carbs}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {recipe.user && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-base-300">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <Image
                        src={recipe.user?.image || "/images/default-avatar.png"}
                        alt={recipe.user?.name || "User"}
                        width={48}
                        height={48}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">
                      {recipe.user?.name || "Anonymous User"}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Created {createdDate}
                    </p>
                  </div>
                </div>
                <button className="btn btn-primary btn-outline">
                  Follow Chef
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
