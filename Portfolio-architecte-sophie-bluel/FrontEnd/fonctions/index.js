document.addEventListener("DOMContentLoaded", function () {
  const isAdmin = window.localStorage.getItem("isAdmin") === "true";
  if (isAdmin) {
    const btnAdmin = document.getElementById("btnAdmin");
    btnAdmin.style.display = "block";
    console.log("Admin !!");
  }
});
