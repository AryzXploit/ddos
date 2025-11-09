const { faker } = require('@faker-js/faker');

// Daftar User Agent yang lebih beragam (simulasi database 5000+)
// Ini adalah subset kecil, tetapi menunjukkan konsep rotasi.
const USER_AGENTS = [
    // Chrome on Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    // Firefox on macOS
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/120.0',
    // Safari on iOS (Mobile Simulation)
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    // Edge on Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.2210.144',
    // Chrome on Android (Mobile Simulation)
    'Mozilla/5.0 (Linux; Android 13; SM-S901U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
];

/**
 * @brief Menghasilkan header yang realistis untuk simulasi browser.
 * @returns {object} Objek header HTTP.
 */
function generateRealisticHeaders() {
    // Pilih User Agent secara acak dari daftar atau gunakan faker untuk variasi
    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    // Simulasi Header Generator (2000+ kombinasi) dengan rotasi header umum
    const acceptHeader = [
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'application/json, text/plain, */*',
    ][Math.floor(Math.random() * 3)];

    const acceptEncoding = [
        'gzip, deflate, br',
        'gzip, deflate',
        'identity',
    ][Math.floor(Math.random() * 3)];

    const acceptLanguage = [
        'en-US,en;q=0.9',
        'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'en-GB,en;q=0.9',
    ][Math.floor(Math.random() * 3)];

    const referer = faker.internet.url();

    return {
        'User-Agent': userAgent,
        'Accept': acceptHeader,
        'Accept-Encoding': acceptEncoding,
        'Accept-Language': acceptLanguage,
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Referer': referer, // Human-like Request Patterns
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
    };
}

module.exports = {
    generateRealisticHeaders,
};
