async function fetchCardImages() {
  const response = await fetch("http://localhost:5678/api/works");
  const cardImages = await response.json();
  return cardImages;
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
document.querySelector(".gallery").innerHTML = "";
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
