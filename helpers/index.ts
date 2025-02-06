import { GenerateMealPlanProps, MealPlanResponse } from "@/types";

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

    const { embedding }: { embedding: Array<number> } = await res.json();

    if (!embedding) {
      return { error: "No embedding found" };
    }

    return { embedding };
  } catch (error) {
    console.error(error);
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
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const response = await res.json();

    /**
     * Extract mealPlan from the response
     * and assign a type to it for type safety and to understand the structure of the data
     */
    const { mealPlan }: { mealPlan: MealPlanResponse["recipes"] } = response;

    if (!mealPlan) {
      setIsMealPlanLoading(false);
      return { error: "No meal plan found" };
    }

    console.log("---- mealPlan ----", mealPlan);

    // Set the final recipes with images
    setRecipes(mealPlan);
    setIsMealPlanLoading(false);
  } catch (error) {
    console.error("Error generating meal plan:", error);
  } finally {
    setIsMealPlanLoading(false);
  }
};
