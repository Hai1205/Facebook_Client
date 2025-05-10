import { ScrollArea } from "@/components/ui/scroll-area"

export function UserSkeletonLoading() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[310px] pr-4">
        <div className="space-y-4">
          {skeletonItems.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between gap-4 rounded-lg border border-gray-800 p-3 bg-gray-900/50"
            >
              <div className="flex items-center gap-3">
                {/* Avatar skeleton */}
                <div className="h-10 w-10 rounded-full bg-gray-800 animate-pulse" />
                
                <div>
                  {/* Name skeleton - longer line */}
                  <div className="h-5 w-32 rounded-md bg-gray-800 animate-pulse" />
                  
                  {/* Email skeleton - shorter line */}
                  <div className="h-4 w-28 mt-1.5 rounded-md bg-gray-800 animate-pulse" />
                </div>
              </div>
              
              {/* Followers count skeleton */}
              <div className="h-4 w-20 rounded-md bg-gray-800 animate-pulse" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
