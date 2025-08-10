export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-full mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mb-6 animate-pulse"></div>
          
          {/* Tags skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse"></div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/6 animate-pulse"></div>
          </div>
          
          {/* Tool interface skeleton */}
          <div className="mt-8 space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}