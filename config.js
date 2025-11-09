// Daftar proxy (IP:PORT) untuk rotasi.
// Ganti dengan daftar proxy Anda sendiri yang sah dan berizin.
// Format: ['http://user:pass@ip:port', 'http://ip:port']
const PROXIES = [
    // Placeholder - Ganti dengan proxy Anda yang sebenarnya
    'http://127.0.0.1:8080', 
    'http://127.0.0.1:8081',
    'http://127.0.0.1:8082',
];

// Konfigurasi umum
const MAX_RETRIES = 3; // Jumlah maksimum percobaan ulang untuk permintaan yang gagal

module.exports = {
    PROXIES,
    MAX_RETRIES,
};
