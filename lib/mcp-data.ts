import { MCPTool } from './types';
import mcpDataRaw from '../data/mcp-data.json';

export const mcpTools: MCPTool[] = mcpDataRaw as MCPTool[];

export function getAllTools(): MCPTool[] {
  return mcpTools;
}

export function getToolBySlug(slug: string): MCPTool | undefined {
  return mcpTools.find(tool => {
    const toolSlug = generateSlug(tool.name);
    return toolSlug === slug;
  });
}

export function getToolsByCategory(category: string): MCPTool[] {
  return mcpTools.filter(tool => tool.category === category);
}

export function getCategories(): string[] {
  return [...new Set(mcpTools.map(tool => tool.category))];
}

export function getCategoryInfo() {
  const categories = getCategories();
  return categories.map(category => {
    const tools = getToolsByCategory(category);
    return {
      name: category,
      count: tools.length,
      description: getCategoryDescription(category)
    };
  });
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    'database': 'MCP servers for database operations and data management',
    'automation': 'Browser automation and testing tools',
    'cloud': 'Cloud services and platform integrations',
    'development': 'Development tools and utilities',
    'communication': 'Messaging and communication platforms',
    'productivity': 'Productivity and workflow tools',
    'security': 'Security and authentication services',
    'utilities': 'General purpose utilities and tools',
    'api': 'API integrations and services',
    'filesystem': 'File system operations and management'
  };
  
  return descriptions[category] || `MCP servers for ${category}`;
}

export function searchTools(query: string): MCPTool[] {
  const lowercaseQuery = query.toLowerCase();
  return mcpTools.filter(tool =>
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}