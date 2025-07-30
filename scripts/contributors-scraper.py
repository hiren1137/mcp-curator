#!/usr/bin/env python3
"""
GitHub Contributors Scraper
Fetches contributors data from GitHub repository pages and updates the MCP data
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import sys
import os
from urllib.parse import urlparse
import re

def get_repo_contributors(github_url, max_contributors=5):
    """
    Scrape contributors from GitHub repository main page
    """
    try:
        # Clean the URL
        if github_url.endswith('/'):
            github_url = github_url[:-1]
        
        # Remove any query parameters or fragments
        parsed = urlparse(github_url)
        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
        }
        
        print(f"Fetching contributors from: {clean_url}")
        response = requests.get(clean_url, headers=headers, timeout=15)
        
        if response.status_code != 200:
            print(f"  ❌ Failed to fetch page (Status: {response.status_code})")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        contributors = []
        
        # Look for contributors in the sidebar or main content
        # Try to find the contributors section
        contributors_section = soup.find('a', href=re.compile(r'/graphs/contributors'))
        if contributors_section:
            parent = contributors_section.find_parent()
            if parent:
                # Look for user avatars near the contributors link
                avatar_imgs = parent.find_all('img', src=re.compile(r'avatars\.githubusercontent\.com'))
                
                seen_users = set()
                for img in avatar_imgs[:max_contributors]:
                    alt_text = img.get('alt', '')
                    src = img.get('src', '')
                    
                    # Extract username from avatar URL or alt text
                    username = None
                    if alt_text.startswith('@'):
                        username = alt_text[1:]
                    elif '/u/' in src:
                        # Extract from avatar URL like: https://avatars.githubusercontent.com/u/12345?s=20&v=4
                        # Look for username in nearby elements
                        link_parent = img.find_parent('a')
                        if link_parent and link_parent.get('href', '').startswith('/'):
                            username = link_parent.get('href').strip('/').split('/')[0]
                    
                    if username and username not in seen_users and username not in ['apps', 'github-actions', 'dependabot']:
                        seen_users.add(username)
                        contributors.append({
                            'login': username,
                            'avatar_url': src,
                            'html_url': f"https://github.com/{username}",
                            'contributions': 0
                        })
        
        # If no contributors found in sidebar, try to get from commit history or other sections
        if not contributors:
            # Look for any user profile links
            profile_links = soup.find_all('a', href=re.compile(r'^/[^/]+$'))
            seen_users = set()
            
            for link in profile_links[:max_contributors * 2]:  # Get more to filter
                href = link.get('href', '').strip('/')
                
                # Skip system accounts and common pages
                if href in ['features', 'enterprise', 'pricing', 'marketplace', 'explore', 'topics', 'collections', 'trending', 'events', 'github']:
                    continue
                    
                # Look for avatar images in the link
                img = link.find('img')
                if img and 'avatars.githubusercontent.com' in img.get('src', ''):
                    if href not in seen_users and len(contributors) < max_contributors:
                        seen_users.add(href)
                        contributors.append({
                            'login': href,
                            'avatar_url': img.get('src'),
                            'html_url': f"https://github.com/{href}",
                            'contributions': 0
                        })
        
        # If still no contributors, try a simpler approach - look for @username mentions
        if not contributors:
            # Extract owner from URL as primary contributor
            url_parts = clean_url.replace('https://github.com/', '').split('/')
            if len(url_parts) >= 1:
                owner = url_parts[0]
                contributors.append({
                    'login': owner,
                    'avatar_url': f"https://github.com/{owner}.png?size=60",
                    'html_url': f"https://github.com/{owner}",
                    'contributions': 0
                })
        
        if contributors:
            print(f"  ✅ Found {len(contributors)} contributors")
            for i, contrib in enumerate(contributors, 1):
                print(f"    {i}. {contrib['login']}")
        else:
            print(f"  ⚠️  No contributors found")
            
        return contributors
        
    except Exception as e:
        print(f"  ❌ Error fetching contributors: {e}")
        return []

def update_contributors_data():
    """
    Update the MCP data with contributors information
    """
    data_file = '../data/mcp-data.json'
    
    # Read current data
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    print(f"📊 Processing {len(data)} MCP tools for contributors data...")
    
    updated_count = 0
    failed_count = 0
    
    for i, tool in enumerate(data, 1):
        github_url = tool.get('githubUrl', '')
        
        if not github_url:
            continue
            
        print(f"\n[{i:3d}/{len(data)}] {tool['name'][:50]}")
        
        # Skip if contributors already exist and have data
        if tool.get('contributors') and len(tool.get('contributors', [])) > 0:
            print(f"  ⏭️  Already has {len(tool['contributors'])} contributors, skipping")
            continue
        
        contributors = get_repo_contributors(github_url, max_contributors=5)
        
        if contributors:
            tool['contributors'] = contributors
            updated_count += 1
            print(f"  ✅ Updated with {len(contributors)} contributors")
        else:
            tool['contributors'] = []
            failed_count += 1
            print(f"  ❌ No contributors found")
        
        # Add delay to be respectful
        time.sleep(1)
        
        # Save progress every 10 items
        if i % 10 == 0:
            with open(data_file, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"\n💾 Progress saved ({i}/{len(data)} processed)")
    
    # Final save
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✨ Contributors update complete!")
    print(f"  ✅ Successfully updated: {updated_count} tools")
    print(f"  ❌ Failed to get contributors: {failed_count} tools")
    print(f"  📊 Total processed: {len(data)} tools")
    
    return updated_count

def update_top_repositories_only():
    """
    Update only the top repositories that are likely to be viewed most
    """
    data_file = '../data/mcp-data.json'
    
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    # Sort by stars and take top 50
    top_tools = sorted(data, key=lambda x: x.get('stars', 0), reverse=True)[:50]
    
    print(f"🎯 Updating contributors for top {len(top_tools)} repositories...")
    
    updated_count = 0
    
    for i, tool in enumerate(top_tools, 1):
        github_url = tool.get('githubUrl', '')
        
        if not github_url:
            continue
            
        print(f"\n[{i:2d}/{len(top_tools)}] {tool['name'][:50]} ({tool.get('stars', 0)} ⭐)")
        
        # Skip if contributors already exist
        if tool.get('contributors') and len(tool.get('contributors', [])) > 0:
            print(f"  ⏭️  Already has {len(tool['contributors'])} contributors")
            continue
        
        contributors = get_repo_contributors(github_url, max_contributors=5)
        
        if contributors:
            # Find the tool in the main data and update it
            for main_tool in data:
                if main_tool['id'] == tool['id']:
                    main_tool['contributors'] = contributors
                    break
            updated_count += 1
            print(f"  ✅ Updated with {len(contributors)} contributors")
        else:
            print(f"  ❌ No contributors found")
        
        # Add delay
        time.sleep(2)
    
    # Save the updated data
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✨ Top repositories contributors update complete!")
    print(f"  ✅ Successfully updated: {updated_count} tools")
    
    return updated_count

if __name__ == "__main__":
    try:
        print("🚀 GitHub Contributors Scraper")
        print("=" * 50)
        
        # Ask user which approach to use
        if len(sys.argv) > 1 and sys.argv[1] == '--top-only':
            update_top_repositories_only()
        else:
            print("Choose update mode:")
            print("1. Update top 50 repositories only (recommended)")
            print("2. Update all repositories")
            
            choice = input("\nEnter choice (1 or 2): ").strip()
            
            if choice == '1':
                update_top_repositories_only()
            else:
                update_contributors_data()
                
    except KeyboardInterrupt:
        print("\n\n⏹️  Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)