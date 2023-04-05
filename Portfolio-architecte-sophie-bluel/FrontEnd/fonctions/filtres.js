import { fetchCardImages } from "./genererCardImages.js";
import { genererCardImages } from "./genererCardImages.js";

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
