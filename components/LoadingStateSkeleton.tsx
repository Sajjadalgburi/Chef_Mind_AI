import React from "react";
import { Skeleton } from "./ui/skeleton";

const LoadingStateSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 auto-rows-[300px]">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-xl">
            <Skeleton className="h-48 w-full rounded-t-2xl" />
            <div className="card-body">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default LoadingStateSkeleton;
