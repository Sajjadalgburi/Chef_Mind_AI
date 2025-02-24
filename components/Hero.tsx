import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Hero({ image }: { image: string }) {
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => setImageLoading(false);
    }
  }, [image]);

  if (image && imageLoading) {
    return <Skeleton className="w-full h-[300px] rounded-lg" />;
  }

  return (
    <div
      className={`text-center max-w-4xl mx-auto px-6 sm:pt-20 sm:pb-16 ${
        image ? "hidden" : ""
      }`}
    >
      <h1
        className={`text-4xl md:text-6xl lg:text-7xl font-bold text-olive tracking-tight leading-tight mb-8`}
      >
        Turn your <span className="text-terracotta">fridge</span> into delicious{" "}
        <span className="text-terracotta">meals</span>
      </h1>

      <p
        className={`text-sage text-sm sm:text-lg md:text-xl max-w-2xl mx-auto`}
      >
        Upload a photo of your ingredients and let AI craft personalized
        recipes. Transform everyday ingredients into extraordinary dishes.
      </p>
    </div>
  );
}
