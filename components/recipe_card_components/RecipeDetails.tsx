import { Clock, Users, Utensils } from "lucide-react";
import { MealPlanResponse } from "@/types";

interface RecipeDetailsProps {
  recipe: MealPlanResponse["recipes"][0];
}

const RecipeDetails = ({ recipe }: RecipeDetailsProps) => {
  return (
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
  );
};

export default RecipeDetails;
