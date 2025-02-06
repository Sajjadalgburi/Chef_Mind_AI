// Type definition for the response containing metadata
export type MetaDataResponse = {
  source: string;
  text: string;
}[];

// Type definition for the ingredients
export type IngredientsType = [
  {
    category: string;
    name: string;
    quantity: string;
  }
];

// Type definition for a recipe
export type Recipe = {
  title: string;
  ingredients: string[];
  directions: string[];
};

// Type definition for the properties required to generate a meal plan
export type GenerateMealPlanProps = {
  setMealPlanLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  ingredients: IngredientsType;
  metadata: MetaDataResponse;
};
