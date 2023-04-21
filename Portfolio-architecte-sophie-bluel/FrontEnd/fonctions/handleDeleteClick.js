export async function handleDeleteClick(e) {
  e.preventDefault();
  const imageId = e.currentTarget.dataset.id;
  console.log(`delete button clicked with imageId ${imageId}`);
  await fetchDeleteImage(imageId);
  const cardImage = document.querySelector(`[data-id="${imageId}"]`);
  if (cardImage) {
    cardImage.remove();
  } else {
    alert("Projet non trouvé.");
  }
}
