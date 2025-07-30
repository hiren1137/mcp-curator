#!/usr/bin/env python3
import json
import requests
from bs4 import BeautifulSoup
import time
import random

def get_github_stars(url):
    """Get real-time stars from GitHub repository"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        # Add random delay to avoid being blocked
        time.sleep(random.uniform(1.0, 2.0))
        
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try multiple selectors for stars
        selectors = [
            '#repo-stars-counter-star',
            'a[href$="/stargazers"] .Counter',
            'a[href*="stargazers"] strong',
            '[data-testid="stargazers"] .Counter',
            'a[href*="stargazers"] span[title]'
        ]
        
        for selector in selectors:
            elem = soup.select_one(selector)
            if elem:
                text = elem.get_text(strip=True) or elem.get('title', '')
                if text:
                    # Parse number (handle k, m suffixes)
                    text = text.lower().replace(',', '')
                    if 'k' in text:
                        return int(float(text.replace('k', '')) * 1000)
                    elif 'm' in text:
                        return int(float(text.replace('m', '')) * 1000000)
                    elif text.isdigit():
                        return int(text)
        
        return None
        
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}")
        return None

def main():
    """Update GitHub stars in smaller batches"""
    with open('../data/mcp-data.json', 'r') as f:
        data = json.load(f)
    
    # Get all GitHub URLs with current stars
    github_repos = []
    for i, tool in enumerate(data):
        if tool.get('githubUrl'):
            github_repos.append((i, tool))
    
    print(f"🚀 Found {len(github_repos)} repositories to update")
    
    # Process only first 50 repos to avoid timeout
    batch_size = 5
    max_repos = 50
    updated_count = 0
    
    for i in range(0, min(len(github_repos), max_repos), batch_size):
        batch = github_repos[i:i+batch_size]
        
        print(f"\n📦 Processing batch {i//batch_size + 1} (repos {i+1}-{min(i+batch_size, max_repos)})")
        
        for idx, tool in batch:
            github_url = tool['githubUrl']
            print(f"  Fetching {tool['name'][:30]:30}...", end=" ")
            
            stars = get_github_stars(github_url)
            
            if stars is not None:
                old_stars = tool.get('stars', 0)
                data[idx]['stars'] = stars
                updated_count += 1
                
                if stars != old_stars:
                    print(f"{old_stars:6,} → {stars:6,} ⭐")
                else:
                    print(f"{stars:6,} ⭐ (no change)")
            else:
                print("❌ Failed")
        
        # Wait between batches
        if i + batch_size < min(len(github_repos), max_repos):
            print("⏳ Waiting 10 seconds...")
            time.sleep(10)
    
    # Sort by updated stars
    data.sort(key=lambda x: x.get('stars', 0), reverse=True)
    
    # Save updated data
    with open('../data/mcp-data.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n🎉 Successfully updated {updated_count} repositories!")
    print("\n🏆 Top 10 repositories by stars:")
    for i, tool in enumerate(data[:10], 1):
        print(f"  {i:2d}. {tool['name'][:40]:40} {tool.get('stars', 0):8,} ⭐")

if __name__ == "__main__":
    main()