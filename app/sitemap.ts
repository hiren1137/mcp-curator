import { MetadataRoute } from 'next';
import { getAllTools, getCategories, generateSlug } from '@/lib/mcp-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.mcpcurator.com';
  const allTools = getAllTools();
  const categories = getCategories();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // MCP tool pages
  const toolPages = allTools.map((tool) => ({
    url: `${baseUrl}/mcp/${generateSlug(tool.name)}`,
    lastModified: new Date(tool.lastUpdated || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}