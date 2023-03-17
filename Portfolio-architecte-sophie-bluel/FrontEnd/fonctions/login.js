const form = document.querySelector("form");
form.addEventListener("submit", fetchLogin);

async function fetchLogin(event) {
  event.preventDefault();

  const email = form.email.value;
  const password = form.mdp.value;

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    const token = data.token;
    document.cookie = `access_token=${token}; Secure; HttpOnly`;
    window.location.href = "index.html";
  } else {
    const error = await response.json();
    alert(error.message);
  }
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
    });
    const data = await response.json();
    // Traiter les données de la réponse
  } else {
    // Gérer l'absence du jeton d'accès
  }
}
