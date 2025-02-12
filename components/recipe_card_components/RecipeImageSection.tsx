import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MealPlanResponse } from "@/types";

interface RecipeImageSectionProps {
  recipe: MealPlanResponse["recipes"][0];
}

const RecipeImageSection = ({ recipe }: RecipeImageSectionProps) => {
  return (
    <div className="relative h-48 w-full rounded-lg overflow-hidden">
      <Image
        src={recipe.imageUrl as string}
        alt={recipe.title}
        className="w-full h-full object-cover"
        width={400}
        height={300}
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
