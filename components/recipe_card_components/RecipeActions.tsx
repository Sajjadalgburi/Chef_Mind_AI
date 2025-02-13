import { MealPlanResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillDislike,
  AiOutlineDislike,
} from "react-icons/ai";

interface RecipeActionsProps {
  recipe: MealPlanResponse["recipes"][0];
  isSaved: boolean;
  isCreatingRecipes?: boolean;
  isDisliked: boolean;
  onSave: (recipe: MealPlanResponse["recipes"][0]) => void;
  onDislike: (recipe_title: string) => void;
}

const RecipeActions = ({
  recipe,
  isSaved,
  isCreatingRecipes,
  isDisliked,
  onSave,
  onDislike,
}: RecipeActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {isCreatingRecipes ? (
          <div className="flex items-center justify-center w-full">
            <Skeleton className="w-full" />
          </div>
        ) : (
          <>
            <button
              onClick={isSaved ? undefined : () => onSave(recipe)}
              disabled={isSaved}
              className={`flex gap-3 justify-center items-center p-2 ${
                isSaved
                  ? "bg-blue-200 opacity-50 hover:cursor-not-allowed"
                  : "bg-blue-100 hover:scale-105"
              } rounded-lg shadow-md transform transition-all duration-200`}
            >
              {isSaved ? (
                <>
                  <AiFillLike className="h-6 w-6" />
                  <span>
                    <strong>Saved</strong>
                  </span>
                </>
              ) : (
                <>
                  <AiOutlineLike className="h-6 w-6" />
                  <span>
                    <strong>Save</strong>
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => onDislike(recipe.title as string)}
              className={`flex gap-3 justify-center items-center p-2 ${
                isDisliked ? "bg-red-200" : "bg-red-100"
              } rounded-lg shadow-md transform transition-all duration-200 hover:scale-105`}
            >
              {isDisliked ? (
                <>
                  <AiFillDislike className="h-6 w-6" />
                  <span>
                    <strong>Disliked</strong>
                  </span>
                </>
              ) : (
                <>
                  <AiOutlineDislike className="h-6 w-6" />
                  {isSaved ? (
                    <span>
                      <strong>Remove</strong>
                    </span>
                  ) : (
                    <span>
                      <strong>Dislike</strong>
                    </span>
                  )}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeActions;
