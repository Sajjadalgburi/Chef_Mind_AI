import { MealPlanResponse } from "@/types";

interface RecipeNutritionProps {
  nutritionalInfo: MealPlanResponse["recipes"][0]["nutritionalInfo"];
}

const RecipeNutrition = ({ nutritionalInfo }: RecipeNutritionProps) => {
  return (
    <div className="flex flex-wrap gap-3 text-sm mb-4">
      <div className="flex flex-col">
        <span className="text-gray-600">Calories</span>
        <span className="font-medium">{nutritionalInfo?.calories}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-600">Protein</span>
        <span className="font-medium">{nutritionalInfo?.protein}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-gray-600">Carbs</span>
        <span className="font-medium">{nutritionalInfo?.carbs}</span>
      </div>
    </div>
  );
};

export default RecipeNutrition;
