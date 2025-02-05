export const generateIngredientEmbedding = async (
  ingredientNames: string[]
) => {
  try {
    const res = await fetch("/api/openai-embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientNames }),
    });

    const {
      embedding,
      errorMessage,
    }: {
      embedding: number[];
      errorMessage: string;
    } = await res.json();

    if (errorMessage) {
      return { error: errorMessage };
    }

    return { embedding };
  } catch (error) {
    console.error(error);
  }
};
