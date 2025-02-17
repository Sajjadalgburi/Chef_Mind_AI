"use client";

import { getAllRecipes } from "@/actions";
import { BentoGridSection } from "@/components/BentoGrid";
import { BentoGrid } from "@/components/ui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { MealPlanResponse } from "@/types";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PublicPage = () => {
  const [publicRecipes, setPublicRecipes] = useState<
    MealPlanResponse["recipes"]
  >([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="w-full h-full my-10">
      {loading ? (
        <BentoGrid>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </BentoGrid>
      ) : publicRecipes.length > 1 ? (
        <div className="flex justify-center items-center h-full">
          <BentoGridSection content={publicRecipes} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p>No recipes found</p>
        </div>
      )}
    </section>
  );
};

export default PublicPage;
