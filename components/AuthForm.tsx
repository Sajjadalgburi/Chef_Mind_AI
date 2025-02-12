"use client";
import React from "react";
import { signInWithProvider } from "@/lib/actions";
import { FaGoogle, FaGithub } from "react-icons/fa";

const providers = [
  {
    name: "gitHub",
    logo: <FaGithub />,
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    name: "google",
    logo: <FaGoogle />,
    bgColor: "bg-white",
    textColor: "text-black",
  },
];

const AuthForm = () => {
  return (
    <form className="flex flex-col w-[90%] md:w-[500px] mx-auto bg-white p-8 rounded-lg shadow-2xl">
      <h1 className="text-3xl text-center md:text-4xl font-bold mb-6">
        Welcome to Chef Mind
      </h1>

      <p className="text-base text-center text-foreground mb-8">
        Sign in with your favorite provider to get started
      </p>

      <div className="flex flex-col gap-4">
        {providers.map((provider) => (
          <button
            key={provider.name}
            onClick={() =>
              signInWithProvider(provider.name as "github" | "google")
            }
            className={`flex items-center justify-center capitalize gap-3 p-4 border rounded-lg ${provider.bgColor} ${provider.textColor} text-lg hover:opacity-90 transition-opacity`}
          >
            {provider.logo} Continue with {provider.name}
          </button>
        ))}
      </div>
    </form>
  );
};

export default AuthForm;
