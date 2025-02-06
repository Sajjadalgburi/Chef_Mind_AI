import React, { useEffect, useState } from "react";
import { MealPlanResponse } from "@/types";
import MealCardBody from "./MealCardBody";
import { LoadingCard } from "./LoadingCard";
type Props = {
  isMealPlanLoading: boolean;
  recipes: MealPlanResponse["recipes"];
};

const MealCards: React.FC<Props> = ({ isMealPlanLoading = true, recipes }) => {
  const [visibleSkeletons, setVisibleSkeletons] = useState(1);

  useEffect(() => {
    if (isMealPlanLoading) {
      const interval = setInterval(() => {
        setVisibleSkeletons((prev) => (prev < 8 ? prev + 1 : prev));
      }, 2000); // Add new skeleton every 2 seconds

      return () => clearInterval(interval);
    } else {
      setVisibleSkeletons(1);
    }
  }, [isMealPlanLoading]);

  return (
    <div className="gap-8 mx-auto px-4 w-full mb-[5rem] sm:mb-0 py-6 sm:py-[5rem] flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h1 className="md:text-6xl text-left mb-8 font-bold text-gray-800">
          {!isMealPlanLoading
            ? "Your Personalized Meal Plan"
            : "Crafting your meal plan..."}
        </h1>

        {!isMealPlanLoading ? (
          <MealCardBody recipes={recipes} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Array.from({ length: visibleSkeletons }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCards;
