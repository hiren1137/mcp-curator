import { Suspense } from 'react';
import Link from 'next/link';
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