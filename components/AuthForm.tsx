/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Skeleton } from "./ui/skeleton";

const AuthForm = () => {
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getProviders();

      if (!res) return;

      setProviders(res);
      setIsLoading(false);
    })();
  }, []);

  return (
    <form className="flex flex-col w-[90%] md:w-[500px] mx-auto bg-white p-8 rounded-lg shadow-2xl">
      <h1 className="text-3xl text-center md:text-4xl font-bold mb-6">
        Welcome to Chef Mind
      </h1>

      <p className="text-base text-center text-foreground mb-8">
        Sign in with your favorite provider to get started
      </p>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <Skeleton className="w-full h-14" />
            <Skeleton className="w-full h-14" />
          </div>
        ) : (
          providers &&
          Object.values(providers).map((provider: any) => (
            <button
              type="button"
              key={provider.name as string}
              onClick={() => {
                signIn(provider.id as string, {
                  redirectTo: "/",
                });
              }}
              className={`flex items-center justify-center capitalize gap-3 p-4 border rounded-lg ${
                provider.name === "Google"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              } text-lg hover:opacity-90 transition-opacity`}
            >
              {provider.name === "Google" ? <FaGoogle /> : <FaGithub />} Sign in
              with {provider.name}
            </button>
          ))
        )}
      </div>
    </form>
  );
};

export default AuthForm;
