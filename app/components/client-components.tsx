'use client';

import { useState } from 'react';
import { MCPTool } from '@/lib/types';
import Link from 'next/link';
import { generateSlug } from '@/lib/mcp-data';
import { formatNumber } from '@/lib/github-api';

interface CategoryInfo {
  name: string;
  count: number;
  description: string;
}

export function SearchAndStats({ allTools, categories }: { allTools: MCPTool[], categories: CategoryInfo[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search MCP tools, servers, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-xl border border-slate-300/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg shadow-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                window.location.href = `/directory?search=${encodeURIComponent(searchQuery)}`;
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
            <button
              onClick={() => {
                if (searchQuery.trim()) {
                  window.location.href = `/directory?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 shadow-lg">
          <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {allTools.length}+
          </div>
          <div className="text-slate-600 font-medium">MCP Tools & Servers</div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 shadow-lg">
          <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {categories.length}
          </div>
          <div className="text-slate-600 font-medium">Categories</div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 shadow-lg">
          <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            10K+
          </div>
          <div className="text-slate-600 font-medium">Developers</div>
        </div>
      </div>
    </>
  );
}

export function FeaturedToolsSection({ featuredTools }: { featuredTools: MCPTool[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredTools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}

function ToolCard({ tool }: { tool: MCPTool }) {
  const slug = generateSlug(tool.name);
  
  return (
    <Link href={`/mcp/${slug}`} className="block group">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
        <div className="flex justify-between items-start mb-6">
          <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {tool.name}
          </h4>
          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 ml-3">
            {tool.category}
          </span>
        </div>
        
        <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="text-slate-500 text-xs font-medium">+{tool.tags.length - 3}</span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200/60">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-sm font-semibold text-slate-900">{formatNumber(tool.stars)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm text-slate-500">{formatNumber(tool.stars)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-slate-500 capitalize">{tool.language}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}