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
      credentials: "true",
    },
    method: "POST",
    mode: "cors",
  });

  if (response.ok) {
    const data = await response.json();
    const isAdmin = email === "sophie.bluel@test.tld";
    const userId = data.userId;

    const adminCookieString = `isAdmin=${isAdmin}; sameSite=None; Secure; Max-Age=900`;
    document.cookie = adminCookieString;

    const userIdCookieString = `userId=${userId}; sameSite=None; Secure; max-age=900`;
    document.cookie = userIdCookieString;

    /* window.location.href = "index.html";*/
  } else {
    const error = await response.json();
    alert("E-mail et/ou mot de passe incorrect.");
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
      mode: "cors",
    });
    const data = await response.json();
    // Traiter les données de la réponse
    const myAccesToken = `myAccessToken=${data}; sameSite=None; Secure; httpOnly; max-age=900`;
    document.cookie = myAccesToken;
  } else {
    alert("Token d'identification manquant.");
  }
}
