import { setCookie } from "./setCookie.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(
      "/Portfolio-architecte-sophie-bluel/FrontEnd/fonctions/serviceWorker.js",
      { scope: "/Portfolio-architecte-sophie-bluel/FrontEnd/fonctions/" }
    )
    .then(function (registration) {
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    })
    .catch(function (error) {
      console.log("ServiceWorker registration failed: ", error);
    });
}

const form = document.querySelector("form");
form.addEventListener("submit", fetchLogin);
async function fetchLogin(event) {
  event.preventDefault();
  const email = form.email.value;
  const password = form.mdp.value;
  const response = await fetch("http://localhost:5678/api/users/login", {
    body: JSON.stringify({ email, password }),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    mode: "cors",
  });
  if (response.ok) {
    response.json().then(function (user) {
      const userToken = user.token;
      setCookie("token", userToken, 24);
      const userId = user.userId;
      setCookie("userId", userId, 24);
      console.log("Connection OK");
      window.location.href = "index.html";
    });
  } else {
    const error = await response.json();
    console.error(error);
  }
}

const isAdmin = email === "sophie.bluel@test.tld";
if (true) {
  setCookie("isAdmin", true, 24);
}
