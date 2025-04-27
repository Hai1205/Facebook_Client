export function TableUserSkeleton() {
    return (
      <div className="w-full animate-pulse">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="flex items-center space-x-4 py-4 border-b border-gray-200"
          >
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  } 