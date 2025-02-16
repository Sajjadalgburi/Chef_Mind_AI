import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "./badge";
import { User } from "@supabase/supabase-js";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  cuisine,
  difficulty,
  prepTime,
  imageUrl,
  creator,
  createdAt,
  onClick,
}: {
  className?: string;
  title: string;
  description?: string;
  header?: React.ReactNode;
  cuisine: string;
  difficulty: string;
  prepTime: string;
  imageUrl?: string;
  creator?: User;
  createdAt: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 cursor-pointer",
        className
      )}
    >
      <div className="relative h-48 w-full rounded-lg overflow-hidden">
        <Image
          src={imageUrl || "/images/placeholder-image.jpg"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-black/60" />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {cuisine}
          </Badge>
          <Badge
            className={cn(
              difficulty === "Easy" && "bg-green-500",
              difficulty === "Medium" && "bg-yellow-500",
              difficulty === "Hard" && "bg-red-500"
            )}
          >
            {difficulty}
          </Badge>
        </div>
      </div>

      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2">
          {title}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {prepTime}
          </span>
          {creator && (
            <div className="flex items-center gap-2">
              <Image
                src={
                  creator.user_metadata?.avatar_url ||
                  "/images/default-avatar.png"
                }
                alt={creator.user_metadata?.full_name || "User"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm text-gray-600">
                {creator.user_metadata?.full_name || "Anonymous User"}
              </span>
            </div>
          )}
          <span className="text-xs text-neutral-600 dark:text-neutral-300">
            {createdAt}
          </span>
        </div>
      </div>
    </div>
  );
};
