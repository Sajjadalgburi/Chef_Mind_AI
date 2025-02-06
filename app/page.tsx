"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ImageUploadSection from "../components/ImageUploadSection";
import Footer from "../components/Footer";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  generateIngredientEmbedding,
  generateMealPlan,
  getEmbeddingMetaData,
} from "@/helpers";
import MealCards from "@/components/MealCards";
import { IngredientsType, MealPlanResponse, MetaDataResponse } from "@/types";
import { getMealPlanPrompt } from "@/helpers/prompts";

/**
 * Description: This is the main component for the home page. It contains the image upload section, the meal cards, and the footer.
 * @returns JSX.Element
 */

export default function Home() {
  const [image, setImage] = useState<string | null>(null);

  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMealPlanLoading, setIsMealPlanLoading] = useState(false);
  const [recipes, setRecipes] = useState<MealPlanResponse["recipes"]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("Please upload an image");
      setImage(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      setImage(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
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

      // if the embedding is an error, return
      if (typeof embedding === "string" || "error" in embedding) {
        toast.error("Error generating embeddings");
        return;
      }

      // grabbing the metadata from pinecone database
      const metadata: MetaDataResponse = await getEmbeddingMetaData(embedding);

      if (!metadata) {
        toast.error("No recipes found for these ingredients. Please try again");
        setTimeout(() => {
          setShowResults(false);
        }, 3000);
        return;
      }

      const prompt = getMealPlanPrompt(
        metadata,
        ingredients as IngredientsType
      );

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

  return (
    <main className="min-h-screen flex flex-col justify-between items-center mx-auto bg-gradient-to-b">
      <div className="w-full max-w-4xl">
        <Header />
        <Toaster position="top-center" reverseOrder={false} />
      </div>

      {showResults ? (
        <MealCards
          isMealPlanLoading={isMealPlanLoading}
          recipes={recipes as MealPlanResponse["recipes"]}
        />
      ) : (
        <div className="flex flex-col items-center justify-between gap-4 px-4 max-w-4xl text-center mb-[5rem] sm:mb-0">
          <Hero />

          <ImageUploadSection
            setImage={setImage}
            image={image}
            loading={loading}
            handleImageUpload={handleImageUpload}
            handleGenerate={handleGenerate}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}
