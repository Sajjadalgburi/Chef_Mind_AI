"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function ImageUploadSection() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Card className="p-4 md:p-6 bg-white/50 backdrop-blur-sm border shadow-xl border-gray-200 w-full max-w-[100%] md:max-w-[80%] mx-auto">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full">
          {image ? (
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={image}
                alt="Uploaded content"
                className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover"
                width={1920}
                height={1080}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white/100 transition-colors"
              >
                Remove
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-[200px] sm:h-[250px] md:h-[300px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors">
              <Upload className="h-8 w-8 md:h-10 md:w-10 text-gray-400 mb-4" />
              <div className="text-gray-600 text-center px-4">
                <span className="font-medium text-sm sm:text-lg md:text-xl">
                  Click to upload
                </span>{" "}
                or drag and drop
                <p className="text-sm sm:text-sm text-gray-500 mt-2 md:mt-3">
                  PNG, JPG up to 10MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>
          )}
        </div>
        <Button
          size="lg"
          aria-disabled={!image || loading}
          onClick={handleGenerate}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
              Processing...
            </div>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
    </Card>
  );
}
