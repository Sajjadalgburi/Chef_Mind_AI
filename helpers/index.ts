import { GenerateMealPlanProps } from "@/types";

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

/**
 * Generate a meal plan based on the ingredients
 * @param param0
 * @returns
 */
export const generateMealPlan = async ({
  setMealPlanLoading,
  setRecipes,
  ingredients,
  metadata,
}: GenerateMealPlanProps) => {
  try {
    setMealPlanLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });

    const { AiMealPlan } = await res.json();

    if (!AiMealPlan) {
      return { error: "No meal plan found" };
    }

    setRecipes(AiMealPlan);
    setMealPlanLoading(false);
  } catch (error) {
    console.error(error);
  }
};
