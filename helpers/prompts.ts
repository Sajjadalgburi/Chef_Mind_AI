import { IngredientsType, MetaDataResponse } from "@/types";

export const getMealPlanPrompt = (
  metadata: MetaDataResponse,
  ingredients: IngredientsType
) => {
  const prompt = `
You are a professional chef and culinary expert. Using the provided ingredients from a users fridge and recipe metadata, create a detailed and personalized meal plan.


AVAILABLE INGREDIENTS IN THE USER'S FRIDGE:
${ingredients
  .map((ing) => `- ${ing.name} (${ing.quantity}) [${ing.category}]`)
  .join("\n")}

RELEVANT RECIPE CONTEXT:
${metadata.map((item) => item.text).join("\n")}

TASK:
Generate 8-10 creative recipe suggestions that:
- Primarily use the available ingredients
- Are inspired by the provided recipe metadata
- Include substitution suggestions for any missing essential ingredients
- Consider ingredient quantities and portions

IMPORTANT: MAKE SURE TO RETURN JSON FORMAT EXACTLY AS SHOWN BELOW

OUTPUT FORMAT:
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
      "tips": [
        "Cooking tip 1...",
        "Cooking tip 2..."
      ]
    }
  ]
}`;

  return prompt;
};
