// CONFIGURATION
const GITHUB_USERNAME = 'sairootsmusic';
const REPO_NAME = 'sairootsmusic.com';

document.addEventListener('DOMContentLoaded', () => {
    loadLatestPosts();
    initSearch();
});

// 1. FUNGSI LOAD POSTINGAN TERBARU (OTOMATIS)
async function loadLatestPosts() {
    const feedContainer = document.getElementById('index-feed');
    if (!feedContainer) return;

    try {
        // Mengambil daftar file dari folder /article di GitHub
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/article`);
        const files = await response.json();

        // Ambil 5 file terbaru (berdasarkan urutan alfabet/tanggal di nama file)
        const latestFiles = files.reverse().slice(0, 5);

        feedContainer.innerHTML = ''; // Hapus pesan 'Memuat konten...'

        latestFiles.forEach(file => {
            if (file.name.endsWith('.html')) {
                const title = file.name.replace(/-/g, ' ').replace('.html', '');
                const card = document.createElement('div');
                card.className = 'post-card';
                card.innerHTML = `
                    <div style="background: var(--card-bg); padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 2px solid var(--primary-color);">
                        <h3 style="text-transform: capitalize; margin-bottom: 5px;">${title}</h3>
                        <a href="/article/${file.name.replace('.html', '')}" style="color: var(--primary-color); text-decoration: none; font-size: 0.9rem;">Baca Selengkapnya →</a>
                    </div>
                `;
                feedContainer.appendChild(card);
            }
        });
    } catch (error) {
        console.error('Gagal memuat konten:', error);
        feedContainer.innerHTML = '<p style="color: var(--text-gray);">Belum ada postingan terbaru.</p>';
    }
}

// 2. SISTEM PENCARIAN PINTAR
function initSearch() {
    const searchInput = document.getElementById('siteSearch');
    if (!searchInput) return;

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.toLowerCase();
            // Redirect ke halaman pencarian atau filter konten (Simple version)
            alert('Mencari: ' + query + '... (Fitur ini akan aktif setelah folder /lyric dan /article terisi)');
        }
    });
}

// 3. CLEAN URL LOGIC (Helper)
// Jika user akses /about, GitHub Pages akan cari folder /about/index.html
// Pastikan link di HTML tidak menggunakan .html
async function loadLyrics() {
    const lyricContainer = document.getElementById('lyric-grid');
    if (!lyricContainer) return;

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/lyric`);
        const files = await response.json();

        lyricContainer.innerHTML = ''; 

        files.forEach(file => {
            if (file.name.endsWith('.html')) {
                const title = file.name.replace(/-/g, ' ').replace('.html', '');
                const card = document.createElement('div');
                card.style = "background: var(--card-bg); padding: 20px; border-radius: 8px; cursor: pointer; border: 1px solid #282828;";
                card.innerHTML = `
                    <h3 style="text-transform: capitalize; font-size: 1.1rem; margin-bottom: 5px;">${title}</h3>
                    <a href="/lyric/${file.name.replace('.html', '')}" style="color: var(--primary-color); text-decoration: none; font-size: 0.8rem;">Lihat Lirik →</a>
                `;
                lyricContainer.appendChild(card);
            }
        });
    } catch (error) {
        lyricContainer.innerHTML = '<p>Gagal memuat daftar lirik.</p>';
    }
}

// Tambahkan loadLyrics() ke dalam DOMContentLoaded di app.js
async function loadArticles() {
    const articleContainer = document.getElementById('article-grid');
    if (!articleContainer) return;

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/article`);
        const files = await response.json();

        articleContainer.innerHTML = ''; 

        files.reverse().forEach(file => { // reverse() supaya yang terbaru di atas
            if (file.name.endsWith('.html')) {
                const title = file.name.replace(/-/g, ' ').replace('.html', '');
                const item = document.createElement('div');
                item.className = 'article-item';
                item.innerHTML = `
                    <h3>${title}</h3>
                    <p>Ringkasan artikel singkat dari ${title}...</p>
                    <a href="/article/${file.name.replace('.html', '')}" style="color: var(--primary-color); text-decoration: none; font-weight: bold;">Baca Selengkapnya →</a>
                `;
                articleContainer.appendChild(item);
            }
        });
    } catch (error) {
        articleContainer.innerHTML = '<p>Gagal memuat artikel.</p>';
    }
}
// Panggil loadArticles() di bagian DOMContentLoaded app.js
async function loadVideos() {
    const videoContainer = document.getElementById('video-grid');
    if (!videoContainer) return;

    try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/video`);
        const files = await response.json();

        videoContainer.innerHTML = ''; 

        files.reverse().forEach(async file => {
            if (file.name.endsWith('.json')) { // Kita simpan data video dalam format JSON kecil
                const res = await fetch(file.download_url);
                const data = await res.json();
                
                const card = document.createElement('div');
                card.className = 'video-card';
                card.innerHTML = `
                    <div class="video-wrapper">
                        <iframe src="https://www.youtube.com/embed/${data.youtubeId}" allowfullscreen></iframe>
                    </div>
                    <h3 style="font-size: 1rem; margin-top: 15px; color: white;">${data.title}</h3>
                `;
                videoContainer.appendChild(card);
            }
        });
    } catch (error) {
        videoContainer.innerHTML = '<p>Gagal memuat galeri video.</p>';
    }
}
// Jangan lupa panggil loadVideos() di DOMContentLoaded
