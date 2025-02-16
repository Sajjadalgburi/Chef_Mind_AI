"use client";

import { getAllRecipes } from "@/actions";
import { BentoGridSection } from "@/components/BentoGrid";
import { MealPlanResponse } from "@/types";
import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const PublicPage = () => {
  const [publicRecipes, setPublicRecipes] = useState<{
    users: User[];
    recipes: MealPlanResponse["recipes"];
  }>({ users: [], recipes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
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
        const { users, recipes } = associatedUsers;
        setPublicRecipes({ users, recipes });
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <section className="w-full h-full my-10">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <BentoGridSection content={publicRecipes} isLoading={loading} />
        </div>
      )}
    </section>
  );
};

export default PublicPage;
