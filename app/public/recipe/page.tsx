"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MealPlanResponse } from "@/types";

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
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
        <p className="text-gray-600 mb-6">
          The recipe you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  const createdDate = recipe.created_at
    ? formatDistanceToNow(new Date(recipe.created_at), {
        addSuffix: true,
      })
    : "Recently";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="relative h-[400px] w-full rounded-xl overflow-hidden mb-8">
        <Image
          src={recipe.imageUrl || "/images/placeholder-image.jpg"}
          alt={recipe.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Badge variant="secondary" className="bg-gray-100">
          {recipe.cuisine}
        </Badge>
        <Badge
          className={`${
            recipe.difficulty === "Easy"
              ? "bg-green-500"
              : recipe.difficulty === "Medium"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        >
          {recipe.difficulty}
        </Badge>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>

      <div className="flex items-center gap-6 text-gray-600 mb-8">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{recipe.prepTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          <span>{recipe.servings} servings</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe?.ingredients?.map((ingredient, index: number) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="font-medium">{ingredient.item}</span>
                {!ingredient.required && (
                  <span className="text-sm text-gray-500">(optional)</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Nutritional Info</h2>
          <div className="space-y-2 text-gray-700">
            <p>Calories: {recipe.nutritionalInfo?.calories}</p>
            <p>Protein: {recipe.nutritionalInfo?.protein}</p>
            <p>Carbs: {recipe.nutritionalInfo?.carbs}</p>
          </div>
        </div>
      </div>

      {recipe.user && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Image
              src={recipe.user?.image || "/images/default-avatar.png"}
              alt={recipe.user?.name || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">
                {recipe.user?.name || "Anonymous User"}
              </p>
              <p className="text-sm text-gray-500">Created {createdDate}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
