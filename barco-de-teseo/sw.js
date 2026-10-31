// Caché offline de la app. Sube VERSION al cambiar archivos.
const VERSION = "teseo-v1";
const ARCHIVOS = ["./", "index.html", "styles.css", "app.js", "data.js", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.hostname === "api.anthropic.com") return; // nunca cachear la IA
  if (url.origin === location.origin) {
    // Red primero (para recibir actualizaciones); caché si no hay conexión.
    e.respondWith(
      fetch(e.request).then((r) => { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copia)); return r; })
        .catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  } else if (url.hostname === "esm.sh") {
    // Cliente de Claude: caché primero.
    e.respondWith(caches.match(e.request).then((h) => h || fetch(e.request).then((r) => { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copia)); return r; })));
  }
});
