import React from "react";
import Image from "next/image";

const MealCards = () => {
  return (
    <div className="gap-8 mx-auto px-4 w-full mb-[5rem] sm:mb-0 py-6 sm:py-[5rem] flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <h1 className="md:text-6xl text-left mb-8 font-bold text-gray-800">
          Your Meal Plan:
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    // src={`https://picsum.photos/seed/${index}/400/300`}
                    src={`/images/meal-${index + 1}.jpg`}
                    alt="Recipe"
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                    Meal {index + 1}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Seven Layer Salad
                  </h3>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Ingredients:
                    </h4>
                    <ul className="text-sm text-gray-600 list-disc pl-4">
                      <li>1 head shredded lettuce</li>
                      <li>1 c. chopped diced celery</li>
                      <li>1 c. chopped onion</li>
                      {/* Show only first 3 ingredients */}
                      <li className="text-gray-500 italic">
                        +5 more ingredients
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Directions:
                    </h4>
                    <p className="text-sm text-gray-600">
                      Place peas in boiling water and boil 1 minute, drain and
                      cool.
                    </p>
                  </div>

                  <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200">
                    View Full Recipe
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MealCards;
