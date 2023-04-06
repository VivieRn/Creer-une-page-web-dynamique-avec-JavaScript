import { getAccessTokenFromCookie } from "./getAccessTokenFromCookie.js";
export const fetchDeleteImage = async (imageId) => {
  try {
    const token = getAccessTokenFromCookie();
    const response = await fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Unable to delete image.");
    }
    const cardImage = document.querySelector(`[data-id="${imageId}"]`);
    if (cardImage) {
      cardImage.remove();
    }
  } catch (err) {
    console.error(`Error deleting image: ${err}`);
  }
};
