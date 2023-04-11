function logout() {
  const logoutLink = document.getElementById("logout");
  logoutLink.addEventListener("click", async function (event) {
    event.preventDefault();
    // Supprimer les caches du Service Worker
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      cacheNames.forEach(async function (cacheName) {
        if (cacheName === "token-cache" || cacheName === "isAdmin-cache") {
          await caches.delete(cacheName);
        }
      });
    }
    window.location.href = "login.html";
  });
}
document.addEventListener("DOMContentLoaded", function () {
  logout();
});
