import { loadModal } from "./loadModal.js";
import { fetchCardImages, genererCardImages } from "./genererCardImages.js";
import { fetchDeleteImage } from "./fetchDeleteImage.js";
import { handlePictureSubmit } from "./handlePictureSubmit.js";
import { previewImage } from "./previewImage.js";
import { handleDeleteClick } from "./handleDeleteClick.js";
import { formPictureSubmitHTML } from "./formPictureSubmitHTML.js";

let modal = null;
const focusableSelector = "button, input, textarea, a";
let focusables = [];
let previouslyFocusedElement = null;

//Ouvrir la modale présente sur une autre page html
const openModal = async function (e) {
  e?.preventDefault?.(); // Utilisation de l'opérateur optionnel pour éviter les erreurs si e est undefined
  const target = e?.target?.getAttribute?.("href");
  modal = await loadModal(target);
  if (!modal) return;
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.activeElement;
  focusables[0]?.focus?.();
  modal.style.display = null;
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    ?.addEventListener?.("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    ?.addEventListener?.("click", stopPropagation);

  const addButton = modal.querySelector(".ajouterPhotos");
  addButton?.addEventListener?.("click", async () => {
    await pictureSubmitForm();
  });

  // Ajout de l'événement de suppression pour chaque bouton de suppression
  const deleteButtons = modal.querySelectorAll(".imgDelete");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteClick);
  });

  // Récupère les données de la carte image à partir de l'API et appelle la fonction genererCardImages
  const sectionGallery = modal.querySelector(".modaleGallery");
  sectionGallery.innerHTML = "";

  fetchCardImages().then((cardImages) => {
    // Création des éléments HTML pour chaque image
    const imageElements = cardImages.map((cardImage) => {
      const pieceElement = document.createElement("figure");
      pieceElement.className = "CarteImage";

      // Bouton de suppression
      const deleteButton = document.createElement("button");
      deleteButton.className = "imgDelete";
      deleteButton.setAttribute("data-id", cardImage.id);
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fa-regular fa-trash-can";
      deleteButton.appendChild(deleteIcon);
      pieceElement.appendChild(deleteButton);

      // Bouton de déplacement
      const moveButton = document.createElement("button");
      moveButton.className = "imgMove";
      moveButton.setAttribute("data-id", cardImage.id);
      const moveIcon = document.createElement("i");
      moveIcon.className = "fa-solid fa-arrows-up-down-left-right";
      moveButton.appendChild(moveIcon);
      pieceElement.appendChild(moveButton);

      // Image et nom de l'image
      const imageElement = document.createElement("img");
      imageElement.src = cardImage.imageUrl;
      const nomElement = document.createElement("figcaption");
      nomElement.innerText = cardImage.title;
      pieceElement.appendChild(imageElement);
      pieceElement.appendChild(nomElement);

      // Ajout de l'écouteur d'événements de suppression
      deleteButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const imageId = deleteButton.getAttribute("data-id");
        await fetchDeleteImage(imageId);
        const cardImage = document.querySelector(`[data-id="${imageId}"]`);
        if (cardImage) {
          cardImage.remove();
        }
      });

      return pieceElement;
    });

    // Ajout des éléments HTML à la page
    sectionGallery.append(...imageElements);
  });

  //Remplacement du contenu pour ajouter une photo
  const pictureSubmitForm = async function () {
    const modaleGallery = modal.querySelector(".js-modale");
    modaleGallery.style.display = "none";

    const menuModale1 = modal.querySelector(".menuModale1");
    menuModale1.style.display = "none";

    const modalContent = modal.querySelector(".js-modale2");
    modalContent.innerHTML = formPictureSubmitHTML;

    const form = modal.querySelector(".modaleForm");
    form.addEventListener("submit", handlePictureSubmit);

    const retourButton = modal.querySelector(".modal-retour");
    retourButton.style.display = "block";
    retourButton.addEventListener("click", handleRetourClick);

    document.getElementById("image").addEventListener("change", previewImage);
  };

  //Gestion de l'événement retour depuis ajouter une photo
  const handleRetourClick = () => {
    const retourButton = modal.querySelector(".modal-retour");
    retourButton.style.display = "none";
    const jsModale2 = modal.querySelector(".js-modale2");
    jsModale2.innerHTML = "";
    const jsModale = modal.querySelector(".js-modale");
    jsModale.style.display = "block";
    const menuModale1 = modal.querySelector(".menuModale1");
    menuModale1.style.display = "flex";
  };
};

//Fermeture de la modale via plusieurs options
const closeModal = function () {
  if (!modal) return;
  previouslyFocusedElement?.focus();
  modal.removeAttribute("aria-modal");
  modal.setAttribute("aria-hidden", "true");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal.addEventListener("animationend", () => modal.remove(), { once: true });
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

//Gestion de la navigation via 'Tab'
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

document.querySelectorAll(".js-modale").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});
