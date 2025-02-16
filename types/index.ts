// Type definition for the response containing metadata
export type MetaDataResponse = {
  source: string;
  text: Array<string>;
}[];

// Type definition for the ingredients
export type IngredientsType = [
  {
    category: string;
    name: string;
    quantity: string;
  }
];

export type MealCardsProps = {
  isMealPlanLoading: boolean;
  recipes: MealPlanResponse["recipes"];
  setRecipes: React.Dispatch<React.SetStateAction<MealPlanResponse["recipes"]>>;
};

// Type definition for a recipe
export type Recipe = {
  title: string;
  ingredients: string[];
  directions: string[];
};

// Type definition for the properties required to generate a meal plan
export type GenerateMealPlanProps = {
  setIsMealPlanLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipes: React.Dispatch<React.SetStateAction<MealPlanResponse["recipes"]>>;
  prompt: string;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export type MealPlanResponse = {
  recipes: Array<{
    id?: number;
    title: string;
    cuisine: string;
    difficulty: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    ingredients: Array<{
      item: string;
      amount: string;
      required: boolean;
      substitute?: string;
    }>;
    instructions: string[];
    nutritionalInfo: {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
    };
    imageUrl?: string;
    created_at?: string;
    imagePrompt: string;
    tips: string[];
    source: string;
    user?: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }>;
};

export interface GenerateHandlerProps {
  image: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMealPlanLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipes: React.Dispatch<React.SetStateAction<MealPlanResponse["recipes"]>>;
}

export type HandleResetProps = {
  setIsMealPlanLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipes: React.Dispatch<React.SetStateAction<MealPlanResponse["recipes"]>>;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
