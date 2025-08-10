import React from 'react';
import Link from 'next/link';
import { toolsData, toolCategories } from '@/lib/data/toolsData';

export default function ToolNotFound() {
  // Get some popular tools to suggest
  const popularTools = toolsData.filter(tool => tool.popular).slice(0, 6);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Tool Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The tool you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Browse All Tools
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            View Categories
          </Link>
        </div>

        {/* Popular Tools Section */}
        {popularTools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Popular Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTools.filter(tool => tool.route).map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.route!}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
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

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {toolCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="text-3xl mb-2">
                  {React.cloneElement(category.icon, { 
                    style: { fontSize: '2rem', color: '#3b82f6' } 
                  })}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Can't find what you're looking for? Try browsing our categories or return to the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}