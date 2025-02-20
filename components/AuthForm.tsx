/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Skeleton } from "./ui/skeleton";

const AuthForm = () => {
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProviders();

      if (!res) return;

      setProviders(res);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-3xl text-center justify-center">
          Welcome to Chef Mind
        </h1>

        <p className="text-base text-center text-base-content/70 mt-2">
          Sign in with your favorite provider to get started
        </p>

        <div className="flex flex-col gap-4 mt-6">
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
                  setIsLoggingIn(true);
                }}
                disabled={isLoggingIn}
                className={`btn btn-lg gap-3 ${
                  provider.name === "Google"
                    ? "btn-outline"
                    : "btn-primary"
                } ${isLoggingIn ? "btn-disabled" : ""}`}
              >
                {provider.name === "Google" ? <FaGoogle /> : <FaGithub />} Sign in
                with {provider.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
