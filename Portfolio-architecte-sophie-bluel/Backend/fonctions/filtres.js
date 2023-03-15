async function fetchCardImages() {
  const response = await fetch("http://localhost:5678/api/works");
  const cardImages = await response.json();
  genererCardImages(cardImages);
}

//Fonction de génération de cartes images
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
  }
}

fetchCardImages();

//Fonction de tri des objets
const boutonObjet = document.querySelector(".objets");
