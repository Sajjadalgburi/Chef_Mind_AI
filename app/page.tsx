"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ImageUploadSection from "../components/ImageUploadSection";
import Footer from "../components/Footer";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IngredientsType } from "./api/analyze-image/route";
import { generateIngredientEmbedding, getEmbeddingMetaData } from "@/helpers";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      if (!image) {
        toast.error("Please upload an image");
        return;
      }

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

      const embeddingResponse = await generateIngredientEmbedding(ingredients);

      if (!embeddingResponse || embeddingResponse.error) {
        toast.error("Error generating embeddings");
        return;
      }

      const { embedding } = embeddingResponse;

      console.log("---- embedding ----", embedding);

      if (!embedding) return;

      const metadata = await getEmbeddingMetaData(embedding);

      if (!metadata) {
        toast.error("No recipes found for these ingredients");
        return;
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error in handleGenerate:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen max-w-4xl flex flex-col justify-between items-center mx-auto bg-gradient-to-b">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />

      {showResults ? (
        <div className="flex flex-col items-center justify-between gap-4 px-4 max-w-4xl text-center mb-[5rem] sm:mb-0">
          <h1>Found Recipes</h1>
          {/* {recipes.map((recipe, index) => (
            <div key={index}>
              <pre>{JSON.stringify(recipe, null, 2)}</pre>
            </div>
          ))} */}
        </div>
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
