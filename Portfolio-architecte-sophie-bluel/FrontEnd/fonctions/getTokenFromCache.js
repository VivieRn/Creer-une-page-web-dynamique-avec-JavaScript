export const getTokenFromCache = async () => {
  const response = await caches.match("/token");
  if (!response) {
    console.log("Token not found in cache");
    throw new Error("Token not found in cache");
  }
  const text = await response.text();
  console.log("Token founded1");
  const token = JSON.parse(`{ "access_token": "${text}" }`);
  return token.access_token;
};
