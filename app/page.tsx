"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import ImageUploadSection from "../components/ImageUploadSection";
import Footer from "../components/Footer";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

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
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    setLoading(true);
    if (!image) {
      toast.error("Please upload an image");
      setLoading(false);
      return;
    }

    setLoading(true);
    setShowResults(false);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <main className="min-h-screen max-w-4xl flex flex-col justify-between items-center mx-auto bg-gradient-to-b">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />

      {!showResults ? (
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
      ) : (
        <div className="flex flex-col items-center justify-between gap-4 px-4 max-w-4xl text-center mb-[5rem] sm:mb-0">
          <h1>Results</h1>
        </div>
      )}
      <Footer />
    </main>
  );
}
