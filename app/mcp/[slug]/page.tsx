import { getAllTools, getToolBySlug, generateSlug, getToolsByCategory } from '@/lib/mcp-data';
import { MCPTool } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CopyButton, CodeBlock } from './components';
import { githubAPI, formatNumber, timeAgo, EnhancedGitHubData } from '@/lib/github-api';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: generateSlug(tool.name),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  
  if (!tool) {
    return {
      title: 'MCP Tool Not Found - MCP Curator',
      description: 'The MCP tool you are looking for could not be found in our directory.',
    };
  }

  const title = `${tool.name} - ${tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} MCP Server`;
  const description = `${tool.description} Learn how to install, configure and use ${tool.name} MCP server. Includes setup instructions, configuration examples, and usage documentation.`;

  return {
    title,
    description,
    keywords: [
      tool.name,
      tool.category,
      ...tool.tags,
      'MCP server',
      'Model Context Protocol',
      'AI integration',
      'installation guide',
      'configuration',
      tool.language,
      'GitHub'
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://www.mcpcurator.com/mcp/${slug}`,
      siteName: 'MCP Curator',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@thehirenthakkar',
    },
    alternates: {
      canonical: `https://www.mcpcurator.com/mcp/${slug}`,
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
}

export default async function MCPToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Fetch real-time GitHub data
  let githubData: EnhancedGitHubData | null = null;
  try {
    githubData = await githubAPI.getEnhancedRepositoryData(tool.githubUrl);
  } catch (error) {
    console.error('Failed to fetch GitHub data:', error);
  }

  // Use GitHub data if available, otherwise fall back to cached data
  const displayStars = githubData?.stargazers_count ?? tool.stars;
  const displayDescription = githubData?.description ?? tool.description;
  const displayLanguage = githubData?.language?.toLowerCase() ?? tool.language;
  const displayLastUpdated = githubData?.pushed_at ?? tool.lastUpdated;
  const displayContributors = githubData?.contributors ?? tool.contributors ?? [];

  const installCommand = generateInstallCommand(tool);
  const configExample = generateConfigExample(tool);
  const usageExample = generateUsageExample(tool);
  const relatedTools = getToolsByCategory(tool.category).filter(t => t.id !== tool.id).slice(0, 6);

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

      {/* Enhanced Breadcrumbs */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors">🏠 Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/directory" className="text-slate-500 hover:text-blue-600 transition-colors">📁 Directory</Link>
            <span className="text-slate-300">/</span>
            <Link href={`/category/${tool.category}`} className="text-slate-500 hover:text-blue-600 transition-colors capitalize">
              🏷️ {tool.category}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
              <div className="relative p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full capitalize">
                        {tool.category}
                      </span>
                      <span className="bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-full capitalize">
                        {tool.language}
                      </span>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                      {tool.name}
                    </h1>
                    
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                      {displayDescription}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={tool.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>View on GitHub</span>
                      </a>
                      <CopyButton text={installCommand} label="Copy Install Command" />
                    </div>
                  </div>
                  
                  <div className="lg:w-80">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-yellow-500 text-2xl">⭐</span>
                          <span className="text-3xl font-bold text-slate-900">{formatNumber(displayStars)}</span>
                        </div>
                        <p className="text-slate-600">GitHub Stars</p>
                      </div>
                      
                      <div className="space-y-4">
                        {githubData && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Forks</span>
                              <span className="font-semibold text-slate-900">{formatNumber(githubData.forks_count)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">Issues</span>
                              <span className="font-semibold text-slate-900">{githubData.open_issues_count}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Last Updated</span>
                          <span className="font-medium text-slate-900">{timeAgo(displayLastUpdated)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Language</span>
                          <span className="font-medium text-slate-900 capitalize">{displayLanguage}</span>
                        </div>
                        {githubData?.license && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">License</span>
                            <span className="font-medium text-slate-900">{githubData.license.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Installation Guide */}
            <ContentSection 
              title="🚀 Installation & Setup"
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Quick Install</h4>
                    <CodeBlock code={installCommand} language="bash" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Prerequisites</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Node.js 18+ or Python 3.8+ (depending on implementation)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>MCP-compatible client (Claude Desktop, Continue, etc.)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Basic understanding of Model Context Protocol</span>
                      </li>
                    </ul>
                  </div>
                </div>
              }
            />

            {/* Configuration */}
            <ContentSection 
              title="⚙️ Configuration"
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">MCP Settings Configuration</h4>
                    <CodeBlock code={configExample} language="json" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Environment Variables</h4>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-slate-700 mb-3">Set these environment variables based on your needs:</p>
                      <ul className="space-y-1 text-sm font-mono text-slate-600">
                        <li>• API_KEY - Your API key (if required)</li>
                        <li>• DEBUG_MODE - Enable debug logging</li>
                        <li>• TIMEOUT - Request timeout in seconds</li>
                      </ul>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Usage Examples */}
            <ContentSection 
              title="💡 Usage Examples"
              content={
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Basic Usage</h4>
                    <CodeBlock code={usageExample} language="javascript" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Integration Guide</h4>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <p className="text-slate-700 mb-4">
                        This MCP server can be integrated into various AI applications and workflows. 
                        Check the GitHub repository for detailed integration examples and API documentation.
                      </p>
                      <a 
                        href={tool.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <span>View Documentation</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              }
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">📊 Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Category</span>
                  <Link href={`/category/${tool.category}`} className="text-blue-600 hover:text-blue-700 font-medium capitalize">
                    {tool.category}
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Language</span>
                  <span className="font-medium text-slate-900 capitalize">{displayLanguage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Repository</span>
                  <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">
                    GitHub →
                  </a>
                </div>
                {githubData?.size && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Size</span>
                    <span className="font-medium text-slate-900">{formatNumber(githubData.size)} KB</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contributors */}
            {displayContributors && displayContributors.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">👥 Contributors</h3>
                <div className="space-y-3">
                  {displayContributors.slice(0, 5).map((contributor) => (
                    <div key={contributor.login} className="flex items-center space-x-3">
                      <img 
                        src={contributor.avatar_url} 
                        alt={contributor.login}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <a 
                          href={contributor.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {contributor.login}
                        </a>
                        <p className="text-xs text-slate-500">{contributor.contributions} contributions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Release */}
            {githubData?.latest_release && (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/60">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">🚀 Latest Release</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {githubData.latest_release.tag_name}
                    </span>
                    <span className="text-sm text-slate-500">
                      {timeAgo(githubData.latest_release.published_at)}
                    </span>
                  </div>
                  <h4 className="font-medium text-slate-900">{githubData.latest_release.name}</h4>
                  <a 
                    href={githubData.latest_release.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Release →
                  </a>
                </div>
              </div>
            )}

            {/* FAQ */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/60">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">❓ FAQ</h3>
              <div className="space-y-4">
                {getFAQ(tool.category).map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-slate-700 hover:text-slate-900 font-medium">
                      {faq.question}
                      <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-2 text-slate-600 text-sm">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              More {tool.category} MCP Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => (
                <Link key={relatedTool.id} href={`/mcp/${generateSlug(relatedTool.name)}`} className="block group">
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedTool.name}
                    </h4>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{relatedTool.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-500 text-sm">⭐ {relatedTool.rating}</span>
                      <span className="text-slate-500 text-sm">{relatedTool.stars} stars</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Helper Functions
function generateInstallCommand(tool: MCPTool): string {
  const repoName = tool.githubUrl.split('/').pop() || tool.name;
  
  if (tool.language === 'python') {
    return `# Clone the repository
git clone ${tool.githubUrl}
cd ${repoName}

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py`;
  } else if (tool.language === 'typescript' || tool.language === 'javascript') {
    return `# Clone the repository
git clone ${tool.githubUrl}
cd ${repoName}

# Install dependencies
npm install

# Build and run
npm run build
npm start`;
  } else {
    return `# Clone the repository
git clone ${tool.githubUrl}
cd ${repoName}

# Follow the installation instructions in README.md`;
  }
}

function generateConfigExample(tool: MCPTool): string {
  const serverName = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `{
  "mcpServers": {
    "${serverName}": {
      "command": "node",
      "args": ["path/to/${serverName}/dist/index.js"],
      "env": {
        "API_KEY": "your-api-key-here",
        "DEBUG": "false"
      }
    }
  }
}`;
}

function generateUsageExample(tool: MCPTool): string {
  const category = tool.category;
  
  if (category === 'database') {
    return `// Example: Query data using the MCP server
const result = await mcpClient.callTool('query', {
  query: 'SELECT * FROM users WHERE active = true',
  database: 'production'
});

console.log('Query results:', result.data);`;
  } else if (category === 'automation') {
    return `// Example: Automate browser actions
const page = await mcpClient.callTool('navigate', {
  url: 'https://example.com',
  waitFor: 'networkidle'
});

const data = await mcpClient.callTool('extract', {
  selector: '.product-info',
  attributes: ['title', 'price']
});`;
  } else if (category === 'cloud') {
    return `// Example: Upload file to cloud storage
const uploadResult = await mcpClient.callTool('upload', {
  file: 'local-file.pdf',
  bucket: 'my-bucket',
  key: 'documents/file.pdf'
});

console.log('File uploaded:', uploadResult.url);`;
  } else {
    return `// Example: Basic usage of ${tool.name}
const result = await mcpClient.callTool('execute', {
  input: 'your-input-here',
  options: {
    format: 'json',
    timeout: 30000
  }
});

console.log('Result:', result);`;
  }
}


function getFAQ(category: string) {
  const faqs: Record<string, Array<{question: string, answer: string}>> = {
    database: [
      { 
        question: 'How do I connect to my database?', 
        answer: 'Configure your database connection string in the MCP server settings. Make sure your database is accessible and credentials are correct.' 
      },
      { 
        question: 'Is my data secure?', 
        answer: 'Yes, all connections use encryption and the server follows security best practices. Never commit credentials to version control.' 
      },
      { 
        question: 'Can I use multiple databases?', 
        answer: 'Most MCP database servers support multiple database connections. Check the specific server documentation for configuration details.' 
      }
    ],
    automation: [
      { 
        question: 'Which browsers are supported?', 
        answer: 'Most automation servers support Chrome, Firefox, Safari, and Edge. Headless modes are available for better performance.' 
      },
      { 
        question: 'How do I handle dynamic content?', 
        answer: 'Use wait conditions and element selectors to handle dynamically loaded content. Most servers provide smart waiting mechanisms.' 
      },
      { 
        question: 'Can I run tests in parallel?', 
        answer: 'Yes, many automation servers support parallel execution to speed up test runs and improve efficiency.' 
      }
    ],
    cloud: [
      { 
        question: 'Which cloud providers are supported?', 
        answer: 'Support varies by server, but most work with major providers like AWS, Google Cloud, and Microsoft Azure.' 
      },
      { 
        question: 'How is billing handled?', 
        answer: 'The MCP server itself is free, but you pay for cloud resources used. Monitor usage to control costs.' 
      },
      { 
        question: 'Is auto-scaling available?', 
        answer: 'Many cloud MCP servers support auto-scaling features to automatically adjust resources based on demand.' 
      }
    ]
  };
  
  return faqs[category] || [
    { question: 'How do I install this tool?', answer: 'Follow the installation instructions above. Make sure you have the required dependencies installed.' },
    { question: 'Is this tool free to use?', answer: 'Yes, this is an open-source MCP server available under its repository license.' },
    { question: 'How do I get support?', answer: 'Check the GitHub repository for issues, documentation, and community support.' }
  ];
}

// Components
function ContentSection({ title, content }: { title: string; content: React.ReactNode }) {
  return (
    <section className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-slate-200/60">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">{title}</h3>
      {content}
    </section>
  );
}

