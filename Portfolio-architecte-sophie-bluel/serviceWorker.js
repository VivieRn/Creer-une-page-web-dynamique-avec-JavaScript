const whitelistedOrigins = [
  "http://localhost",
  "http://localhost:5500",
  "http://localhost:5678",
  "http://127.0.0.1:5500/",
  "http://127.0.0.1:5678/",
];

let token = "";

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SET_TOKEN") {
    token = event.data.token;
    console.log("[SW] token set!");
  }
});

const whitelistedPathRegex = /\/api\/[^.]*$/;
// Version du Service Worker
const version = "v1";

// Fichiers à mettre en cache
const filesToCache = [
  "/Portfolio-architecte-sophie-bluel/serviceWorker.js",
  "/Portfolio-architecte-sophie-bluel/Frontend/fonctions/login.js",
];

// Vérifie si l'origine est autorisée
function isWhitelistedOrigin(request) {
  const origin = request.origin || request.url;
  return whitelistedOrigins.some((url) => origin.startsWith(url));
}

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

  // Vérifier l'origine de la requête
  if (!isWhitelistedOrigin(event.request)) {
    console.log(
      `[${version}] Ignoring request from origin ${event.request.origin}`
    );
    return;
  }

  // Vérifier si la requête est déjà en cache
  if (shouldCacheRequest(event.request)) {
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
          console.log(
            `[${version}] Caching response from ${event.request.url}`
          );
          return caches.open(version).then(function (cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});

const addAuthHeader = function (event) {
  destURL = new URL(event.request.url);
  if (
    whitelistedOrigins.includes(destURL.origin) &&
    whitelistedPathRegex.test(destURL.pathname)
  ) {
    const modifiedHeaders = new Headers(event.request.headers);
    if (token) {
      modifiedHeaders.append("Authorization", token);
    }
    const authReq = new Request(event.request, {
      headers: modifiedHeaders,
      mode: "cors",
    });
    event.respondWith((async () => fetch(authReq))());
  }
};

// Intercept all fetch requests and add the auth header
self.addEventListener("fetch", addAuthHeader);

function shouldCacheRequest(request) {
  // Vérifier si la méthode de la requête est POST
  if (request.method === "POST") {
    console.log("POST request will not be cached.");
    return false;
  }

  return true;
}
