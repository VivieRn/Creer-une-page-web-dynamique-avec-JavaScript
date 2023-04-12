export { fetchCardImages, genererCardImages };

async function fetchCardImages() {
  const response = await fetch("http://localhost:5678/api/works");
  const cardImages = await response.json();
  return cardImages;
}

// Définir une variable pour stocker les éléments générés
let cardElements = [];

// Fonction de génération de cartes images
function genererCardImages(cardImages) {
  for (let i = 0; i < cardImages.length; i++) {
    const article = cardImages[i];
    const sectionGallery = document.querySelector(".gallery");
    const pieceElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = article.title;

    sectionGallery.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);

    // Ajouter les éléments générés à la variable cardElements
    cardElements.push(pieceElement);
  }
}

// Supprime le contenu HTML de la section avec la classe "gallery"
document.querySelector(".gallery").innerHTML = "";

// Récupère les données de la carte d'images à partir de l'API et appelle la fonction genererCardImages
fetchCardImages().then((cardImages) => {
  genererCardImages(cardImages);
});
