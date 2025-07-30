import { getAllTools, getCategoryInfo } from '@/lib/mcp-data';
import Link from 'next/link';
import { githubAPI } from '@/lib/github-api';
import { SearchAndStats, FeaturedToolsSection } from './components/client-components';
import Logo from '@/components/Logo';

export default async function HomePage() {
  const allTools = getAllTools();
  const categories = getCategoryInfo().sort((a, b) => a.name.localeCompare(b.name));
  
  // Get featured tools and fetch real-time data for top ones
  const featuredTools = allTools
    .sort((a, b) => b.stars - a.stars) // Sort by stars
    .slice(0, 9);

  // Fetch real-time data for the top 3 featured tools
  for (let i = 0; i < Math.min(3, featuredTools.length); i++) {
    try {
      const githubData = await githubAPI.getRepoDataFromUrl(featuredTools[i].githubUrl);
      if (githubData) {
        featuredTools[i] = {
          ...featuredTools[i],
          stars: githubData.stargazers_count,
          description: githubData.description || featuredTools[i].description,
          language: githubData.language?.toLowerCase() || featuredTools[i].language
        };
      }
    } catch (error) {
      console.error(`Failed to fetch GitHub data for ${featuredTools[i].name}:`, error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo variant="header" />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/directory" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                📁 Directory
              </Link>
              <Link href="/categories" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                🏷️ Categories
              </Link>
              <Link href="/submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                ✨ Submit Tool
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm text-blue-800 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200/60">
              <span>🚀</span>
              <span>Discover {allTools.length}+ MCP Tools</span>
            </span>
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
            The Ultimate
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MCP Directory
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Find, explore, and integrate the best Model Context Protocol tools and servers. 
            Build powerful AI applications with our curated collection of MCP integrations.
          </p>

          <SearchAndStats allTools={allTools} categories={categories} />

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/directory"
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>🔍</span>
              <span>Explore Directory</span>
            </Link>
            <Link 
              href="/categories"
              className="inline-flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-xl text-slate-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-slate-900 transition-all border border-slate-200/60 shadow-lg hover:shadow-xl"
            >
              <span>📚</span>
              <span>Browse Categories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Browse by Category
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover MCP tools organized by functionality and use case
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 capitalize group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h4>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                      {category.count} tools
                    </span>
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              ⭐ Top Rated Tools
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore the highest-rated MCP tools trusted by thousands of developers
            </p>
          </div>
          
          <FeaturedToolsSection featuredTools={featuredTools} />
          
          <div className="text-center mt-12">
            <Link 
              href="/directory"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold text-lg group"
            >
              <span>View All {allTools.length}+ Tools</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Build with MCP?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of developers using Model Context Protocol to build the next generation of AI applications
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/directory"
              className="inline-flex items-center justify-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >
              <span>🚀</span>
              <span>Start Building</span>
            </Link>
            <Link 
              href="/submit"
              className="inline-flex items-center justify-center space-x-3 border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              <span>➕</span>
              <span>Submit Your Tool</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo variant="footer" className="mb-4" />
              <p className="text-slate-400 leading-relaxed">
                Your trusted directory for Model Context Protocol tools and integrations. 
                Discover, explore, and build with the MCP ecosystem.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-slate-200">Quick Links</h5>
              <ul className="space-y-3 text-slate-400">
                <li><Link href="/directory" className="hover:text-white transition-colors">📁 Directory</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">🏷️ Categories</Link></li>
                <li><Link href="/submit" className="hover:text-white transition-colors">✨ Submit Tool</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-slate-200">Resources</h5>
              <ul className="space-y-3 text-slate-400">
                <li><a href="https://modelcontextprotocol.io" target="_blank" className="hover:text-white transition-colors">📖 MCP Specification</a></li>
                <li><a href="https://github.com/modelcontextprotocol" target="_blank" className="hover:text-white transition-colors">🐙 Official GitHub</a></li>
                <li><a href="https://docs.anthropic.com/en/docs/build-with-claude/tool-use" target="_blank" className="hover:text-white transition-colors">📚 Documentation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-slate-200">Connect</h5>
              <div className="flex space-x-4">
                <a href="https://x.com/thehirenthakkar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <span>🐦</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">
              &copy; 2025 MCP Curator. Made with ❤️ for the MCP community. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'database': '🗄️',
    'automation': '🤖',
    'cloud': '☁️',
    'development': '💻',
    'communication': '💬',
    'productivity': '⚡',
    'security': '🔒',
    'utilities': '🛠️',
    'api': '🔌',
    'filesystem': '📁',
    'testing': '🧪',
    'analytics': '📊',
  };
  
  return icons[category] || '🔧';
}
