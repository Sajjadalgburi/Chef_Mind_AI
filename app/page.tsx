"use client";

import Hero from "../components/Hero";
import ImageUploadSection from "../components/ImageUploadSection";
import Footer from "../components/Footer";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { handleGenerate } from "@/helpers";
import MealCards from "@/components/Meal-Card/MealCards";
import { MealPlanResponse } from "@/types";

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

  const handleGenerateClick = async () => {
    await handleGenerate({
      image: image as string,
      setLoading,
      setShowResults,
      setIsMealPlanLoading,
      setRecipes,
    });
  };

  return (
    <main className="min-h-screen flex flex-col justify-between items-center mx-auto bg-gradient-to-b">
      <div className="w-full max-w-4xl">
        <Toaster position="top-center" reverseOrder={false} />
      </div>

      {showResults ? (
        <MealCards
          isMealPlanLoading={isMealPlanLoading}
          recipes={recipes as MealPlanResponse["recipes"]}
        />
      ) : (
        <div className="flex flex-col items-center justify-between gap-4 px-4 w-full text-center mb-[5rem] sm:mb-0">
          <Hero image={image as string} />

          <ImageUploadSection
            setImage={setImage}
            image={image}
            loading={loading}
            handleImageUpload={handleImageUpload}
            handleGenerate={handleGenerateClick}
          />
        </div>
      )}
      <Footer />
    </main>
  );
}
