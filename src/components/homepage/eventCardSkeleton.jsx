import React from 'react'

const EventCardSkeleton = () => {
    return (
        <div className="bg-white p-4  shadow-lg rounded-lg overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="w-full h-48 bg-gray-300 rounded"></div>
    
          {/* Title Skeleton */}
          <div className="mt-4 h-6 bg-gray-300 w-3/4 rounded"></div>
    
          {/* Date & Icon Skeleton */}
          <div className="mt-2 flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
          </div>
    
          {/* Description Skeleton */}
          <div className="mt-2 h-4 bg-gray-300 w-5/6 rounded"></div>
    
          {/* Button Skeleton */}
          <div className="mt-4 h-8 bg-gray-300 w-24 rounded"></div>
        </div>
      );
}

export default EventCardSkeleton
  