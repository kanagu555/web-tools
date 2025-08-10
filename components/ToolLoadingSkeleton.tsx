'use client';

export default function ToolLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="animate-pulse">
            {/* Tool title skeleton */}
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            
            {/* Tool description skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
            
            {/* Tool interface skeleton */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex space-x-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}