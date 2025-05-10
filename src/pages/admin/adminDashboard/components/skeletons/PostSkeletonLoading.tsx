import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText } from "lucide-react"

export function PostSkeletonLoading() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[310px] pr-4">
        <div className="space-y-4">
          {skeletonItems.map((item) => (
            <div
              key={item}
              className="relative flex flex-col gap-2 rounded-lg border border-gray-800 bg-gray-900/30 p-3"
            >
              <div className="flex items-center gap-3">
                {/* Document icon placeholder */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/80 animate-pulse">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>

                <div className="flex-1">
                  {/* Title skeleton */}
                  <div className="h-5 w-40 rounded-md bg-gray-800 animate-pulse mb-1.5" />

                  {/* Author skeleton */}
                  <div className="h-4 w-24 rounded-md bg-gray-800/70 animate-pulse" />
                </div>

                {/* Badge and interaction container */}
                <div className="flex items-center gap-3">
                  {/* Badge skeletons */}
                  <div className="h-6 w-20 rounded-md bg-gray-800 border animate-pulse" />
                  <div className="h-6 w-20 rounded-md bg-gray-800 border animate-pulse" />

                  {/* Interaction icons skeletons */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-md bg-gray-800 animate-pulse" />
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-md bg-gray-800 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
