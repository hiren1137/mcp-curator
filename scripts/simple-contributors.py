#!/usr/bin/env python3
"""
Simple Contributors Script
Adds repository owner as primary contributor for MCP tools
"""

import json
import sys
import os
from urllib.parse import urlparse

def add_owner_as_contributor():
    """
    Add repository owner as primary contributor for all MCP tools
    """
    data_file = '../data/mcp-data.json'
    
    # Read current data
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    print(f"📊 Processing {len(data)} MCP tools...")
    
    updated_count = 0
    
    for i, tool in enumerate(data, 1):
        github_url = tool.get('githubUrl', '')
        
        if not github_url:
            continue
            
        try:
            # Extract owner from GitHub URL
            parsed = urlparse(github_url)
            path_parts = parsed.path.strip('/').split('/')
            
            if len(path_parts) >= 2:
                owner = path_parts[0]
                repo = path_parts[1]
                
                # Skip if contributors already exist
                if tool.get('contributors') and len(tool.get('contributors', [])) > 0:
                    print(f"[{i:3d}/{len(data)}] {tool['name'][:50]} - Already has contributors")
                    continue
                
                # Add owner as primary contributor
                contributors = [{
                    'login': owner,
                    'avatar_url': f"https://github.com/{owner}.png?size=60",
                    'html_url': f"https://github.com/{owner}",
                    'contributions': 1
                }]
                
                tool['contributors'] = contributors
                updated_count += 1
                
                print(f"[{i:3d}/{len(data)}] {tool['name'][:50]} - Added {owner} as contributor")
            else:
                print(f"[{i:3d}/{len(data)}] {tool['name'][:50]} - Invalid GitHub URL")
                
        except Exception as e:
            print(f"[{i:3d}/{len(data)}] {tool['name'][:50]} - Error: {e}")
    
    # Save the updated data
    with open(data_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✨ Contributors update complete!")
    print(f"  ✅ Successfully updated: {updated_count} tools")
    print(f"  📊 Total processed: {len(data)} tools")
    
    return updated_count

if __name__ == "__main__":
    try:
        print("🚀 Simple Contributors Script")
        print("=" * 50)
        
        final_count = add_owner_as_contributor()
        print(f"\n🎉 Update complete! Updated {final_count} tools with contributors")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)