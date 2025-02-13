import { MealPlanResponse } from "@/types";
import Link from "next/link";
import RecipeImageSection from "./RecipeImageSection";
import RecipeDetails from "./RecipeDetails";
import RecipeIngredients from "./RecipeIngredients";
import RecipeNutrition from "./RecipeNutrition";
import RecipeActions from "./RecipeActions";

interface RecipeCardProps {
  recipe: MealPlanResponse["recipes"][0];
  isSaved: boolean;
  isCreatingRecipes?: boolean;
  isDisliked: boolean;
  onSave: (recipe: MealPlanResponse["recipes"][0]) => void;
  onDislike: (recipe_title: string) => void;
}

const RecipeCard = ({
  recipe,
  isSaved,
  isCreatingRecipes,
  isDisliked,
  onSave,
  onDislike,
}: RecipeCardProps) => {
  return (
    <div className="bg-white flex flex-col justify-between gap-1 sm:gap-3 py-3 px-3 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <RecipeImageSection recipe={recipe} />

      <div className="p-6">
        <h3 className="text-xl md:text-3xl font-semibold text-gray-800 mb-3">
          {recipe.title}
        </h3>
        <RecipeDetails recipe={recipe} />
        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipeNutrition nutritionalInfo={recipe.nutritionalInfo} />
      </div>

      <RecipeActions
        recipe={recipe}
        isSaved={isSaved}
        isDisliked={isDisliked}
        isCreatingRecipes={isCreatingRecipes}
        onSave={onSave}
        onDislike={onDislike}
      />

      <Link
        href={
          typeof recipe.source === "string" && recipe.source.startsWith("http")
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
};

export default RecipeCard;
