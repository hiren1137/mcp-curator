import { Suspense } from 'react';
import { MCPTool } from '@/lib/types';
import Link from 'next/link';
import { generateSlug } from '@/lib/mcp-data';
import DirectoryContent from './components/DirectoryContent';

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">MCP Curator</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/directory" className="text-blue-600 font-medium">
                Directory
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600">
                Categories
              </Link>
              <Link href="/submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Submit Tool
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <DirectoryContent />
      </Suspense>
    </div>
  );
}

export function ToolCard({ tool }: { tool: MCPTool }) {
  const slug = generateSlug(tool.name);
  
  return (
    <Link href={`/mcp/${slug}`} className="block">
      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{tool.name}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ml-2">
            {tool.category}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{tool.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-gray-500 text-xs">+{tool.tags.length - 3} more</span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600">{tool.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm text-gray-500">{tool.stars}</span>
            </div>
          </div>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded capitalize">
            {tool.language}
          </span>
        </div>
      </div>
    </Link>
  );
}