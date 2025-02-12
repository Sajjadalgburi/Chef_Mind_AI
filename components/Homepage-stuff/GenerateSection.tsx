"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  loading: boolean;
  handleGenerate: () => void;
};

const GenerateSection: React.FC<Props> = ({ loading, handleGenerate }) => {
  const { data: session } = useSession();

  return (
    <>
      {!session ? (
        <Button
          variant="default"
          size="lg"
          className="w-1/2 mx-auto hover:cursor-not-allowed"
        >
          Must Sign In to Generate
        </Button>
      ) : (
        <button
          className={`cursor-pointer w-full sm:max-w-md p-3 sm:p-4 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 text-white
            ${
              loading
                ? "bg-slate-400 hover:bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-indigo-500/25"
            }`}
          disabled={loading}
          onClick={handleGenerate}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-sm sm:text-base">Processing</span>
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            </div>
          ) : (
            <span className="text-sm sm:text-base">Generate</span>
          )}
        </button>
      )}
    </>
  );
};

export default GenerateSection;
