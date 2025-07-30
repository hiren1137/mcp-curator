#!/usr/bin/env python3
import json
import sys
import os

def remove_duplicates():
    """Remove duplicate entries from MCP data based on analysis"""
    
    # Read the current data
    data_file = '../data/mcp-data.json'
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    print(f"📊 Original dataset: {len(data)} entries")
    
    # IDs to remove based on analysis
    ids_to_remove = [416, 701, 56, 89, 33]
    
    print(f"🗑️  Removing {len(ids_to_remove)} duplicate entries...")
    
    # Track removed entries for verification
    removed_entries = []
    
    # Filter out the duplicate entries
    filtered_data = []
    for entry in data:
        if entry['id'] in ids_to_remove:
            removed_entries.append({
                'id': entry['id'],
                'name': entry['name'],
                'githubUrl': entry['githubUrl']
            })
            print(f"  ❌ Removed ID {entry['id']}: {entry['name']}")
        else:
            filtered_data.append(entry)
    
    print(f"\n✅ Successfully removed {len(removed_entries)} duplicate entries")
    print(f"📊 New dataset: {len(filtered_data)} entries")
    print(f"📉 Reduction: {len(data) - len(filtered_data)} entries")
    
    # Verify the removed entries
    print(f"\n🔍 Verification - Removed entries:")
    for entry in removed_entries:
        print(f"  • ID {entry['id']}: {entry['name']} ({entry['githubUrl']})")
    
    # Sort by stars (descending) to maintain consistency
    filtered_data.sort(key=lambda x: x.get('stars', 0), reverse=True)
    
    # Create backup of original data
    backup_file = f'{data_file}.backup'
    with open(backup_file, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"\n💾 Created backup: {backup_file}")
    
    # Save the cleaned data
    with open(data_file, 'w') as f:
        json.dump(filtered_data, f, indent=2)
    
    print(f"✨ Cleaned data saved to: {data_file}")
    
    # Show top 10 entries after cleanup
    print(f"\n🏆 Top 10 entries after cleanup:")
    for i, tool in enumerate(filtered_data[:10], 1):
        print(f"  {i:2d}. {tool['name'][:40]:40} {tool.get('stars', 0):6,} ⭐")
    
    return len(filtered_data)

if __name__ == "__main__":
    try:
        final_count = remove_duplicates()
        print(f"\n🎉 Deduplication complete! Final count: {final_count} unique MCP tools")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)