"use client";

import { getAllRecipes } from "@/actions";
import { BentoGridSection } from "@/components/BentoGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { MealPlanResponse } from "@/types";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Filter } from "lucide-react";

const PublicPage = () => {
  const [publicRecipes, setPublicRecipes] = useState<
    MealPlanResponse["recipes"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const { error, associatedUsers } = await getAllRecipes();

        if (typeof error === "object" && error !== null) {
          const { recipesError, userError } = error;

          if (recipesError) {
            toast.error(recipesError.message);
          }

          if (userError) {
            toast.error(userError);
          }
        }

        if (associatedUsers) {
          const { recipes } = associatedUsers;
          setPublicRecipes(recipes);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        toast.error("Error fetching recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = publicRecipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const cuisines = [
    "All",
    ...new Set(publicRecipes.map((recipe) => recipe.cuisine)),
  ];

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Recipes</h1>
          <p className="text-lg text-base-content/70">
            Discover and share delicious recipes from our community
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search functionality */}
          <div className="flex-1 join">
            <div className="join-item btn btn-square btn-ghost">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search recipes..."
              className="input input-bordered join-item flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="join">
            <div className="join-item btn btn-square btn-ghost">
              <Filter className="w-5 h-5" />
            </div>
            <select
              className="select select-bordered join-item"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>

        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 auto-rows-[300px]">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="card bg-base-100 shadow-xl">
                    <Skeleton className="h-48 w-full rounded-t-2xl" />
                    <div className="card-body">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2 mt-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredRecipes.length > 0 ? (
            <BentoGridSection content={filteredRecipes} />
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold mb-2">No recipes found</h3>
                <p className="text-base-content/70">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default PublicPage;
