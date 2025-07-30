import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Submit Your MCP Tool - MCP Curator',
  description: 'Submit your Model Context Protocol tool or server to be featured in our comprehensive directory. Help the MCP community discover new integrations.',
  keywords: [
    'submit MCP tool',
    'MCP server submission',
    'Model Context Protocol',
    'contribute to MCP',
    'add MCP tool',
    'MCP directory submission',
    'share MCP server'
  ],
  openGraph: {
    title: 'Submit Your MCP Tool - MCP Curator',
    description: 'Submit your Model Context Protocol tool or server to be featured in our comprehensive directory.',
    type: 'website',
    url: 'https://mcpcurator.com/submit',
    siteName: 'MCP Curator',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Your MCP Tool - MCP Curator',
    description: 'Submit your Model Context Protocol tool or server to be featured in our comprehensive directory.',
    site: '@thehirenthakkar',
  },
  alternates: {
    canonical: 'https://mcpcurator.com/submit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
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
              <Link href="/categories" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Categories
              </Link>
              <Link href="/submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
                Submit Tool
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors">🏠 Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">Submit Tool</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm text-blue-800 text-sm font-semibold px-4 py-2 rounded-full border border-blue-200/60">
              <span>✨</span>
              <span>Share Your Creation</span>
            </span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Submit Your
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MCP Tool
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Have you built an amazing Model Context Protocol tool or server? Share it with the community 
            and help thousands of developers discover your creation.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-semibold text-slate-900 mb-2">Get Discovered</h3>
              <p className="text-slate-600 text-sm">Reach thousands of developers actively looking for MCP integrations</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-slate-900 mb-2">Boost Adoption</h3>
              <p className="text-slate-600 text-sm">Increase usage and contributions to your MCP project</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-slate-900 mb-2">Join Community</h3>
              <p className="text-slate-600 text-sm">Connect with other MCP developers and contributors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  📝 Submission Form
                </h2>
                <p className="text-slate-600">
                  Fill out the form below to submit your MCP tool for review and inclusion in our directory.
                </p>
              </div>

              {/* Google Form Embed */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
                    <span>🔗</span>
                    <span>External Form</span>
                  </div>
                </div>
                
                <p className="text-slate-700 mb-6 text-center">
                  Please use our Google Form to submit your MCP tool. This helps us process submissions efficiently 
                  and ensures we collect all the necessary information.
                </p>

                <div className="text-center">
                  <a
                    href="https://forms.gle/A3VfiiMJAc8Anrwf7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span>📋</span>
                    <span>Open Submission Form</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-300">
                  <h4 className="font-semibold text-slate-900 mb-3">What we&apos;ll need:</h4>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Tool/Server name and description</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>GitHub repository URL</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Category and programming language</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Installation and usage instructions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>Your contact information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-200/60">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 Submission Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">✅ Requirements</h4>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Must be a genuine MCP server/tool</li>
                  <li>• Open source with public repository</li>
                  <li>• Clear documentation and README</li>
                  <li>• Working installation instructions</li>
                  <li>• Compatible with MCP specification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">⏱️ Review Process</h4>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li>• Initial review within 2-3 business days</li>
                  <li>• We test installation and basic functionality</li>
                  <li>• May request additional information</li>
                  <li>• Approved tools added within 1 week</li>
                  <li>• Updates via email notification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
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