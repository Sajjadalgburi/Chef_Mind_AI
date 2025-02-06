import { MealPlanResponse } from "@/types";
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Utensils } from "lucide-react";

type Props = {
  recipes: MealPlanResponse["recipes"];
};

const MealCardBody: React.FC<Props> = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {recipes.map(
        (
          {
            title,
            cuisine,
            difficulty,
            prepTime,
            cookTime,
            servings,
            ingredients,
            nutritionalInfo,
          },
          index
        ) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div className="relative h-48 w-full">
              <Image
                src={`/images/meal-${(index % 10) + 1}.jpg`}
                alt={title}
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
                  {cuisine}
                </Badge>
                <Badge className="bg-green-500">{difficulty}</Badge>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {title}
              </h3>

              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Prep: {prepTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  <span>Cook: {cookTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{servings}</span>
                </div>
              </div>

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

              <div className="flex flex-wrap gap-3 text-sm mb-4">
                <div className="flex flex-col">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">
                    {nutritionalInfo.calories}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">{nutritionalInfo.protein}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-medium">{nutritionalInfo.carbs}</span>
                </div>
              </div>

              <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium">
                View Full Recipe
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MealCardBody;
