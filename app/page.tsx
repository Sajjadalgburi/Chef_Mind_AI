"use client";

import Hero from "../components/Hero";
import ImageUploadSection from "../components/Homepage-stuff/ImageUploadSection";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { handleGenerate } from "@/helpers";
import MealCards from "@/components/Meal-Card/MealCards";
import { MealPlanResponse } from "@/types";
import useAuth from "@/hooks/useAuth";

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

  const { user } = useAuth();

  const processImage = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      if (blob.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        setImage(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const handleGenerateClick = async () => {
    if (user === null) {
      const fakeEvent = () => {};
      fakeEvent();
    } else {
      await handleGenerate({
        image: image as string,
        setLoading,
        setShowResults,
        setIsMealPlanLoading,
        setRecipes,
        userId: user?.id ?? "",
      });
    }
  };

  return (
    <main className="min-h-screen bg-base-200">
      <section className="container mx-auto px-4">
        <Toaster position="top-center" reverseOrder={false} />

        {showResults ? (
          <MealCards
            isMealPlanLoading={isMealPlanLoading}
            recipes={recipes as MealPlanResponse["recipes"]}
            setRecipes={setRecipes}
          />
        ) : (
          <div className="flex flex-col items-center gap-8 py-8">
            <Hero image={image as string} />
            <ImageUploadSection
              setImage={setImage}
              image={image}
              loading={loading}
              handleGenerate={handleGenerateClick}
              processImage={processImage}
            />
          </div>
        )}
      </section>
    </main>
  );
}
