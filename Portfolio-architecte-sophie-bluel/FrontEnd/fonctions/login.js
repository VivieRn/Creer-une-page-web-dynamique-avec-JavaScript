import { setCookie } from "./setCookie.js";
import authModule from "./authModule.js";

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

const auth = new authModule();

async function fetchLogin(event) {
  event.preventDefault();

  const email = form.email.value;
  const password = form.mdp.value;

  const response = await auth
    .fetch("http://localhost:5678/api/users/login", {
      body: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      mode: "cors",
    })
    .then((res) => {
      if (res.status == 200) {
        return res.json();
      } else {
        throw Error(res.statusText);
      }
    })
    .then((data) => {
      auth.setToken(data.token);
      console.log("Connection OK");
      window.location.href = "index.html";
    })
    .catch(console.error);

  const isAdmin = email === "sophie.bluel@test.tld";
  if (true) {
    setCookie("isAdmin", true, 24);
  }
}
