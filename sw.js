// Sổ Cân Điều – chạy offline. Đổi số phiên bản (v1 → v2…) mỗi khi cập nhật app.
const CACHE = 'socandieu-v3';
const FILES = ['./', './index.html', './html2canvas.min.js', './jspdf.umd.min.js', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Lấy từ bộ nhớ máy trước (chạy được khi mất mạng); có mạng thì cập nhật ngầm cho lần mở sau
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
