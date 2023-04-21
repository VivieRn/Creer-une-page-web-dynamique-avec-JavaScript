import { getTokenFromCache } from "./getTokenFromCache.js";

export const fetchDeleteImage = async (imageId) => {
  try {
    const token = await getTokenFromCache();
    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    console.log(response);
    if (!response.ok) {
      throw new Error(responseData.message || "Unable to delete image.");
    }
    const cardImage = document.querySelector(`[data-id="${imageId}"]`);
    if (cardImage) {
      cardImage.remove();
    }
  } catch (err) {
    alert("Suppression de projet refusé. Veuillez vous reconnecter.");
  }
};
