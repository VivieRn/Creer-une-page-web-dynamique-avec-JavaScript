export const getTokenFromCache = async () => {
  const response = await caches.match("/token");
  if (!response) {
    alert("Utilisateur non authentifié, merci de vous reconnecter.");
    throw new Error("Token not found in cache");
  }
  const text = await response.text();
  const token = JSON.parse(`{ "access_token": "${text}" }`);
  return token.access_token;
};
