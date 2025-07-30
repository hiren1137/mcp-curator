'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllTools, getCategories } from '@/lib/mcp-data';
import { ToolCard } from '../page';

export default function DirectoryContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const allTools = getAllTools();
  const categories = getCategories();
  const languages = [...new Set(allTools.map(tool => tool.language))];

  // Read search query from URL parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

  const filteredAndSortedTools = useMemo(() => {
    let filtered = allTools;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Apply language filter
    if (selectedLanguage) {
      filtered = filtered.filter(tool => tool.language === selectedLanguage);
    }

    // Apply sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.stars - a.stars);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
    }

    return filtered;
  }, [allTools, searchQuery, selectedCategory, selectedLanguage, sortBy]);

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search MCP tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language} className="capitalize">
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort and Results Count */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Showing {filteredAndSortedTools.length} of {allTools.length} tools
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Updated</option>
                <option value="name">Name A-Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAndSortedTools.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tools found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or browse all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}