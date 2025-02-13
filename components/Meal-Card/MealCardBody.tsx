import { MealPlanResponse } from "@/types";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils } from "lucide-react";
import Link from "next/link";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillDislike,
  AiOutlineDislike,
} from "react-icons/ai";

type Props = {
  recipes: MealPlanResponse["recipes"];
};

const MealCardBody: React.FC<Props> = ({ recipes }) => {
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
      const updatedSaved = prevSaved.some((r) => r.title === recipe.title)
        ? prevSaved.filter((r) => r.title !== recipe.title)
        : [...prevSaved, recipe];

      localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
      return updatedSaved;
    });

    setDislikedRecipes((prevDisliked) => {
      const updatedDisliked = prevDisliked.filter(
        (title) => title !== recipe.title
      );
      localStorage.setItem("dislikedRecipes", JSON.stringify(updatedDisliked));
      return updatedDisliked;
    });
  };

  const handleDislike = (recipeTitle: string) => {
    if (dislikedRecipes.includes(recipeTitle)) {
      setDislikedRecipes(
        dislikedRecipes.filter((title) => title !== recipeTitle)
      );
      localStorage.setItem(
        "dislikedRecipes",
        JSON.stringify(dislikedRecipes.filter((title) => title !== recipeTitle))
      );
    } else {
      setDislikedRecipes([...dislikedRecipes, recipeTitle]);
      localStorage.setItem(
        "dislikedRecipes",
        JSON.stringify([...dislikedRecipes, recipeTitle])
      );
      setSavedRecipes(savedRecipes.filter((r) => r.title !== recipeTitle)); // Remove from saved
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {recipes.map((recipe, index) => {
        const isSaved = savedRecipes.some((r) => r.title === recipe.title);
        const isDisliked = dislikedRecipes.includes(recipe.title);

        return (
          <div
            key={index}
            className="bg-white flex flex-col justify-between gap-1 sm:gap-3 py-3 px-3 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="relative h-48 w-full rounded-lg overflow-hidden">
              <Image
                src={
                  (recipe.imageUrl as string) || "/images/placeholder-image.jpg"
                }
                alt={recipe.title}
                className="w-full h-full object-cover"
                width={400}
                height={300}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-black/60" />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm"
                >
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

            <div className="p-6">
              <h3 className="text-xl md:text-3xl font-semibold text-gray-800 mb-3">
                {recipe.title}
              </h3>

              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Prep: {recipe.prepTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  <span>Cook: {recipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  Main Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                    <Badge
                      key={idx}
                      variant={ing.required ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {ing.item}
                    </Badge>
                  ))}
                  {recipe.ingredients.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{recipe.ingredients.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm mb-4">
                <div className="flex flex-col">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">
                    {recipe.nutritionalInfo.calories}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">
                    {recipe.nutritionalInfo.protein}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-medium">
                    {recipe.nutritionalInfo.carbs}
                  </span>
                </div>
              </div>
            </div>

            {/* Like and Dislike system */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(recipe)}
                  className={`flex gap-3 justify-center items-center p-2 ${
                    isSaved ? "bg-blue-200" : "bg-blue-100"
                  } rounded-lg shadow-md transform transition-all duration-200 hover:scale-105`}
                >
                  {isSaved ? (
                    <>
                      <AiFillLike className="h-6 w-6" />
                      <span>
                        <strong>Saved</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <AiOutlineLike className="h-6 w-6" />
                      <span>
                        <strong>Save</strong>
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDislike(recipe.title)}
                  className={`flex gap-3 justify-center items-center p-2 ${
                    isDisliked ? "bg-red-200" : "bg-red-100"
                  } rounded-lg shadow-md transform transition-all duration-200 hover:scale-105`}
                >
                  {isDisliked ? (
                    <>
                      <AiFillDislike className="h-6 w-6" />
                      <span>
                        <strong>Disliked</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <AiOutlineDislike className="h-6 w-6" />
                      <span>
                        <strong>Dislike</strong>
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <Link
              href={
                typeof recipe.source === "string" &&
                recipe.source.startsWith("http")
                  ? recipe.source
                  : `https://${recipe.source}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              View Full Recipe
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default MealCardBody;
