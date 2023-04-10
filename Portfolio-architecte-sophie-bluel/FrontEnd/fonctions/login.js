import { setCookie } from "./setCookie.js";
import { deleteCookie } from "./deleteCookie.js";
import { adminAccess } from "./adminAccess.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/Portfolio-architecte-sophie-bluel/serviceWorker.js", {
      scope: "/Portfolio-architecte-sophie-bluel/",
    })
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
      const isAdmin = email === "sophie.bluel@test.tld";
      if (isAdmin) {
        setCookie("isAdmin", 24);
      }
      window.location.href = "index.html";
      navigator.serviceWorker.controller.postMessage({
        type: "SET_TOKEN",
        token: userToken,
        isAdmin: isAdmin,
      });
      deleteCookie("token");
      deleteCookie("isAdmin");
      adminAccess(isAdmin);
    });
  } else {
    const error = await response.json();
    console.error(error);
  }
}
