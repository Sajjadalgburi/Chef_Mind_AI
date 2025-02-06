import React, { useEffect, useState } from "react";
import { MealCardsProps } from "@/types";
import MealCardBody from "./MealCardBody";
import { LoadingCard } from "./LoadingCard";

const MealCards: React.FC<MealCardsProps> = ({
  isMealPlanLoading,
  recipes,
  mealPlanImage,
}) => {
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

  return !isMealPlanLoading ? (
    <div className="gap-8 mx-auto px-4 w-full mb-[5rem] sm:mb-0 py-6 sm:py-[5rem] flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h1 className="md:text-6xl text-left mb-8 font-bold text-gray-800">
          Your Personalized Meal Plan
        </h1>

        <MealCardBody recipes={recipes} mealPlanImage={mealPlanImage} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {Array.from({ length: visibleSkeletons }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="gap-8 mx-auto px-4 w-full mb-[5rem] sm:mb-0 py-6 sm:py-[5rem] flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: visibleSkeletons }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default MealCards;
