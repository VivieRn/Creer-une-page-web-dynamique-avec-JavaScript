import { setCookie } from "./setCookie.js";
import { deleteCookie } from "./deleteCookie.js";

let isAdmin = false;

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
      isAdmin = email === "sophie.bluel@test.tld";
      if (isAdmin) {
        setCookie("isAdmin", isAdmin, 24);
      }
      window.location.href = "index.html";
      navigator.serviceWorker.controller.postMessage({
        type: "SET_TOKEN",
        token: userToken,
      });
      navigator.serviceWorker.controller.postMessage({
        type: "SET_ADMIN",
        isAdmin: isAdmin,
      });
      deleteCookie("token");
      deleteCookie("isAdmin");
    });
  } else {
    alert("E-mail ou mot de passe incorrect.");
  }
}

export { isAdmin };
