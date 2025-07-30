export interface MCPTool {
  id: number;
  name: string;
  category: string;
  language: string;
  description: string;
  tags: string[];
  githubUrl: string;
  rating: string;
  stars: number;
  lastUpdated: string;
  contributors?: {
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }[];
}

export interface CategoryInfo {
  name: string;
  count: number;
  description: string;
}