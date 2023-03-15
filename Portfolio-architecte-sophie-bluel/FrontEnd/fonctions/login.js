const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = form.email.value;
  const mdp = form.mdp.value;

  const authenticated = authentication(email, mdp);

  if (authenticated) {
    window.location.href = "index.html";
  } else {
    alert("E-mail et/ou mot de passe incorrect.");
  }
});

// Fonction d'authentification

function authentication(email, mdp) {
  if (email === "admin" && mdp === "admin") {
    return true;
  } else {
    return false;
  }
}
