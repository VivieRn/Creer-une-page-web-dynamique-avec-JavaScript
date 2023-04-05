//Récupération du token d'authentification
export function getAccessTokenFromCookie() {
  const cookie = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  if (!cookie) {
    console.log("Pas de cookies trouvé");
  }
  return cookie.split("=")[1];
}
