import { MealPlanResponse } from "@/types";
import React from "react";
import Image from "next/image";
import { Clock, ChefHat } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface BentoGridProps {
  content: MealPlanResponse["recipes"];
}

export function BentoGridSection({ content }: BentoGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {content?.map((recipe, i) => {
          const creator = recipe?.user;
          const isFeatured = (i + 1) % 3 === 0; // Every third card will be featured

          const createdDate = recipe.created_at
            ? formatDistanceToNow(new Date(recipe.created_at), {
                addSuffix: true,
              })
            : "Recently";

          return (
            <Link
              href={`/public/recipe?id=${recipe.id}`}
              key={`${recipe.title}-${i}`}
              className={`group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                isFeatured
                  ? "md:col-span-2 md:row-span-2"
                  : "col-span-1 row-span-1"
              }`}
            >
              <figure
                className={`relative ${isFeatured ? "h-[400px]" : "h-48"}`}
              >
                <Image
                  src={recipe.imageUrl || "/images/placeholder-image.jpg"}
                  alt={recipe.title}
                  fill
                  priority
                  sizes={
                    isFeatured
                      ? "(max-width: 768px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  }
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="badge badge-primary badge-outline">
                    {recipe.cuisine}
                  </div>
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
              </figure>

              <div className="card-body">
                <h2
                  className={`card-title ${
                    isFeatured ? "text-3xl" : "text-xl"
                  }`}
                >
                  {recipe.title}
                </h2>

                <div className="flex items-center gap-4 text-base-content/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>

                {creator && (
                  <div className="flex items-center gap-3 mt-4">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <Image
                          src={creator.image || "/images/default-avatar.png"}
                          alt={creator.name || "User"}
                          width={32}
                          height={32}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {creator.name || "Anonymous User"}
                      </p>
                      <p className="text-xs text-base-content/70">
                        Created {createdDate}
                      </p>
                    </div>
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
