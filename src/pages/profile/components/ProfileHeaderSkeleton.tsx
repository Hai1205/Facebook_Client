import { Skeleton } from "@/components/ui/skeleton";

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="relative">
      {/* Cover photo skeleton */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Profile section skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end md:space-x-5">
          {/* Avatar skeleton */}
          <Skeleton className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-700" />
        </div>
      </div>
    </div>
  );
};
