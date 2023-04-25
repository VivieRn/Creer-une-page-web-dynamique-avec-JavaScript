import { getTokenFromCache } from "./getTokenFromCache.js";

export const fetchDeleteImage = async (imageId) => {
  const token = await getTokenFromCache();
  const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  if (!response.ok) {
    alert("Echec de la suppression, merci de vérifier votre connexion.");
  }
  const cardImage = document.querySelector(`[data-id="${imageId}"]`);
  if (cardImage) {
    cardImage.remove();
  }
};
