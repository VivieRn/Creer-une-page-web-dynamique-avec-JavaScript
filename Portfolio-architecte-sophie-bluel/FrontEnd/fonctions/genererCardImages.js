export { fetchCardImages, genererCardImages };

async function fetchCardImages() {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      headers: { mode: "cors" },
    });
    const cardImages = await response.json();
    return cardImages;
  } catch (error) {
    alert(
      "Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet, si le problème persiste veuillez contacter l'administrateur du serveur."
    );
    console.error(error);
    return null;
  }
}

// Définir une variable pour stocker les éléments générés
let cardElements = [];

// Définir une variable pour vérifier si les éléments ont déjà été générés et ajoutés
let elementsGeneres = false;

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
    if (!cardElements.includes(pieceElement)) {
      cardElements.push(pieceElement);
    }
  }

  // Mettre à jour la variable elementsGeneres
  elementsGeneres = true;
}

// Supprime le contenu HTML de la section avec la classe "gallery"
document.querySelector(".gallery").innerHTML = "";

// Récupère les données de la carte d'images à partir de l'API et appelle la fonction genererCardImages
fetchCardImages().then((cardImages) => {
  // Vérifier si les éléments ont déjà été générés et ajoutés
  if (!elementsGeneres) {
    genererCardImages(cardImages);
  }
});
