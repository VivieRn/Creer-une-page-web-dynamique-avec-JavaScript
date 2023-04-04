export { fetchCardImages };
export { genererCardImages };

async function fetchCardImages() {
  const response = await fetch("http://localhost:5678/api/works");
  const cardImages = await response.json();
  return cardImages;
}

// Définir une variable pour stocker les éléments générés
let cardElements = [];

// Fonction de génération de cartes images
function genererCardImages(cardImages) {
  // Si des éléments ont déjà été générés, mettre à jour les données existantes
  if (cardElements.length > 0) {
    for (let i = 0; i < cardImages.length; i++) {
      const article = cardImages[i];
      const element = cardElements[i];
      element.querySelector("img").src = article.imageUrl;
      element.querySelector("figcaption").innerText = article.title;
    }
  } else {
    // Sinon, générer de nouveaux éléments
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
}

// Supprime le contenu HTML de la section avec la classe "gallery"
document.querySelector(".gallery").innerHTML = "";

// Récupère les données de la carte d'images à partir de l'API et appelle la fonction genererCardImages
fetchCardImages().then((cardImages) => {
  genererCardImages(cardImages);
});

//Fonction de tri "Tous"
const boutonTous = document.querySelector(".tous");

boutonTous.addEventListener("click", async function () {
  const cardImages = await fetchCardImages();
  genererCardImages(cardImages);
});

//Fonction de tri des objets
const boutonObjet = document.querySelector(".objets");

boutonObjet.addEventListener("click", async function () {
  const cardImages = await fetchCardImages();
  const objetsFiltres = cardImages.filter(function (cardImages) {
    return cardImages.categoryId === 1;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCardImages(objetsFiltres);
});

//Fonction de tri des appartements
const boutonAppartements = document.querySelector(".appartements");

boutonAppartements.addEventListener("click", async function () {
  const cardImages = await fetchCardImages();
  const appartementsFiltres = cardImages.filter(function (cardImages) {
    return cardImages.categoryId === 2;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCardImages(appartementsFiltres);
});

//Fonction de tri des appartements
const boutonHotelsRestaurants = document.querySelector(".hotelsRestaurants");

boutonHotelsRestaurants.addEventListener("click", async function () {
  const cardImages = await fetchCardImages();
  const hotelsRestaurantsFiltres = cardImages.filter(function (cardImages) {
    return cardImages.categoryId === 3;
  });
  document.querySelector(".gallery").innerHTML = "";
  genererCardImages(hotelsRestaurantsFiltres);
});
