#!/usr/bin/env python3
# pip install aiohttp bs4 tqdm pandas
import re, json, asyncio, aiohttp, pathlib, time, sys
from bs4 import BeautifulSoup
from tqdm.asyncio import tqdm
import pandas as pd

HEADERS = {
    "User-Agent": "mcp-curator-scraper/1.0 (contact: admin@mcpcurator.com)",
    "Accept-Language": "en",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

# -------- Helper functions -----------------------------------------------------
def repo_slug(url: str) -> str:
    """Extract owner/repo from GitHub URL"""
    m = re.search(r"github\.com[:/](.+?)/(.+?)(?:\.git|/|$)", url)
    if not m:
        raise ValueError(f"Bad GitHub URL: {url}")
    return f"{m.group(1)}/{m.group(2)}"

def parse_number(text: str) -> int:
    """Parse GitHub counter numbers (handles k, m suffixes)"""
    if not text:
        return 0
    text = text.strip().lower()
    if 'k' in text:
        return int(float(text.replace('k', '')) * 1000)
    elif 'm' in text:
        return int(float(text.replace('m', '')) * 1000000)
    else:
        return int(text.replace(',', ''))

def get_counter(soup, selector):
    """Extract counter from GitHub page"""
    elements = soup.select(selector)
    for elem in elements:
        text = elem.get_text(strip=True)
        if text and text.replace(',', '').replace('k', '').replace('m', '').replace('.', '').isdigit():
            return parse_number(text)
    return 0

def extract_language(soup):
    """Extract primary language from GitHub page"""
    # Try multiple selectors for language
    selectors = [
        '[data-ga-click*="language"]',
        '.BorderGrid-cell .mt-2 span[class*="color-fg-"]',
        '.Layout-sidebar .BorderGrid-cell span[class*="color-fg-"]'
    ]
    
    for selector in selectors:
        lang_elem = soup.select_one(selector)
        if lang_elem:
            lang = lang_elem.get_text(strip=True)
            if lang and lang not in ['repository', 'code', 'issues', 'pull', 'requests']:
                return lang.lower()
    
    return 'unknown'

def extract_topics(soup):
    """Extract topics/tags from GitHub page"""
    topics = []
    topic_elements = soup.select('[data-ga-click*="topic"] .topic-tag')
    for elem in topic_elements:
        topic = elem.get_text(strip=True)
        if topic:
            topics.append(topic.lower())
    return topics[:6]  # Limit to 6 topics

def extract_license(soup):
    """Extract license information"""
    license_selectors = [
        'a[href*="/blob/"][href*="LICENSE"]',
        'a[href*="/blob/"][href*="COPYING"]',
        '.BorderGrid-cell a[title*="license"]'
    ]
    
    for selector in license_selectors:
        license_elem = soup.select_one(selector)
        if license_elem:
            return license_elem.get_text(strip=True)
    
    return None

def extract_last_commit(soup):
    """Extract last commit date"""
    commit_selectors = [
        'relative-time[datetime]',
        '[data-testid="latest-commit-details"] relative-time'
    ]
    
    for selector in commit_selectors:
        commit_elem = soup.select_one(selector)
        if commit_elem and commit_elem.get('datetime'):
            return commit_elem['datetime']
    
    return None

# -------- Main scraping function ----------------------------------------------
async def fetch_repo_data(session, url, cache_dir):
    """Fetch and parse GitHub repository data"""
    try:
        slug = repo_slug(url)
        html_path = cache_dir / f"{slug.replace('/', '__')}.html"
        
        # Check cache first (with 1 hour expiry)
        if html_path.exists() and (time.time() - html_path.stat().st_mtime) < 3600:
            html = html_path.read_text(encoding="utf-8")
        else:
            # Add random delay to avoid being blocked
            await asyncio.sleep(0.5 + (hash(url) % 10) * 0.1)
            
            async with session.get(url, headers=HEADERS, timeout=30) as resp:
                if resp.status != 200:
                    print(f"❌ Failed to fetch {url}: HTTP {resp.status}")
                    return None
                
                html = await resp.text()
                html_path.write_text(html, encoding="utf-8")
        
        soup = BeautifulSoup(html, "html.parser")
        
        # Extract all the data we need
        stars = get_counter(soup, [
            '#repo-stars-counter-star',
            'a[href$="/stargazers"] .Counter',
            '[data-testid="stargazers"] .Counter',
            'a[href*="stargazers"] strong'
        ])
        
        forks = get_counter(soup, [
            '#repo-network-counter',
            'a[href$="/forks"] .Counter',
            'a[href*="network/members"] .Counter',
            '[data-testid="forks"] .Counter'
        ])
        
        watchers = get_counter(soup, [
            'a[href$="/watchers"] .Counter',
            'a[href*="watchers"] .Counter'
        ])
        
        # Extract description
        description = ""
        desc_elem = soup.select_one('[data-pjax="#repo-content-pjax-container"] p')
        if desc_elem:
            description = desc_elem.get_text(strip=True)
        else:
            # Fallback to meta description
            meta_desc = soup.select_one('meta[name="description"]')
            if meta_desc:
                description = meta_desc.get('content', '')
        
        # Extract language
        language = extract_language(soup)
        
        # Extract topics
        topics = extract_topics(soup)
        
        # Extract license
        license_info = extract_license(soup)
        
        # Extract last commit
        last_commit = extract_last_commit(soup)
        
        data = {
            "slug": slug,
            "url": url,
            "stars": stars,
            "forks": forks,
            "watchers": watchers,
            "description": description,
            "language": language,
            "topics": topics,
            "license": license_info,
            "last_commit": last_commit,
            "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        print(f"✅ {slug}: {stars} stars, {forks} forks, {language}")
        return data
        
    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
        return None

# -------- Main orchestrator ---------------------------------------------------
async def scrape_github_repos(input_file="mcp-data.json", output_file="github-data.json", max_concurrent=3):
    """Main function to scrape all GitHub repositories"""
    
    # Create cache directory
    cache_dir = pathlib.Path("data/github_cache")
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    # Load existing MCP data
    with open(input_file, 'r') as f:
        mcp_data = json.load(f)
    
    # Extract GitHub URLs
    github_urls = []
    for tool in mcp_data:
        if 'githubUrl' in tool and tool['githubUrl']:
            github_urls.append(tool['githubUrl'])
    
    print(f"🚀 Starting to scrape {len(github_urls)} GitHub repositories...")
    print(f"📊 Using {max_concurrent} concurrent connections")
    
    # Create semaphore for rate limiting
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async with aiohttp.ClientSession(
        connector=aiohttp.TCPConnector(limit=max_concurrent),
        timeout=aiohttp.ClientTimeout(total=30)
    ) as session:
        
        async def bounded_fetch(url):
            async with semaphore:
                return await fetch_repo_data(session, url, cache_dir)
        
        # Execute all scraping tasks
        results = []
        tasks = [bounded_fetch(url) for url in github_urls]
        
        for coro in tqdm.as_completed(tasks, total=len(tasks), desc="Scraping repos"):
            try:
                result = await coro
                if result:
                    results.append(result)
            except Exception as e:
                print(f"⚠️ Task failed: {e}", file=sys.stderr)
    
    print(f"✅ Successfully scraped {len(results)} repositories")
    
    # Create a lookup dictionary
    github_data_lookup = {}
    for item in results:
        github_data_lookup[item['url']] = item
    
    # Update the original MCP data with scraped information
    updated_mcp_data = []
    for tool in mcp_data:
        github_url = tool.get('githubUrl', '')
        if github_url in github_data_lookup:
            github_info = github_data_lookup[github_url]
            
            # Update the tool with real GitHub data
            tool.update({
                'stars': github_info['stars'],
                'forks': github_info.get('forks', 0),
                'watchers': github_info.get('watchers', 0),
                'description': github_info['description'] or tool.get('description', ''),
                'language': github_info['language'] if github_info['language'] != 'unknown' else tool.get('language', 'typescript'),
                'topics': github_info.get('topics', []),
                'license': github_info.get('license'),
                'lastUpdated': github_info.get('last_commit', tool.get('lastUpdated', '')),
                'scraped_at': github_info['scraped_at']
            })
            
            # Update tags with topics
            if github_info.get('topics'):
                existing_tags = set(tool.get('tags', []))
                new_tags = list(existing_tags.union(set(github_info['topics'])))[:6]
                tool['tags'] = new_tags
        
        updated_mcp_data.append(tool)
    
    # Sort by stars (descending)
    updated_mcp_data.sort(key=lambda x: x.get('stars', 0), reverse=True)
    
    # Save updated data
    with open(input_file, 'w') as f:
        json.dump(updated_mcp_data, f, indent=2)
    
    # Save raw GitHub data as well
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Print statistics
    total_stars = sum(item['stars'] for item in results)
    avg_stars = total_stars / len(results) if results else 0
    top_repos = sorted(results, key=lambda x: x['stars'], reverse=True)[:10]
    
    print(f"\n📈 SCRAPING STATISTICS:")
    print(f"   • Total repositories: {len(results)}")
    print(f"   • Total stars: {total_stars:,}")
    print(f"   • Average stars: {avg_stars:.1f}")
    print(f"\n🏆 TOP 10 REPOSITORIES:")
    for i, repo in enumerate(top_repos, 1):
        print(f"   {i:2d}. {repo['slug']:30} {repo['stars']:6,} ⭐")
    
    print(f"\n💾 Data saved to:")
    print(f"   • Updated MCP data: {input_file}")
    print(f"   • Raw GitHub data: {output_file}")
    print(f"   • Cache directory: {cache_dir}")

if __name__ == "__main__":
    # Get input file path
    script_dir = pathlib.Path(__file__).parent
    mcp_data_path = script_dir.parent / "data" / "mcp-data.json"
    
    if not mcp_data_path.exists():
        print(f"❌ MCP data file not found: {mcp_data_path}")
        sys.exit(1)
    
    # Run the scraper
    asyncio.run(scrape_github_repos(
        input_file=str(mcp_data_path),
        output_file="github-scraped-data.json",
        max_concurrent=3  # Conservative to avoid being blocked
    ))