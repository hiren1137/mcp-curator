import Link from 'next/link';

interface LogoProps {
  variant?: 'header' | 'footer' | 'full';
  className?: string;
}

export default function Logo({ variant = 'header', className = '' }: LogoProps) {
  const logoContent = () => {
    switch (variant) {
      case 'header':
        return (
          <div className={`flex items-center space-x-3 ${className}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MCP Curator
              </h1>
              <p className="text-xs text-slate-500">Model Context Protocol Directory</p>
            </div>
          </div>
        );
      
      case 'footer':
        return (
          <div className={`flex items-center space-x-3 ${className}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <h4 className="text-xl font-bold">MCP Curator</h4>
          </div>
        );
      
      case 'full':
        return (
          <div className={`text-center ${className}`}>
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MCP Curator
            </h1>
            <p className="text-lg text-slate-600 mt-2">Model Context Protocol Directory</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (variant === 'full') {
    return logoContent();
  }

  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      {logoContent()}
    </Link>
  );
}