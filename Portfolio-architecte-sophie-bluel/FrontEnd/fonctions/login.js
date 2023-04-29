let isAdmin = false;

const form = document.querySelector("form");
form.addEventListener("submit", fetchLogin);
async function fetchLogin(event) {
  try {
    event.preventDefault();
    const email = form.email.value;
    const password = form.mdp.value;
    const emptyMsg = document.querySelector(".emptyMsg");
    const errorMsg = document.querySelector(".errorMsg");
    if (!email || !password) {
      if (!emptyMsg.style.display || emptyMsg.style.display === "none") {
        emptyMsg.style.display = "block";
        const redBorders = document.querySelectorAll("input");
        for (let i = 0; i < redBorders.length; i++) {
          redBorders[i].style.border = "1px solid red";
        }
      }
      if (errorMsg.style.display === "block") {
        errorMsg.style.display = "none";
      }
      return;
    }
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
        isAdmin = email === "sophie.bluel@test.tld";
        window.location.href = "index.html";
        navigator.serviceWorker.controller.postMessage({
          type: "SET_TOKEN",
          token: userToken,
        });
        navigator.serviceWorker.controller.postMessage({
          type: "SET_ADMIN",
          isAdmin: isAdmin,
        });
      });
    } else {
      if (!errorMsg.style.display || errorMsg.style.display === "none") {
        errorMsg.style.display = "block";
      }
      if (emptyMsg.style.display === "block") {
        emptyMsg.style.display = "none";
      }
    }
  } catch (error) {
    alert(
      "Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet, si le problème persiste veuillez contacter l'administrateur du serveur."
    );
    console.error(error);
    return null;
  }
}

export { isAdmin };
