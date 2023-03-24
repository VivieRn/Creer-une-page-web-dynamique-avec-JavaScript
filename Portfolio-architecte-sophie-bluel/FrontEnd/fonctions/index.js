document.addEventListener("DOMContentLoaded", function () {
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";
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
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
  });
}
document.addEventListener("DOMContentLoaded", function () {
  logout();
});
