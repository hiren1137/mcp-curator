'use client';

// Client Components for MCP Tool Pages
export function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center space-x-3 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleCopy}
          className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}