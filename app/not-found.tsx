import React from 'react';
import Link from 'next/link';
import { toolsData, toolCategories } from '@/lib/data/toolsData';

export default function NotFound() {
  // Get some popular tools to suggest
  const popularTools = toolsData.filter(tool => tool.popular).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
            Go Home
          </Link>
          
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
            Browse Categories
          </Link>
        </div>

        {/* Popular Tools Section */}
        {popularTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Popular Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularTools.filter(tool => tool.route).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.route!}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{tool.icon}</span>
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

        {/* Categories Quick Access */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tool Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {toolCategories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-center"
              >
                <div className="text-2xl mb-1">
                  {React.cloneElement(category.icon, { 
                    style: { fontSize: '1.5rem', color: '#3b82f6' } 
                  })}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-xs">
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Looking for something specific? Try browsing our tool categories or return to the homepage to explore all available tools.
          </p>
        </div>
      </div>
    </div>
  );
}