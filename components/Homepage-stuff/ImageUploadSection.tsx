"use client";

import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "react-hot-toast";
import ExampleImages from "./ExampleImages";
import GenerateSection from "./GenerateSection";

type Props = {
  setImage: Dispatch<SetStateAction<string | null>>;
  image: string | null;
  loading: boolean;
  handleGenerate: () => void;
  processImage: (imageSrc: string) => void; // New function to process the image
};

const ImageUploadSection: React.FC<Props> = ({
  setImage,
  image,
  loading,
  handleGenerate,
  processImage,
}) => {
  // Watch for changes in the `image` state and process it
  useEffect(() => {
    if (image) {
      processImage(image);
    }
  }, [image, processImage]);

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
      const result = event.target?.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-row md:flex-col items-center gap-4 w-full">
      <Card className="p-4 md:p-6 bg-white/50 backdrop-blur-sm border shadow-xl border-gray-200 w-full max-w-[100%] md:max-w-[80%] mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            {image ? (
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt="Uploaded content"
                  className="w-full h-[90vh] object-cover"
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

          <GenerateSection loading={loading} handleGenerate={handleGenerate} />
        </div>
      </Card>

      {/* Example Images */}
      <ExampleImages setImage={setImage} image={image as string} />
    </div>
  );
};

export default ImageUploadSection;
