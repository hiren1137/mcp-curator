#!/usr/bin/env python3
import json
import requests
from bs4 import BeautifulSoup
import re
import sys

def get_repo_stars(github_url):
    """Get real stars count from GitHub repository"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        response = requests.get(github_url, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try multiple selectors for stars
        star_selectors = [
            '#repo-stars-counter-star',
            'a[href$="/stargazers"] .Counter',
            'a[href*="stargazers"] strong',
            '[data-testid="stargazers"] .Counter'
        ]
        
        for selector in star_selectors:
            star_elem = soup.select_one(selector)
            if star_elem:
                text = star_elem.get_text(strip=True)
                # Parse number (handle k, m suffixes)
                if 'k' in text.lower():
                    return int(float(text.lower().replace('k', '')) * 1000)
                elif 'm' in text.lower():
                    return int(float(text.lower().replace('m', '')) * 1000000)
                else:
                    return int(text.replace(',', ''))
        
        return None
        
    except Exception as e:
        print(f"Error fetching {github_url}: {e}")
        return None

def update_key_repos():
    """Update star counts for key repositories"""
    # Load current data
    with open('../data/mcp-data.json', 'r') as f:
        data = json.load(f)
    
    # Key repositories to update
    key_repos = [
        'https://github.com/punkpeye/fastmcp',
        'https://github.com/modelcontextprotocol/servers',
        'https://github.com/microsoft/playwright-mcp',
        'https://github.com/awslabs/mcp',
        'https://github.com/cloudflare/mcp-server-cloudflare',
        'https://github.com/pulumi/mcp-server',
        'https://github.com/redis/mcp-redis-cloud'
    ]
    
    print("🚀 Updating key repositories...")
    updates = {}
    
    for repo_url in key_repos:
        print(f"Fetching {repo_url}...")
        stars = get_repo_stars(repo_url)
        if stars is not None:
            updates[repo_url] = stars
            print(f"  ✅ {stars:,} stars")
        else:
            print(f"  ❌ Failed to fetch")
    
    # Update the data
    updated_count = 0
    for tool in data:
        if tool.get('githubUrl') in updates:
            old_stars = tool.get('stars', 0)
            new_stars = updates[tool['githubUrl']]
            tool['stars'] = new_stars
            updated_count += 1
            print(f"Updated {tool['name']}: {old_stars} → {new_stars} stars")
    
    # Sort by stars
    data.sort(key=lambda x: x.get('stars', 0), reverse=True)
    
    # Save updated data
    with open('../data/mcp-data.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✅ Updated {updated_count} repositories")
    print("📊 Top 10 tools by stars:")
    for i, tool in enumerate(data[:10], 1):
        print(f"  {i:2d}. {tool['name']:30} {tool.get('stars', 0):6,} ⭐")

if __name__ == "__main__":
    update_key_repos()