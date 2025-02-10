import { Loader2 } from "lucide-react";
import React from "react";

type GenerateButtonProps = {
  loading: boolean;
  handleGenerate: () => void;
};

const GenerateButton = ({ loading, handleGenerate }: GenerateButtonProps) => {
  return (
    <>
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
    </>
  );
};

export default GenerateButton;
