export function adminAccess() {
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
document.addEventListener("DOMContentLoaded", function () {
  adminAccess();
});

const btnAdmin = document.getElementsByClassName("btnAdmin");
