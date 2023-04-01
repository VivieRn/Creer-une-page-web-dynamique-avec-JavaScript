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
    const isAdmin = email === "sophie.bluel@test.tld";

    const cookieOptions = {
      sameSite: "Strict",
      secure: true,
      httpOnly: true,
      maxAge: 900, // la durée de validité en secondes, ici 15 minutes
    };
    try {
      document.cookie = `token=${token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ")}`;
      console.log("Cookie créé");
    } catch (error) {
      console.error(error);
    }

    const adminCookieString = `isAdmin=${isAdmin}; sameSite=None; Secure; Max-Age=900`;
    document.cookie = adminCookieString;

    console.log("Connection OK");
    window.location.href = "index.html";
  } else {
    const error = await response.json();
    alert("E-mail et/ou mot de passe incorrect.");
  }
}

/*function getData() {
  const cookies = document.cookie.split("; ");
  const token = cookies.find((cookie) => cookie.startsWith("AccessToken="));
  if (token) {
    const myAccesToken = `myAccessToken=${token}; sameSite=None; Secure; httpOnly; max-age=900`;
    document.cookie = myAccesToken;
  } else {
    console.log("Token non trouvé");
    alert("Token d'identification manquant.");
  }
}
getData();*/
