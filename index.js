const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { PROXIES, MAX_RETRIES } = require('./config');

// --- Configuration ---
const TARGET_URL = 'http://localhost:3000/test'; // Ganti dengan URL Anda sendiri untuk pengujian beban yang etis
let proxyIndex = 0; // Indeks untuk rotasi proxy
const CONCURRENT_THREADS = 10; // Jumlah permintaan bersamaan (Max Threads)
const REQUESTS_PER_THREAD = 50; // Jumlah total permintaan per thread
const TOTAL_REQUESTS = CONCURRENT_THREADS * REQUESTS_PER_THREAD;

const { generateRealisticHeaders } = require('./headers');



/**
 * @brief Melakukan satu permintaan HTTP (GET atau POST).
 * @param {string} method Metode HTTP ('GET' atau 'POST').
 * @returns {Promise<number>} Status code dari respons.
 */
/**
 * @brief Memilih proxy berikutnya secara bergiliran (round-robin).
 * @returns {string|undefined} URL proxy atau undefined jika tidak ada proxy.
 */
function getNextProxy() {
    if (PROXIES.length === 0) return undefined;
    const proxy = PROXIES[proxyIndex];
    proxyIndex = (proxyIndex + 1) % PROXIES.length; // Rotasi
    return proxy;
}

/**
 * @brief Melakukan satu permintaan HTTP (GET atau POST) dengan percobaan ulang.
 * @param {string} method Metode HTTP ('GET' atau 'POST').
 * @param {number} attempt Percobaan saat ini.
 * @returns {Promise<number>} Status code dari respons.
 */
async function makeRequest(method, attempt = 1) {
    const headers = generateRealisticHeaders();
    const proxyUrl = getNextProxy();

    const config = {
        headers: headers,
        timeout: 5000, // Timeout 5 detik
        validateStatus: () => true, // Jangan melempar error untuk status non-2xx
        proxy: proxyUrl ? {
            protocol: proxyUrl.split('://')[0],
            host: proxyUrl.split('://')[1].split(':')[0],
            port: parseInt(proxyUrl.split(':')[2]),
        } : undefined,
    };

    try {
        let response;
        if (method === 'POST') {
            const postData = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                message: faker.lorem.sentence(),
            };
            response = await axios.post(TARGET_URL, postData, config);
        } else { // Default to GET
            response = await axios.get(TARGET_URL, config);
        }
        
        // Auto-retry untuk kegagalan koneksi atau status server error (5xx)
        if (response.status === 0 || response.status >= 500) {
            throw new Error(`Server error or connection failure (Status: ${response.status})`);
        }

        return response.status;
    } catch (error) {
        if (attempt < MAX_RETRIES) {
            // console.log(`Request failed (Attempt ${attempt}). Retrying...`);
            await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Jeda kecil sebelum retry
            return makeRequest(method, attempt + 1);
        }
        // console.error(`Error during ${method} request after ${MAX_RETRIES} retries:`, error.message);
        return 0; // Mengembalikan 0 setelah semua percobaan gagal
    }
}

/**
 * @brief Menjalankan serangkaian permintaan secara berurutan dalam satu thread.
 * @param {number} threadId ID unik untuk thread ini.
 * @returns {Promise<object>} Statistik permintaan untuk thread ini.
 */
async function runThread(threadId) {
    const stats = { success: 0, failure: 0, total: 0 };
    for (let i = 0; i < REQUESTS_PER_THREAD; i++) {
        const method = i % 2 === 0 ? 'GET' : 'POST'; // Rotasi GET/POST
        const status = await makeRequest(method);
        stats.total++;
        if (status >= 200 && status < 300) {
            stats.success++;
        } else {
            stats.failure++;
        }
        // console.log(`[Thread ${threadId}] Request ${i + 1}/${REQUESTS_PER_THREAD} (${method}) Status: ${status}`);
    }
    return stats;
}

/**
 * @brief Fungsi utama untuk menjalankan pengujian beban.
 */
async function startLoadTest() {
    console.log(`\n--- Ethical Load Tester Started ---`);
    console.log(`Target URL: ${TARGET_URL}`);
    console.log(`Concurrent Threads: ${CONCURRENT_THREADS}`);
    console.log(`Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`Proxy Rotation: ${PROXIES.length > 0 ? 'Aktif' : 'Nonaktif'} (${PROXIES.length} proxy)`);
    console.log(`Max Retries: ${MAX_RETRIES}\n`);

    const startTime = Date.now();
    let completedRequests = 0;
    let totalSuccess = 0;
    let totalFailure = 0;

    // Real-time Status Monitoring (Simulasi)
    const monitorInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const currentRPS = completedRequests / elapsed;
        process.stdout.write(`\rProgress: ${completedRequests}/${TOTAL_REQUESTS} | Success: ${totalSuccess} | Failure: ${totalFailure} | RPS: ${currentRPS.toFixed(2)}`);
    }, 500); // Update setiap 500ms

    // Cluster Multi-threading (simulasi dengan Promise.all)
    const threads = [];
    for (let i = 1; i <= CONCURRENT_THREADS; i++) {
        threads.push(runThread(i).then(stats => {
            completedRequests += stats.total;
            totalSuccess += stats.success;
            totalFailure += stats.failure;
            return stats;
        }));
    }

    const results = await Promise.all(threads);
    clearInterval(monitorInterval);
    process.stdout.write('\n'); // Pindah ke baris baru setelah monitoring selesai

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;

    // Agregasi hasil
    const finalStats = {
        success: totalSuccess,
        failure: totalFailure,
        total: TOTAL_REQUESTS
    };

    const rps = finalStats.total / durationSeconds;

    // Final Report (User friendly interface)
    console.log(`\n==================================================`);
    console.log(`\t\tTEST SELESAI`);
    console.log(`==================================================`);
    console.log(`\n[ Konfigurasi ]`);
    console.log(`Target URL\t\t: ${TARGET_URL}`);
    console.log(`Threads Bersamaan\t: ${CONCURRENT_THREADS}`);
    console.log(`Permintaan Total\t: ${TOTAL_REQUESTS}`);
    
    console.log(`\n[ Hasil ]`);
    console.log(`Durasi\t\t\t: ${durationSeconds.toFixed(2)} detik`);
    console.log(`Permintaan Berhasil\t: ${finalStats.success} (${((finalStats.success / finalStats.total) * 100).toFixed(2)}%)`);
    console.log(`Permintaan Gagal\t: ${finalStats.failure} (${((finalStats.failure / finalStats.total) * 100).toFixed(2)}%)`);
    console.log(`RPS (Requests/sec)\t: ${rps.toFixed(2)}`);
    console.log(`\n==================================================`);
    console.log(`\n*** PENTING: Gunakan skrip ini HANYA untuk menguji sistem yang Anda miliki dan berhak untuk mengujinya. Penggunaan pada sistem pihak ketiga adalah ILEGAL dan TIDAK ETIS. ***`);
}

startLoadTest();
