import { ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MealPlanResponse } from "@/types";

interface RecipeIngredientsProps {
  ingredients: MealPlanResponse["recipes"][0]["ingredients"];
}

const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
        <ChefHat className="h-4 w-4" />
        Main Ingredients
      </h4>
      <div className="flex flex-wrap gap-2">
        {ingredients.slice(0, 4).map((ing, idx) => (
          <Badge
            key={idx}
            variant={ing.required ? "default" : "secondary"}
            className="text-xs"
          >
            {ing.item}
          </Badge>
        ))}
        {ingredients.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{ingredients.length - 4} more
          </Badge>
        )}
      </div>
    </div>
  );
};

export default RecipeIngredients;
