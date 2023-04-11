function cacheIsAdmin() {
  return caches.open("isAdmin-cache").then(function (cache) {
    return cache.match("/isAdmin").then(function (response) {
      if (response) {
        return response.text().then(function (text) {
          return text === "true";
        });
      } else {
        return false;
      }
    });
  });
}

const btnAdmin = document.getElementsByClassName("btnAdmin");

export function adminAccess() {
  cacheIsAdmin().then(function (isAdmin) {
    if (isAdmin) {
      for (let i = 0; i < btnAdmin.length; i++) {
        btnAdmin[i].style.display = "block";
        const btnLogout = document.getElementById("logout");
        btnLogout.style.display = "block";
        const btnLogin = document.getElementById("login");
        btnLogin.style.display = "none";
        const menuFiltre = document.getElementById("filtre");
        menuFiltre.style.display = "none";
      }
    } else {
      console.log("Not admin");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  adminAccess();
});
