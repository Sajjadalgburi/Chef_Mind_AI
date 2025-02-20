import { MealPlanResponse } from "@/types";
import React from "react";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Clock, ChefHat } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface BentoGridProps {
  content: MealPlanResponse["recipes"];
}

export function BentoGridSection({ content }: BentoGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Community Recipes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content?.map((recipe, i) => {
          const creator = recipe?.user;

          const createdDate = recipe.created_at
            ? formatDistanceToNow(new Date(recipe.created_at), {
                addSuffix: true,
              })
            : "Recently";

          return (
            <Link
              href={`/public/recipe?id=${recipe.id}`}
              key={`${recipe.title}-${i}`}
              className="group bg-white rounded-xl hover:scale-102 transform shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={
                    (recipe.imageUrl as string) ||
                    "/images/placeholder-image.jpg"
                  }
                  alt={recipe.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge variant="secondary" className="bg-white/90">
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
              </div>

              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {recipe.title}
                </h2>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                {creator && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <Image
                        src={recipe.user?.image || "/images/default-avatar.png"}
                        alt={recipe.user?.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">
                          {recipe.user?.name || "Anonymous User"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      Created - {createdDate}
                    </span>{" "}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
