
<?php
// ============================================================
// OPEN SOURCE NEWS AGGREGATOR - RSS to JSON Proxy
// 100% Free - No API Keys Required
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ============================================================
// RSS FEED SOURCES (Completely Free & Open)
// ============================================================
$sources = [
    'cyber' => [
        'name' => 'Cyber Security',
        'feeds' => [
            'https://thehackernews.com/feeds/posts/default',
            'https://www.bleepingcomputer.com/feed/',
            'https://www.darkreading.com/rss/all.xml',
            'https://feeds.feedburner.com/TechCrunch/security',
            'https://www.wired.com/feed/category/security/latest/rss',
            'https://www.securityweek.com/feed',
            'https://www.zdnet.com/topic/security/rss.xml',
            'https://nakedsecurity.sophos.com/feed/',
            'https://krebsonsecurity.com/feed/',
            'https://www.schneier.com/blog/atom.xml'
        ]
    ],
    'tech' => [
        'name' => 'Technology',
        'feeds' => [
            'https://feeds.feedburner.com/TechCrunch',
            'https://www.wired.com/feed/rss',
            'https://www.theverge.com/rss/index.xml',
            'https://www.engadget.com/rss.xml',
            'https://arstechnica.com/feed/',
            'https://www.zdnet.com/news/rss.xml',
            'https://www.cnet.com/rss/news/',
            'https://www.pcworld.com/feed/index.rss'
        ]
    ],
    'news' => [
        'name' => 'General News',
        'feeds' => [
            'https://feeds.bbci.co.uk/news/world/rss.xml',
            'https://www.aljazeera.com/xml/rss/all.xml',
            'https://rss.cnn.com/rss/edition.rss',
            'https://feeds.npr.org/1001/rss.xml',
            'https://www.theguardian.com/world/rss',
            'https://www.reuters.com/world/rss/',
            'https://www.dw.com/en/top-stories/english/rss-all'
        ]
    ],
    'scam' => [
        'name' => 'Scam & Fraud',
        'feeds' => [
            'https://www.bbb.org/feed/rss/scam-stories',
            'https://www.ftc.gov/feeds/consumer-alerts/scams-and-frauds/rss',
            'https://www.scamwatch.gov.au/feed',
            'https://fraud.org/feed/'
        ]
    ],
    'osint' => [
        'name' => 'OSINT & Intel',
        'feeds' => [
            'https://www.osint.news/feed/',
            'https://www.intelligenceonline.com/feeds/rss/',
            'https://www.spyblog.org.uk/feed/',
            'https://www.globalintelligence.com/feed/',
            'https://www.foreignpolicy.com/feed/'
        ]
    ],
    'hacker' => [
        'name' => 'Hacker News',
        'feeds' => [
            'https://hnrss.org/frontpage',
            'https://hnrss.org/newest',
            'https://hnrss.org/best'
        ]
    ]
];

// ============================================================
// FUNCTION: Fetch RSS Feed
// ============================================================
function fetchRSSFeed($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 && $response) {
        return $response;
    }
    return false;
}

// ============================================================
// FUNCTION: Parse RSS to JSON
// ============================================================
function parseRSS($xml) {
    if (!$xml) return [];
    
    $feed = simplexml_load_string($xml);
    if (!$feed) return [];
    
    $items = [];
    $counter = 0;
    
    foreach ($feed->channel->item as $item) {
        if ($counter >= 20) break;
        
        $title = (string)$item->title;
        $description = (string)$item->description;
        $link = (string)$item->link;
        $pubDate = (string)$item->pubDate;
        $guid = (string)$item->guid;
        
        // Try to get image from content:encoded
        $image = '';
        if (isset($item->children('content', true)->encoded)) {
            $content = (string)$item->children('content', true)->encoded;
            if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/', $content, $matches)) {
                $image = $matches[1];
            }
        }
        
        // Get author
        $author = (string)$item->author;
        if (!$author && isset($item->creator)) {
            $author = (string)$item->creator;
        }
        
        $items[] = [
            'title' => $title ?: 'Untitled',
            'description' => strip_tags($description) ?: 'No description available',
            'url' => $link ?: '#',
            'publishedAt' => $pubDate ? date('c', strtotime($pubDate)) : date('c'),
            'source' => ['name' => parse_url($link, PHP_URL_HOST) ?: 'Unknown Source'],
            'author' => $author ?: 'Unknown Author',
            'urlToImage' => $image ?: null,
            'guid' => $guid ?: md5($title . $link)
        ];
        
        $counter++;
    }
    
    return $items;
}

// ============================================================
// FUNCTION: Fetch from GDELT (Open Source)
// ============================================================
function fetchGDELT() {
    $url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=cyber%20security%20OR%20hacking%20OR%20scam&mode=artlist&format=json';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if ($response) {
        $data = json_decode($response, true);
        if (isset($data['articles']) && is_array($data['articles'])) {
            return $data['articles'];
        }
    }
    return [];
}

// ============================================================
// FUNCTION: Fetch from Hacker News (Free API)
// ============================================================
function fetchHackerNews() {
    $topStories = [];
    
    // Get top story IDs
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://hacker-news.firebaseio.com/v0/topstories.json');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    if (!$response) return [];
    
    $ids = json_decode($response, true);
    if (!is_array($ids)) return [];
    
    $ids = array_slice($ids, 0, 10);
    
    foreach ($ids as $id) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://hacker-news.firebaseio.com/v0/item/{$id}.json");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        if ($response) {
            $story = json_decode($response, true);
            if ($story && isset($story['title'])) {
                $topStories[] = [
                    'title' => $story['title'],
                    'description' => $story['text'] ?? 'Hacker News Discussion',
                    'url' => $story['url'] ?? "https://news.ycombinator.com/item?id={$id}",
                    'publishedAt' => date('c', $story['time'] ?? time()),
                    'source' => ['name' => 'Hacker News'],
                    'author' => $story['by'] ?? 'Anonymous',
                    'urlToImage' => null,
                    'score' => $story['score'] ?? 0
                ];
            }
        }
    }
    
    return $topStories;
}

// ============================================================
// MAIN: Fetch all news
// ============================================================
function getAllNews($category = 'all') {
    global $sources;
    
    $allArticles = [];
    $fallbackUsed = false;
    
    // 1. Try RSS Feeds
    $feedUrls = [];
    if ($category === 'all') {
        foreach ($sources as $cat => $source) {
            $feedUrls = array_merge($feedUrls, $source['feeds']);
        }
    } else if (isset($sources[$category])) {
        $feedUrls = $sources[$category]['feeds'];
    }
    
    // Shuffle feeds to get variety
    shuffle($feedUrls);
    $feedUrls = array_slice($feedUrls, 0, 10);
    
    foreach ($feedUrls as $feedUrl) {
        $xml = fetchRSSFeed($feedUrl);
        if ($xml) {
            $items = parseRSS($xml);
            $allArticles = array_merge($allArticles, $items);
        }
    }
    
    // 2. If no articles from RSS, try GDELT
    if (empty($allArticles)) {
        $gdeltArticles = fetchGDELT();
        if (!empty($gdeltArticles)) {
            $allArticles = $gdeltArticles;
            $fallbackUsed = true;
        }
    }
    
    // 3. If still no articles, try Hacker News
    if (empty($allArticles)) {
        $hnArticles = fetchHackerNews();
        if (!empty($hnArticles)) {
            $allArticles = $hnArticles;
            $fallbackUsed = true;
        }
    }
    
    // 4. Remove duplicates based on title
    $unique = [];
    $titles = [];
    foreach ($allArticles as $article) {
        $title = trim($article['title'] ?? '');
        if ($title && !in_array($title, $titles)) {
            $titles[] = $title;
            $unique[] = $article;
        }
    }
    
    // 5. Sort by date (newest first)
    usort($unique, function($a, $b) {
        $timeA = strtotime($a['publishedAt'] ?? 'now');
        $timeB = strtotime($b['publishedAt'] ?? 'now');
        return $timeB - $timeA;
    });
    
    // 6. Limit results
    $unique = array_slice($unique, 0, 30);
    
    // 7. Add fallback flag
    if ($fallbackUsed) {
        $unique['fallback'] = true;
    }
    
    return $unique;
}

// ============================================================
// API ENDPOINT
// ============================================================
$category = $_GET['category'] ?? 'all';
$query = $_GET['q'] ?? '';
$page = intval($_GET['page'] ?? 1);
$pageSize = intval($_GET['pageSize'] ?? 6);

// Get articles
$articles = getAllNews($category);

// Apply search filter
if ($query && trim($query) !== '') {
    $searchTerm = strtolower(trim($query));
    $articles = array_filter($articles, function($article) use ($searchTerm) {
        $title = strtolower($article['title'] ?? '');
        $desc = strtolower($article['description'] ?? '');
        return strpos($title, $searchTerm) !== false || strpos($desc, $searchTerm) !== false;
    });
    // Re-index after filter
    $articles = array_values($articles);
}

// Pagination
$total = count($articles);
$start = ($page - 1) * $pageSize;
$articles = array_slice($articles, $start, $pageSize);

// Output JSON
$response = [
    'status' => 'ok',
    'totalResults' => $total,
    'articles' => $articles,
    'page' => $page,
    'pageSize' => $pageSize,
    'source' => 'Open Source Aggregator',
    'message' => empty($articles) ? 'No articles found. Please try again.' : null
];

// Add source info if fallback was used
if (isset($articles['fallback']) || isset($GLOBALS['fallbackUsed'])) {
    $response['fallback'] = true;
    unset($response['articles']['fallback']);
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
