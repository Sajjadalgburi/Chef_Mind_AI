import {
  GenerateMealPlanProps,
  HandleResetProps,
  MealPlanResponse,
} from "@/types";
import { toast } from "react-hot-toast";
import {
  GenerateHandlerProps,
  IngredientsType,
  MetaDataResponse,
} from "@/types";
import { getMealPlanPrompt } from "./prompts";

/**
 * Generate an embedding for a list of ingredient names
 * @param ingredientNames
 * @returns
 */
export const generateIngredientEmbedding = async (
  ingredientNames: Array<{ category: string; name: string }>,
  {
    setIsMealPlanLoading,
    setRecipes,
    setShowResults,
    setLoading,
    setImage,
  }: HandleResetProps
) => {
  try {
    const res = await fetch("/api/openai-embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientNames }),
    });

    if (!res.ok) {
      toast.error("Failed to generate embedding. Please try again.");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    const { embedding }: { embedding: Array<number> } = await res.json();

    if (
      !embedding ||
      !Array.isArray(embedding) ||
      embedding.length === 0 ||
      "error" in embedding
    ) {
      toast.error("No embedding found");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    return embedding;
  } catch (error) {
    console.error(error);
    toast.error("An unexpected error occurred. Please try again.");
    setTimeout(() => {
      handleReset({
        setIsMealPlanLoading,
        setRecipes,
        setShowResults,
        setLoading,
        setImage,
      });
    }, 3000);
  }
};

/**
 * Send the query vector to Pinecone and get the metadata clossest to the query vector
 * @param queryVector
 * @returns
 */
export const getEmbeddingMetaData = async (
  queryVector: Array<number>,
  {
    setIsMealPlanLoading,
    setRecipes,
    setShowResults,
    setLoading,
    setImage,
  }: HandleResetProps
) => {
  try {
    const res = await fetch("/api/pinecone-embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryVector }),
    });

    if (!res.ok) {
      toast.error("Failed to get metadata. Please try again.");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    const { metadata } = await res.json();

    if (!metadata) {
      toast.error("No metadata found");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return { error: "No metadata found" };
    }

    return metadata;
  } catch (error) {
    console.error(error);
    toast.error("An unexpected error occurred. Please try again.");
    setTimeout(() => {
      handleReset({
        setIsMealPlanLoading,
        setRecipes,
        setShowResults,
        setLoading,
        setImage,
      });
    }, 3000);
  }
};

export const generateMealPlan = async ({
  setIsMealPlanLoading,
  setRecipes,
  prompt,
  setShowResults,
  setLoading,
  setImage,
}: GenerateMealPlanProps & {
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  try {
    setIsMealPlanLoading(true);

    const res = await fetch("/api/generate-meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      setIsMealPlanLoading(false);
      toast.error("Failed to generate meal plan. Please try again.");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return { error: "Failed to generate meal plan" };
    }

    const response = await res.json();
    const { mealPlan }: { mealPlan: MealPlanResponse["recipes"] } = response;

    if (!mealPlan) {
      setIsMealPlanLoading(false);
      toast.error("No meal plan found. Please try again.");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return { error: "No meal plan found" };
    }

    setIsMealPlanLoading(false);
    setRecipes(mealPlan);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    toast.error("An unexpected error occurred. Please try again.");
    setTimeout(() => {
      handleReset({
        setIsMealPlanLoading,
        setRecipes,
        setShowResults,
        setLoading,
        setImage,
      });
    }, 3000);
    setIsMealPlanLoading(false);
  } finally {
    setIsMealPlanLoading(false);
  }
};

export const handleGenerate = async ({
  image,
  setLoading,
  setShowResults,
  setIsMealPlanLoading,
  setRecipes,
  setImage,
}: GenerateHandlerProps & {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  try {
    if (!image) {
      toast.error("Please upload an image");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }
    setLoading(true);

    const response = await fetch("/api/analyze-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    });

    if (!response.ok) {
      toast.error("Error analyzing image... Please try again.");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    const { ingredients }: { ingredients: IngredientsType } =
      await response.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      toast.error("No ingredients detected");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    setLoading(false);
    setShowResults(true);

    const embedding = await generateIngredientEmbedding(ingredients, {
      setIsMealPlanLoading,
      setRecipes,
      setShowResults,
      setLoading,
      setImage,
    });

    if (typeof embedding === "string" || embedding === undefined) {
      toast.error(
        "Error generating embeddings. Embedding is a string or there is an error"
      );
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    const metadata: MetaDataResponse = await getEmbeddingMetaData(embedding, {
      setIsMealPlanLoading,
      setRecipes,
      setShowResults,
      setLoading,
      setImage,
    });

    if (!metadata) {
      toast.error("No recipes found for these ingredients. Please try again");
      setTimeout(() => {
        handleReset({
          setIsMealPlanLoading,
          setRecipes,
          setShowResults,
          setLoading,
          setImage,
        });
      }, 3000);
      return;
    }

    const prompt = getMealPlanPrompt(metadata, ingredients as IngredientsType);

    await generateMealPlan({
      setIsMealPlanLoading,
      setRecipes,
      prompt,
      setShowResults,
      setLoading,
      setImage,
    });
  } catch (error) {
    console.error("Error in handleGenerate:", error);
    toast.error("An unexpected error occurred. Please try again.");
    setTimeout(() => {
      handleReset({
        setIsMealPlanLoading,
        setRecipes,
        setShowResults,
        setLoading,
        setImage,
      });
    }, 3000);
  }
};

/**
 * Function to reset the page page to normal after errors
 */

export const handleReset = ({
  setIsMealPlanLoading,
  setRecipes,
  setShowResults,
  setLoading,
  setImage,
}: HandleResetProps) => {
  setIsMealPlanLoading(false);
  setRecipes([]);
  setShowResults(false);
  setLoading(false);
  setImage(null);
};
