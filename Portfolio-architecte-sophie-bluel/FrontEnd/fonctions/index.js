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
  const btnLogout = document.getElementById("logout");
  console.log(btnLogout);
  btnLogout.addEventListener("click", function () {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
  });
}
