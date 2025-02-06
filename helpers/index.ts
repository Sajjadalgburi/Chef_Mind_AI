import { GenerateMealPlanProps, MealPlanResponse } from "@/types";
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
  ingredientNames: Array<{ category: string; name: string }>
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
      return toast.error("Failed to generate embedding. Please try again.");
    }

    const { embedding }: { embedding: Array<number> } = await res.json();

    if (!embedding) {
      return toast.error("No embedding found");
    }

    return embedding;
  } catch (error) {
    console.error(error);
    return toast.error("An unexpected error occurred. Please try again.");
  }
};

/**
 * Send the query vector to Pinecone and get the metadata clossest to the query vector
 * @param queryVector
 * @returns
 */
export const getEmbeddingMetaData = async (queryVector: Array<number>) => {
  try {
    const res = await fetch("/api/pinecone-embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ queryVector }),
    });

    if (!res.ok) {
      return toast.error("Failed to get metadata. Please try again.");
    }

    const { metadata } = await res.json();

    if (!metadata) {
      return { error: "No metadata found" };
    }

    return metadata;
  } catch (error) {
    console.error(error);
  }
};

export const generateMealPlan = async ({
  setIsMealPlanLoading,
  setRecipes,
  prompt,
}: GenerateMealPlanProps) => {
  try {
    setIsMealPlanLoading(true);

    // Fetch meal plan from AI
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
      return { error: "Failed to generate meal plan" };
    }

    const response = await res.json();

    /**
     * Extract mealPlan from the response
     * and assign a type to it for type safety and to understand the structure of the data
     */
    const { mealPlan }: { mealPlan: MealPlanResponse["recipes"] } = response;

    if (!mealPlan) {
      setIsMealPlanLoading(false);
      toast.error("No meal plan found. Please try again.");
      return { error: "No meal plan found" };
    }

    console.log("---- mealPlan ----", mealPlan);

    // Set the final recipes with images
    setRecipes(mealPlan);
    setIsMealPlanLoading(false);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    toast.error("An unexpected error occurred. Please try again.");
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
}: GenerateHandlerProps) => {
  try {
    if (!image) {
      toast.error("Please upload an image");
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
      return;
    }

    const { ingredients }: { ingredients: IngredientsType } =
      await response.json();

    if (!ingredients || !Array.isArray(ingredients)) {
      toast.error("No ingredients detected");
      return;
    }

    setLoading(false);
    setShowResults(true);

    const embedding = await generateIngredientEmbedding(ingredients);

    if (typeof embedding === "string" || "error" in embedding) {
      toast.error(
        "Error generating embeddings. Embedding is a string or there is an error"
      );
      return;
    }

    const metadata: MetaDataResponse = await getEmbeddingMetaData(embedding);

    if (!metadata) {
      toast.error("No recipes found for these ingredients. Please try again");
      setTimeout(() => {
        setShowResults(false);
      }, 3000);
      return;
    }

    const prompt = getMealPlanPrompt(metadata, ingredients as IngredientsType);

    await generateMealPlan({
      setIsMealPlanLoading,
      setRecipes,
      prompt,
    });
  } catch (error) {
    console.error("Error in handleGenerate:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};
