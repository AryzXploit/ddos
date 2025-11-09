# Ethical Load Tester (Penguji Beban Etis)

Proyek ini adalah kerangka dasar Node.js untuk melakukan **Pengujian Beban (Load Testing)** pada server atau aplikasi web Anda sendiri. Tujuannya adalah untuk mengukur kinerja dan ketahanan sistem Anda secara bertanggung jawab.

**PENTING:**
Skrip ini **TIDAK** mengandung kode untuk serangan siber, bypass keamanan (seperti Cloudflare, WAF, atau anti-DDoS), atau aktivitas ilegal lainnya. Penggunaan skrip ini **HANYA** diizinkan untuk menguji sistem yang Anda miliki dan berhak untuk mengujinya. Penggunaan pada sistem pihak ketiga adalah **ILEGAL** dan **TIDAK ETIS**.

## Fitur Utama

Skrip ini mengimplementasikan konsep-konsep yang sah dan etis dari daftar yang Anda berikan, dengan fokus pada pengujian kinerja dan simulasi perilaku pengguna yang realistis:

| Konsep yang Diimplementasikan | Deskripsi |
| :--- | :--- |
| **Basic HTTP Flood (Load Test)** | Melakukan permintaan HTTP GET dan POST secara massal untuk menguji batas server. |
| **HTTP Get/Post Attack (Load Test)** | Menggunakan metode GET dan POST secara bergantian untuk simulasi transaksi data. |
| **Cluster Multi-threading** | Menggunakan `Promise.all` untuk menjalankan permintaan secara bersamaan (concurrent threads) untuk mencapai throughput tinggi. |
| **Proxy Rotation & Load Balancing** | Menggunakan daftar proxy untuk mensimulasikan lalu lintas dari berbagai lokasi (memerlukan konfigurasi di `config.js`). |
| **Auto-retry & Failover System** | Secara otomatis mencoba ulang permintaan yang gagal hingga batas maksimum (`MAX_RETRIES`). |
| **Connection Keep-Alive & Reuse** | Menggunakan header `Connection: keep-alive` untuk efisiensi koneksi. |
| **Header Generator** | Menghasilkan kombinasi header yang berbeda untuk meniru browser yang berbeda. |
| **User Agent Database** | Menggunakan daftar User Agent yang beragam untuk simulasi Mobile & Desktop. |
| **Real-time Status Monitoring** | Menampilkan progres, RPS, dan statistik keberhasilan/kegagalan saat pengujian berjalan. |
| **Memory & Resource Optimization** | Menggunakan `axios` dan manajemen koneksi yang efisien untuk pengujian skala besar. |

## Cara Menjalankan

### 1. Instalasi

Pastikan Anda memiliki Node.js terinstal.

```bash
# Masuk ke direktori proyek
cd ethical-load-tester

# Instal dependensi
npm install
```

### 2. Konfigurasi

Anda perlu mengedit dua file untuk konfigurasi:

#### a. `index.js`

Ubah variabel utama pengujian:

```javascript
// index.js
const TARGET_URL = 'http://localhost:3000/test'; // Ganti dengan URL Anda sendiri
const CONCURRENT_THREADS = 10; // Jumlah permintaan bersamaan
const REQUESTS_PER_THREAD = 50; // Jumlah permintaan per thread
```

#### b. `config.js`

Tambahkan daftar proxy Anda dan atur jumlah percobaan ulang:

```javascript
// config.js
const PROXIES = [
    // Tambahkan daftar proxy Anda di sini. Contoh: 'http://user:pass@ip:port'
    'http://127.0.0.1:8080', 
];

const MAX_RETRIES = 3; // Jumlah maksimum percobaan ulang
```

### 3. Eksekusi

Jalankan skrip menggunakan Node.js:

```bash
node index.js
```

Anda akan melihat output pemantauan real-time dan laporan akhir setelah pengujian selesai.

## Struktur Proyek

- `index.js`: Logika utama pengujian beban, eksekusi thread, dan pelaporan.
- `config.js`: Konfigurasi untuk daftar proxy dan jumlah percobaan ulang (`MAX_RETRIES`).
- `headers.js`: Logika untuk menghasilkan header HTTP yang realistis dan rotasi User Agent.
- `package.json`: Daftar dependensi (`axios`, `@faker-js/faker`).
