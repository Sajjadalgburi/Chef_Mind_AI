import React from "react";
import { Label } from "./ui/label";
import Link from "next/link";
import { Input } from "./ui/input";
import { SubmitButton } from "./submit-button";
import { FormMessage, Message } from "./form-message";
import { signInAction, signUpAction } from "@/actions/actions";

type AuthFormProps = {
  searchParams: Message | Promise<Message>;
  type: "login" | "register";
};

const AuthForm = async (props: AuthFormProps) => {
  const { searchParams } = props;

  return (
    <form className="flex flex-col min-w-64 md:min-w-80 mx-auto bg-white p-7 rounded-lg shadow-2xl">
      <h1 className="sm:text-4xl font-2xl font-bold">
        {props.type === "login" ? "Login" : "Register"}
      </h1>

      <p className="text-sm text-foreground">
        {props.type === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <Link
          className="text-primary font-medium underline"
          href={props.type === "login" ? "/sign-up" : "/sign-in"}
        >
          {props.type === "login" ? "Register" : "Login"}
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        {/* Only shows on register */}
        {props.type === "register" && (
          <>
            <Label htmlFor="username">Username</Label>
            <Input name="username" placeholder="you@example.com" required />
          </>
        )}

        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>

        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
        />

        {props.type === "login" ? (
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Login
          </SubmitButton>
        ) : (
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Register
          </SubmitButton>
        )}

        <FormMessage message={searchParams as Message} />
      </div>
    </form>
  );
};

export default AuthForm;
