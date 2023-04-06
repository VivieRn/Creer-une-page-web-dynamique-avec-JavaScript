// Version du Service Worker
const version = "v1";

// Fichiers à mettre en cache
const filesToCache = ["../", "../index.html", "../fonctions/"];

// Événement d'installation du Service Worker
self.addEventListener("install", function (event) {
  console.log(`[${version}] Installing Service Worker`);

  // Mettre en cache les fichiers de l'application Web
  event.waitUntil(
    caches
      .open(version)
      .then(function (cache) {
        return cache.addAll(filesToCache);
      })
      .then(function () {
        console.log(`[${version}] All required resources have been cached`);
      })
  );
});

// Événement d'activation du Service Worker
self.addEventListener("activate", function (event) {
  console.log(`[${version}] Activating Service Worker`);

  // Supprimer les anciennes versions du cache
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== version;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        console.log(`[${version}] Service Worker has been activated`);
      })
  );
});

// Intercepter les requêtes réseau
self.addEventListener("fetch", function (event) {
  console.log(`[${version}] Intercepting fetch event for ${event.request.url}`);

  // Vérifier si la requête est déjà en cache
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Si la requête est en cache, renvoyer la réponse
      if (response) {
        console.log(
          `[${version}] Using response from cache for ${event.request.url}`
        );
        return response;
      }

      // Sinon, faire la requête normalement et mettre en cache la réponse
      return fetch(event.request).then(function (response) {
        console.log(`[${version}] Caching response from ${event.request.url}`);
        return caches.open(version).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
