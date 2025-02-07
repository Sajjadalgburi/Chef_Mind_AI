import { IngredientsType, MetaDataResponse } from "@/types";

export const getMealPlanPrompt = (
  metadata: MetaDataResponse,
  ingredients: IngredientsType
) => {
  const recipeContext = metadata.map((item) => {
    return `Item: ${item.text}, Source: ${item.source}`;
  });

  const prompt = `
You are a professional chef and culinary expert. Using the provided ingredients from a user's fridge and relevant recipe metadata, create a personalized meal plan.

AVAILABLE INGREDIENTS IN THE USER'S FRIDGE:
${ingredients
  .map((ing) => `- ${ing.name} (${ing.quantity}) [${ing.category}]`)
  .join("\n")}

RELEVANT RECIPE CONTEXT (INCLUDING ORIGINAL SOURCES):
${recipeContext.join("\n")}

TASK:
Generate 4-6 (even numbers) creative recipe suggestions that:
- Primarily use the available ingredients
- Are inspired by the provided recipe metadata
- The first recipe in the array should use the most ingredients from the user's fridge, and so on
- Include substitution suggestions for any missing essential ingredients
- Consider ingredient quantities and portions

IMPORTANT: ENSURE THE OUTPUT IS IN THE EXACT JSON FORMAT BELOW.

### OUTPUT FORMAT:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "cuisine": "Cuisine Type",
      "difficulty": "Easy/Medium/Hard",
      "prepTime": "XX minutes",
      "cookTime": "XX minutes",
      "servings": "X servings",
      "ingredients": [
        {
          "item": "Ingredient name",
          "amount": "Quantity",
          "required": true/false,
          "substitute": "Possible substitution if not available"
        }
      ],
      "instructions": [
        "Step 1...",
        "Step 2..."
      ],
      "nutritionalInfo": {
        "calories": "XXX per serving",
        "protein": "XXg",
        "carbs": "XXg",
        "fat": "XXg"
      },
      "imagePrompt": "Detailed description for DALL-E image generation",
      "source": "Original source of the recipe from provided metadata",
      "tips": [
        "Cooking tip 1...",
        "Cooking tip 2..."
      ]
    }
  ]
}

IMPORTANT: Ensure that the "source" field for each recipe correctly maps to the relevant source from the provided metadata.
`;

  return prompt;
};
