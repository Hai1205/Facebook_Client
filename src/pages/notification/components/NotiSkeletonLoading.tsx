export const NotiSkeletonLoading = () => {
  return (
    <div className="p-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 p-2 hover:bg-gray-800/50 rounded-md transition-colors"
        >
          {/* Avatar skeleton */}
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gray-800 animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-800/70 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
