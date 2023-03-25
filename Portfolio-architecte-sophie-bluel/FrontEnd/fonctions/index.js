document.addEventListener("DOMContentLoaded", function () {
  const cookies = document.cookie.split("; ");
  const isAdmin =
    cookies.find((cookie) => cookie.startsWith("isAdmin="))?.split("=")[1] ===
    "true";
  if (isAdmin) {
    const btnAdmin = document.getElementById("btnAdmin");
    btnAdmin.style.display = "block";
    const btnLogout = document.getElementById("logout");
    btnLogout.style.display = "block";
    const btnLogin = document.getElementById("login");
    btnLogin.style.display = "none";
  }
});

function logout() {
  const logoutLink = document.getElementById("logout");
  logoutLink.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Clicked !");
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict;";
    document.cookie =
      "isAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict;";
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  logout();
});
