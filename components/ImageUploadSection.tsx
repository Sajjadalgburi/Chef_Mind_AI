"use client";

import { Dispatch, SetStateAction } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SignedOut, SignUpButton, SignedIn } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { imagesPic } from "@/helpers";

type Props = {
  setImage: Dispatch<SetStateAction<string | null>>;
  image: string | null;
  loading: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerate: () => void;
};

const ImageUploadSection: React.FC<Props> = ({
  setImage,
  image,
  loading,
  handleImageUpload,
  handleGenerate,
}) => {
  return (
    <div className="flex flex-row md:flex-col items-center gap-4 w-full">
      {/* Section for preset images users can choose from of you dont want to upload their own */}

      <Card className="p-4 md:p-6 bg-white/50 backdrop-blur-sm border shadow-xl border-gray-200 w-full max-w-[100%] md:max-w-[80%] mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            {image ? (
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt="Uploaded content"
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => setImage(null)}
                >
                  Remove
                </button>
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
          <SignedOut>
            <SignUpButton mode="modal">
              <Button variant="default" size="lg">
                Must Sign In to Generate
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <button
              className={`cursor-pointer w-full sm:max-w-md p-3 sm:p-4 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 text-white
            ${
              loading
                ? "bg-slate-400 hover:bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-indigo-500/25"
            }`}
              disabled={loading}
              onClick={handleGenerate}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-sm sm:text-base">Processing</span>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                </div>
              ) : (
                <span className="text-sm sm:text-base">Generate</span>
              )}
            </button>{" "}
          </SignedIn>
        </div>
      </Card>
      <div className="w-full max-w-[100%] md:max-w-[80%] mx-auto">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Or choose from our example images:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagesPic.map((preset, index) => (
            <div
              key={index}
              onClick={() => setImage(preset.src)}
              className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-300 

                ${
                  image === preset.src
                    ? "ring-4 ring-yellow-500 scale-95"
                    : "hover:scale-95"
                }
              `}
            >
              <Image
                src={preset.src}
                alt={preset.alt}
                width={300}
                height={200}
                className="w-full h-[120px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
