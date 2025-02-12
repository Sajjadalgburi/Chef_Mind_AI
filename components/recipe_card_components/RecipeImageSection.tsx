import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MealPlanResponse } from "@/types";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface RecipeImageSectionProps {
  recipe: MealPlanResponse["recipes"][0];
}

const RecipeImageSection = ({ recipe }: RecipeImageSectionProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative h-48 w-full rounded-lg overflow-hidden">
      {imageLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
      )}
      <Image
        src={recipe.imageUrl as string}
        alt={recipe.title}
        className={`w-full h-full object-cover ${
          imageLoading ? "opacity-0" : "opacity-100"
        }`}
        width={400}
        height={300}
        onLoad={() => setImageLoading(false)}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-black/60" />
      <div className="absolute top-4 right-4 flex gap-2">
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
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
  );
};

export default RecipeImageSection;
