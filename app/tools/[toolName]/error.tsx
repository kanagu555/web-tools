'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { logPageError } from '@/lib/utils/errorLogging';
import { toolsData } from '@/lib/data/toolsData';
import { getToolIcon } from '@/lib/utils/toolIcons';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ToolError({ error, reset }: ErrorProps) {
  const params = useParams();
  const toolName = params?.toolName as string;

  useEffect(() => {
    // Log the error using our comprehensive error logging system
    logPageError(error, `tools/${toolName}`, { toolName });
  }, [error, toolName]);

  // Get some alternative tools to suggest
  const currentTool = toolsData.find(tool => tool.route?.includes(toolName));
  const suggestedTools = toolsData
    .filter(tool => 
      tool.category === currentTool?.category && 
      tool.id !== currentTool?.id &&
      tool.route
    )
    .slice(0, 3);

  const handleRetry = () => {
    try {
      reset();
    } catch (resetError) {
      console.error('Error during reset:', resetError);
      // Fallback: reload the page
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Tool Error
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We encountered an error while loading the <strong>{currentTool?.title || toolName}</strong> tool. 
            This might be a temporary issue.
          </p>
        </div>

        {/* Error Actions Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            What can you do?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Try Again</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Click the retry button to reload the tool
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Check Connection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ensure your internet connection is stable
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Try Similar Tools</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Browse other tools in the same category
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
          {currentTool?.category && (
            <Link
              href={`/category/${currentTool.category}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Browse Category
            </Link>
          )}
        </div>

        {/* Suggested Similar Tools */}
        {suggestedTools.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Try Similar Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedTools.filter(tool => tool.route).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.route!}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl flex items-center justify-center">
                      {getToolIcon(tool.icon)}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-left">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left border border-red-200 dark:border-red-800">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Development Error Details:
            </h3>
            <div className="space-y-2">
              <div>
                <strong className="text-red-700 dark:text-red-300">Message:</strong>
                <pre className="text-sm text-red-700 dark:text-red-300 mt-1 overflow-auto">
                  {error.message}
                </pre>
              </div>
              {error.digest && (
                <div>
                  <strong className="text-red-700 dark:text-red-300">Error ID:</strong>
                  <span className="text-sm text-red-600 dark:text-red-400 ml-2">
                    {error.digest}
                  </span>
                </div>
              )}
              {error.stack && (
                <div>
                  <strong className="text-red-700 dark:text-red-300">Stack Trace:</strong>
                  <pre className="text-xs text-red-600 dark:text-red-400 mt-1 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            If this problem persists, please try clearing your browser cache or refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}