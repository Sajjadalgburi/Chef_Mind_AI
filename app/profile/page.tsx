"use client";

import { MealPlanResponse } from "@/types";
import React, { useState, useEffect } from "react";
import { getUserRecipes } from "@/actions";
import useAuth from "@/hooks/useAuth";
import { getSupabaseClient } from "@/config/supbaseClient";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const [userRecipes, setUserRecipes] = useState<MealPlanResponse["recipes"]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const { user, session } = useAuth();
  const userId = user?.id as string;

  useEffect(() => {
    if (!userId || !session) return;

    const { supabaseAccessToken } = session;

    const supabaseClient = getSupabaseClient(supabaseAccessToken as string);

    if (!supabaseAccessToken || supabaseClient) return;

    const fetchUserRecipes = async () => {
      const recipes = await getUserRecipes(userId, supabaseClient);

      if (!recipes) return;
      setLoading(false);
      setUserRecipes(recipes as unknown as MealPlanResponse["recipes"]);
    };

    fetchUserRecipes();
  }, [userId, session]);

  return (
    <section className="min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Your Saved Recipes
        </h1>
        <p className="text-lg text-center text-gray-600 mt-2">
          Easily access your favorite meal plans anytime.
        </p>

        {loading ? (
          <div className="mt-10 text-center">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : userRecipes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              expedita cumque facere corporis, quos voluptas consectetur est
              soluta iste perferendis incidunt error autem illo ab nostrum
              laudantium minus culpa fuga.
            </p>
          </div>
        ) : (
          <div>No saved meals yet!</div>
        )}
      </div>
    </section>
  );
};

export default Profile;
