<?php
// ============================================================
// Open Source News Aggregator - Configuration
// ============================================================

// Cache settings (reduce load)
define('CACHE_ENABLED', true);
define('CACHE_DIR', __DIR__ . '/cache');
define('CACHE_LIFETIME', 3600); // 1 hour

// Create cache directory if not exists
if (!is_dir(CACHE_DIR)) {
    mkdir(CACHE_DIR, 0755, true);
}

// Function to get cached data
function getCachedData($key) {
    if (!CACHE_ENABLED) return false;
    
    $file = CACHE_DIR . '/' . md5($key) . '.json';
    if (file_exists($file) && (time() - filemtime($file)) < CACHE_LIFETIME) {
        return json_decode(file_get_contents($file), true);
    }
    return false;
}

// Function to set cache data
function setCachedData($key, $data) {
    if (!CACHE_ENABLED) return false;
    
    $file = CACHE_DIR . '/' . md5($key) . '.json';
    file_put_contents($file, json_encode($data));
    return true;
}

// Log errors (for debugging)
function logError($message) {
    $logFile = __DIR__ . '/error.log';
    $logEntry = date('Y-m-d H:i:s') . ' - ' . $message . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}
?>
