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
