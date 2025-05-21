import React from "react";

export function SkeletonMessage() {
  return (
    <div className="animate-pulse mb-3 flex flex-col gap-2">
      {/* Tin nhắn người nhận (bên trái) */}
      <div className="text-left pl-6 relative">
        <div className="absolute top-0 left-0">
          <div className="h-5 w-5 rounded-full bg-gray-600" />
        </div>
        <div className="inline-block max-w-[70%] rounded-lg px-3 py-2 bg-gray-700">
          <div className="h-3 w-28 bg-gray-600 rounded mb-2"></div>
          <div className="h-3 w-40 bg-gray-600 rounded"></div>
          <div className="h-2 w-10 bg-gray-600 rounded mt-2"></div>
        </div>
      </div>

      {/* Tin nhắn người gửi (bên phải) */}
      <div className="text-right pr-6 relative">
        <div className="absolute top-0 right-0">
          <div className="h-5 w-5 rounded-full bg-gray-600" />
        </div>
        <div className="inline-block max-w-[70%] rounded-lg px-3 py-2 bg-blue-600">
          <div className="h-3 w-32 bg-blue-500 rounded mb-2"></div>
          <div className="h-3 w-20 bg-blue-500 rounded"></div>
          <div className="h-2 w-10 bg-blue-400 rounded mt-2"></div>
        </div>
      </div>

      {/* Tin nhắn người nhận (bên trái) - ngắn hơn */}
      <div className="text-left pl-6 relative">
        <div className="absolute top-0 left-0">
          <div className="h-5 w-5 rounded-full bg-gray-600" />
        </div>
        <div className="inline-block max-w-[70%] rounded-lg px-3 py-2 bg-gray-700">
          <div className="h-3 w-20 bg-gray-600 rounded"></div>
          <div className="h-2 w-10 bg-gray-600 rounded mt-2"></div>
        </div>
      </div>
    </div>
  );
}
