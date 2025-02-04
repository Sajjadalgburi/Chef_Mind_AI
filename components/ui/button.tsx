import type React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "default";
  size?: "sm" | "lg";
}

export const Button = ({
  children,
  variant = "default",
  size = "lg",
  ...props
}: ButtonProps) => {
  const sizeClass = size === "sm" ? "text-sm px-2 py-1" : "text-base px-4 py-2";
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800"
      : "bg-yellow-500 text-white hover:bg-yellow-600";

  return (
    <button
      className={`rounded-md ${sizeClass} ${variantClass} font-medium transition-colors`}
      {...props}
    >
      {children}
    </button>
  );
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "secondary";
}

export const Badge = ({
  children,
  variant = "secondary",
  ...props
}: BadgeProps) => {
  const variantClass =
    variant === "secondary"
      ? "bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs"
      : "";

  return (
    <span className={`${variantClass}`} {...props}>
      {children}
    </span>
  );
};
