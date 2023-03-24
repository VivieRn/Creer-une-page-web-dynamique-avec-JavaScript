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
    const data = await response.json();
    const token = data.token;
    window.localStorage.setItem("isAdmin", email === "sophie.bluel@test.tld");
    window.location.href = "index.html";
  } else {
    const error = await response.json();
    alert("E-mail et/ou mot de passe incorrect.");
  }

  async function getData() {
    const cookies = document.cookie.split("; ");
    const token = cookies.find((cookie) => cookie.startsWith("access_token="));
    if (token) {
      const jwt = token.split("=")[1];
      const response = await fetch("http://localhost:5678/api/users", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        mode: "cors",
      });
      const data = await response.json();
      // Traiter les données de la réponse
    } else {
      alert("Token d'identification manquant.");
    }
  }
}
