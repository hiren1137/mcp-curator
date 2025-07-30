import { getAllTools, getCategoryInfo } from '@/lib/mcp-data';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP Categories - Browse Tools by Category',
  description: 'Browse Model Context Protocol tools and servers organized by categories. Find the perfect MCP integration for your specific use case.',
  alternates: {
    canonical: 'https://www.mcpcurator.com/categories',
  },
};

export default function CategoriesPage() {
  const allTools = getAllTools();
  const categories = getCategoryInfo().sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MCP Curator
                </h1>
                <p className="text-xs text-slate-500">Model Context Protocol Directory</p>
              </div>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/directory" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Directory
              </Link>
              <Link href="/categories" className="text-blue-600 font-medium">
                Categories
              </Link>
              <Link href="/submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
                Submit Tool
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors">
              🏠 Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">🏷️ Categories</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Browse by Category
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Discover MCP tools and servers organized by functionality and use case. 
            Find the perfect integration for your specific needs.
          </p>
          <div className="bg-blue-100/80 backdrop-blur-sm text-blue-800 text-sm font-semibold px-4 py-2 rounded-full inline-block">
            {categories.length} Categories • {allTools.length}+ Tools
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <h3 className="text-xl font-bold text-slate-900 capitalize group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <h4 className="text-xl font-bold">MCP Curator</h4>
              </div>
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