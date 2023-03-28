import { fetchCardImages, genererCardImages } from "./filtres.js";

let modal = null;
const focusableSelector = "button, input, textarea, a";
let focusables = [];
let previouslyFocusedElement = null;

//Ouvrir la modale présente sur une autre page html
const openModal = async function (e) {
  if (typeof e !== "undefined") {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    modal = await loadModal(target);
    if (modal) {
      focusables = Array.from(modal.querySelectorAll(focusableSelector));
      previouslyFocusedElement = document.querySelector(":focus");
      focusables[0].focus();
      modal.style.display = null;
      modal.setAttribute("aria-modal", "true");
      modal.addEventListener("click", closeModal);
      modal
        .querySelector(".js-modal-close")
        .addEventListener("click", closeModal);
      modal
        .querySelector(".js-modal-stop")
        .addEventListener("click", stopPropagation);

      //Ajout de l'événement d'ajout de photos
      const addButton = modal.querySelector(".ajouterPhotos");
      addButton.addEventListener("click", async () => {
        await replaceModalContent();
      });

      // Ajout de l'événement de suppression pour chaque bouton de suppression
      const deleteButtons = modal.querySelectorAll(".imgDelete");
      deleteButtons.forEach(function (button) {
        button.addEventListener("click", async (e) => {
          e.preventDefault();
          const imageId = button.dataset.id;
          console.log(`delete button clicked with imageId ${imageId}`);
          await deleteImage(imageId);
          const cardImage = document.querySelector(`[data-id="${imageId}"]`);
          if (cardImage) {
            cardImage.remove();
          }
        });
      });

      //Suppression d'images par ID
      const deleteImage = async (imageId) => {
        try {
          const token = getAccessTokenFromCookie();
          const response = await fetch(
            `http://localhost:5678/api/works/${imageId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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

      // Récupère les données de la carte image à partir de l'API et appelle la fonction genererCardImages
      const sectionGallery = modal.querySelector(".modaleGallery");
      sectionGallery.innerHTML = "";

      fetchCardImages().then((cardImages) => {
        genererCardImages(cardImages);

        cardImages.forEach((cardImage) => {
          const pieceElement = document.createElement("figure");
          pieceElement.className = "CarteImage";

          // Ajout du bouton de suppression
          const deleteButton = document.createElement("button");
          deleteButton.className = "imgDelete";
          deleteButton.setAttribute("data-id", cardImage.id);
          const deleteIcon = document.createElement("i");
          deleteIcon.className = "fa-solid fa-xmark";
          deleteButton.appendChild(deleteIcon);
          pieceElement.appendChild(deleteButton);

          const imageElement = document.createElement("img");
          imageElement.src = cardImage.imageUrl;
          const nomElement = document.createElement("figcaption");
          nomElement.innerText = cardImage.title;

          pieceElement.appendChild(imageElement);
          pieceElement.appendChild(nomElement);

          sectionGallery.appendChild(pieceElement);

          // Ajout de l'écouteur d'événements de suppression
          deleteButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const imageId = deleteButton.getAttribute("data-id");
            console.log(`delete button clicked with imageId ${imageId}`);
            await deleteImage(imageId);
            const cardImage = document.querySelector(`[data-id="${imageId}"]`);
            if (cardImage) {
              cardImage.remove();
            }
          });
        });
      });

      //Remplacement du contenu pour ajouter une photo
      const replaceModalContent = async function () {
        // Création du contenu formulaire
        const formHTML = `
          <button class="modal-retour"><i class="fa-sharp fa-solid fa-arrow-left"></i></button>
          <form class="modaleForm">
            <label for="photo-upload">Ajout photo</label>
            <input type="file" id="photo-upload" name="photo-upload" accept="image/*">
            <label for="title">Titre</label>
            <input type="text" name="title" id="title">
            <label for="category">Catégorie :</label>
            <select name="category" id="category" form="category">
              <option value="Objets">Objets</option>
              <option value="Appartements">Appartements</option>
              <option value="Hôtels & restaurants">Hôtels & restaurants</option>
            </select>
            <button type="submit">Envoyer</button>
          </form>
        `;

        // Insertion du formulaire dans la modale
        const modaleGallery = modal.querySelector(".js-modale");
        modaleGallery.style.display = "none";
        const menuModale1 = modal.querySelector(".menuModale1");
        menuModale1.style.display = "none";

        const modalContent = modal.querySelector(".js-modale2");
        modalContent.innerHTML = formHTML;
        const form = modal.querySelector(".modaleForm");
        form.addEventListener("submit", handleFormSubmit);
        const retourButton = modal.querySelector(".modal-retour");
        retourButton.addEventListener("click", handleRetourClick);
      };

      //Gestion de l'événement retour depuis ajouter une photo
      const handleRetourClick = () => {
        const jsModale2 = modal.querySelector(".js-modale2");
        jsModale2.style.display = "none";
        const jsModale = modal.querySelector(".js-modale");
        jsModale.style.display = "block";
        const menuModale1 = modal.querySelector(".menuModale1");
        menuModale1.style.display = "flex";
      };
    }
  }
};

//Fermeture de la modale via plusieurs options
const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  e.preventDefault();
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  const hideModal = function () {
    modal.style.display = "none";
    modal.removeEventListener("animationend", hideModal);
  };
  modal.addEventListener("animationend", hideModal);
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

// Traitement du formulaire pour ajouter une photo
const handleFormSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error("Une erreur s'est produite lors de l'ajout de la photo.");
    }

    // Création de la nouvelle carte image
    const newCardImage = {
      id: responseData.id,
      title: formData.get("title"),
      imageUrl: responseData.imageUrl,
    };

    // Création des éléments HTML de la carte image
    const pieceElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = newCardImage.imageUrl;
    const nomElement = document.createElement("figcaption");
    nomElement.innerText = newCardImage.title;

    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);

    // Ajout du bouton de suppression
    const deleteButton = document.createElement("button");
    deleteButton.className = "imgDelete";
    deleteButton.setAttribute("data-id", newCardImage.id);
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-xmark";
    deleteButton.appendChild(deleteIcon);
    pieceElement.appendChild(deleteButton);

    sectionGallery.appendChild(pieceElement);

    // Ajout de l'écouteur d'événements de suppression
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const imageId = deleteButton.getAttribute("data-id");
      console.log(`delete button clicked with imageId ${imageId}`);
      await deleteImage(imageId);
      const cardImage = document.querySelector(`[data-id="${imageId}"]`);
      if (cardImage) {
        cardImage.remove();
      }
    });
  } catch (error) {
    console.error(error);
  }
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

const loadModal = async function (url) {
  const target = "#" + url.split("#")[1];
  const html = await fetch(url).then((response) => response.text());
  const element = document
    .createRange()
    .createContextualFragment(html)
    .querySelector(target);
  if (element === null)
    throw `L'élément ${target} n'a pas été trouvé dans la page ${url}`;
  document.body.append(element);
  return element;
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

//Récupération du token d'authentification
function getAccessTokenFromCookie() {
  const cookie = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("access_token="));
  if (!cookie) {
    return null;
  }
  return cookie.split("=")[1];
}
