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
  isCreatingRecipes: boolean;
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
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <RecipeImageSection recipe={recipe} />

      <div className="card-body">
        <h3 className="card-title text-xl md:text-3xl">
          {recipe.title}
        </h3>
        <RecipeDetails recipe={recipe} />
        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipeNutrition nutritionalInfo={recipe.nutritionalInfo} />
      </div>

      <div className="card-actions justify-end px-6 pb-6">
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
              : "#"
          }
          target="_blank"
          className="btn btn-primary btn-outline"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
