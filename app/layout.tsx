import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MCP Curator - The Ultimate Model Context Protocol Directory",
    template: "%s | MCP Curator"
  },
  description: "Discover, explore, and integrate the best Model Context Protocol (MCP) tools and servers. Your comprehensive directory of 850+ curated MCP integrations for AI applications.",
  keywords: [
    "Model Context Protocol",
    "MCP",
    "AI tools",
    "AI integrations",
    "Claude",
    "Anthropic",
    "AI development",
    "MCP servers",
    "MCP tools",
    "AI applications",
    "machine learning",
    "artificial intelligence",
    "developer tools",
    "AI directory"
  ],
  authors: [{ name: "MCP Curator Team" }],
  creator: "MCP Curator",
  publisher: "MCP Curator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.mcpcurator.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mcpcurator.com",
    siteName: "MCP Curator",
    title: "MCP Curator - The Ultimate Model Context Protocol Directory",
    description: "Discover, explore, and integrate the best Model Context Protocol (MCP) tools and servers. Your comprehensive directory of 850+ curated MCP integrations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MCP Curator - Model Context Protocol Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thehirenthakkar",
    creator: "@thehirenthakkar",
    title: "MCP Curator - The Ultimate Model Context Protocol Directory",
    description: "Discover 850+ curated MCP tools and servers for AI applications. Build powerful AI integrations with our comprehensive directory.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ONJF4GQRG5KI-we2aj6TpGj4MondPqeJiStoj3CKaec",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "MCP Curator",
              "description": "The ultimate directory of Model Context Protocol tools and servers",
              "url": "https://www.mcpcurator.com",
              "sameAs": [
                "https://x.com/thehirenthakkar",
                "https://github.com/mcpcurator"
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.mcpcurator.com/directory?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}
        suppressHydrationWarning={true}
      >
        {children}
        
        {/* Analytics (Google Analytics 4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
