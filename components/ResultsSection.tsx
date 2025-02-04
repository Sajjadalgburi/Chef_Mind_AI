"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ResultsSection() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const generateMeals = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setResults([
        "Vegetable Stir Fry",
        "Chicken and Rice Casserole",
        "Greek Salad",
        "Omelette with Cheese and Herbs",
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Suggested Meals
      </h2>
      {results.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Upload a photo of your fridge to get personalized meal suggestions!
          </p>
          <Button onClick={generateMeals} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Meals...
              </>
            ) : (
              "Generate Meal Suggestions"
            )}
          </Button>
        </div>
      ) : (
        <ul className="list-disc pl-6">
          {results.map((meal, index) => (
            <li key={index} className="text-gray-700 mb-2">
              {meal}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
