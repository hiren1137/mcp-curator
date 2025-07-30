// GitHub API integration for real-time data fetching
export interface GitHubRepoData {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  license: {
    key: string;
    name: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
    type: string;
  };
}

export interface GitHubContributorData {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GitHubReleaseData {
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  html_url: string;
}

export interface EnhancedGitHubData extends GitHubRepoData {
  contributors: GitHubContributorData[];
  latest_release: GitHubReleaseData | null;
  readme_content: string | null;
}

class GitHubAPI {
  private baseUrl = 'https://api.github.com';
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async makeRequest<T>(url: string): Promise<T> {
    // Check cache first
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MCP-Curator/1.0',
    };

    // Add GitHub token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found');
      } else if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      } else {
        throw new Error(`GitHub API error: ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Cache the result
    this.cache.set(url, { data, timestamp: Date.now() });
    
    return data;
  }

  async getRepositoryData(owner: string, repo: string): Promise<GitHubRepoData> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}`;
    return await this.makeRequest<GitHubRepoData>(url);
  }

  async getContributors(owner: string, repo: string, limit: number = 5): Promise<GitHubContributorData[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contributors?per_page=${limit}`;
    return await this.makeRequest<GitHubContributorData[]>(url);
  }

  async getLatestRelease(owner: string, repo: string): Promise<GitHubReleaseData | null> {
    try {
      const url = `${this.baseUrl}/repos/${owner}/${repo}/releases/latest`;
      return await this.makeRequest<GitHubReleaseData>(url);
    } catch {
      // No releases found
      return null;
    }
  }

  async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/repos/${owner}/${repo}/readme`;
      const response = await this.makeRequest<{ content: string; encoding: string }>(url);
      
      if (response.encoding === 'base64') {
        return Buffer.from(response.content, 'base64').toString('utf-8');
      }
      return response.content;
    } catch {
      return null;
    }
  }

  async getEnhancedRepositoryData(githubUrl: string): Promise<EnhancedGitHubData | null> {
    try {
      // Extract owner and repo from GitHub URL
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }

      const [, owner, repo] = match;
      
      // Fetch all data in parallel
      const [repoData, contributors, latestRelease, readmeContent] = await Promise.allSettled([
        this.getRepositoryData(owner, repo),
        this.getContributors(owner, repo, 5),
        this.getLatestRelease(owner, repo),
        this.getReadme(owner, repo)
      ]);

      if (repoData.status === 'rejected') {
        throw repoData.reason;
      }

      return {
        ...repoData.value,
        contributors: contributors.status === 'fulfilled' ? contributors.value : [],
        latest_release: latestRelease.status === 'fulfilled' ? latestRelease.value : null,
        readme_content: readmeContent.status === 'fulfilled' ? readmeContent.value : null
      };

    } catch (error) {
      console.error(`Error fetching GitHub data for ${githubUrl}:`, error);
      return null;
    }
  }

  // Method to get repository data from URL with fallback
  async getRepoDataFromUrl(githubUrl: string): Promise<GitHubRepoData | null> {
    try {
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (!match) return null;

      const [, owner, repo] = match;
      return await this.getRepositoryData(owner, repo);
    } catch (error) {
      console.error(`Error fetching repo data for ${githubUrl}:`, error);
      return null;
    }
  }
}

export const githubAPI = new GitHubAPI();

// Helper function to extract owner/repo from GitHub URL
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

// Helper function to format numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Helper function to calculate time ago
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
}