navigator.serviceWorker.controller.postMessage({ type: "GET_CACHE_INFO" });

navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SET_TOKEN") {
    const { token, isAdmin } = event.data;

    if (isAdmin) {
      const btnAdmin = document.getElementsByClassName("btnAdmin");
      for (let i = 0; i < btnAdmin.length; i++) {
        btnAdmin[i].style.display = "block";
        const btnLogout = document.getElementById("logout");
        btnLogout.style.display = "block";
        const btnLogin = document.getElementById("login");
        btnLogin.style.display = "none";
        const menuFiltre = document.getElementById("filtre");
        menuFiltre.style.display = "none";
      }
    }
  }
});

function logout() {
  const logoutLink = document.getElementById("logout");
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Clicked !");
    document.cookie =
      "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict;";
    document.cookie =
      "isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict;";
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  logout();
});
