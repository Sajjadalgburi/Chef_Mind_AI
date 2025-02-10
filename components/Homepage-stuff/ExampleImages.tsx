import { imagesPic } from "@/helpers";
import React from "react";
import Image from "next/image";

type ExampleImagesProps = {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  image: string;
};

const ExampleImages = ({ setImage, image }: ExampleImagesProps) => {
  return (
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
  );
};

export default ExampleImages;
