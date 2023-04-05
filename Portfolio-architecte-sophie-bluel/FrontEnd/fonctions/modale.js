import { fetchCardImages, genererCardImages } from "./genererCardImages.js";

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
          deleteIcon.className = "fa-regular fa-trash-can";
          deleteButton.appendChild(deleteIcon);
          pieceElement.appendChild(deleteButton);

          // Ajout du bouton de déplacement
          const moveButton = document.createElement("button");
          moveButton.className = "imgMove";
          moveButton.setAttribute("data-id", cardImage.id);
          const moveIcon = document.createElement("i");
          moveIcon.className = "fa-solid fa-arrows-up-down-left-right";
          moveButton.appendChild(moveIcon);
          pieceElement.appendChild(moveButton);

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

          // Récupérer toutes les images à déplacer
          const cardImagesMove = document.querySelectorAll(".CarteImage");

          // Ajouter un gestionnaire d'événements "mousedown" à chaque bouton de déplacement
          document
            .querySelectorAll(".imgMove")
            .forEach(function (moveButton, i) {
              moveButton.addEventListener("mousedown", function (event) {
                // Empêcher la propagation de l'événement pour éviter les conflits avec d'autres événements
                event.stopPropagation();

                // Récupérer l'image correspondante
                const cardImageMove = cardImagesMove[i];

                // Calculer la distance entre la position de la souris et la position de l'image
                const offsetX = event.clientX - cardImageMove.offsetLeft;
                const offsetY = event.clientY - cardImageMove.offsetTop;

                // Ajouter des gestionnaires d'événements "mousemove" et "mouseup" au document
                document.addEventListener("mousemove", moveImage);
                document.addEventListener("mouseup", stopMoving);

                // Fonction pour déplacer l'image en fonction des mouvements de la souris
                function moveImage(event) {
                  // Calculer la nouvelle position de l'image en fonction de la position de la souris
                  const left = event.clientX - offsetX;
                  const top = event.clientY - offsetY;

                  // Définir la nouvelle position de l'image
                  cardImageMove.style.left = left + "px";
                  cardImageMove.style.top = top + "px";
                }

                // Fonction pour supprimer les gestionnaires d'événements "mousemove" et "mouseup"
                function stopMoving() {
                  document.removeEventListener("mousemove", moveImage);
                  document.removeEventListener("mouseup", stopMoving);
                }
              });
            });
        });
      });
    }

    //Remplacement du contenu pour ajouter une photo
    const replaceModalContent = async function () {
      // Création du contenu formulaire
      const formHTML = `
          
          <form class="modaleForm" method="post" enctype="multipart/form-data">

            <label class="modaleFormMainTitle" for="image">Ajout photo</label>
            <input type="file" id="image" name="image" accept="image/*" onchange="previewImage(event)">
            <img id="image-preview" src="" alt="jpg, png: 4mo max">

            <label class="modaleFormTitle" for="title">Titre</label>
            <input type="text" name="title" id="title">

            <label class="modaleFormTitle" for="category">Catégorie</label>
            <select name="category" id="category">
              <option value="Objets">Objets</option>
              <option value="Appartements">Appartements</option>
              <option value="Hôtels & restaurants">Hôtels & restaurants</option>
            </select>

            <div>
            <button id="btnAjoutPhoto" type="submit">Valider</button>
            </div>
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
      retourButton.style.display = "block";
      retourButton.addEventListener("click", handleRetourClick);

      document
        .getElementById("image")
        .addEventListener("change", function (event) {
          previewImage(event);
        });

      function previewImage(event) {
        // Récupération de l'élément HTML contenant la prévisualisation de l'image
        var imgPreview = document.getElementById("image-preview");

        // Récupération de l'image sélectionnée dans le formulaire
        var selectedImage = event.target.files[0];

        // Création d'un objet FileReader pour lire les données de l'image
        var reader = new FileReader();

        // Définition de la fonction à exécuter lorsque la lecture est terminée
        reader.onload = function (event) {
          // Définition de la source de l'image dans l'élément HTML de prévisualisation
          imgPreview.src = event.target.result;
        };

        // Lecture des données de l'image
        reader.readAsDataURL(selectedImage);

        document.getElementById("image").style.display = "none";
        document.getElementById("btnAjoutPhoto").style.backgroundColor =
          "#1d6154";
        document.getElementById("btnAjoutPhoto").style.cursor = "pointer";
      }
    };

    //Gestion de l'événement retour depuis ajouter une photo
    const handleRetourClick = () => {
      const retourButton = modal.querySelector(".modal-retour");
      retourButton.style.display = "none";
      const jsModale2 = modal.querySelector(".js-modale2");
      jsModale2.style.display = "none";
      const jsModale = modal.querySelector(".js-modale");
      jsModale.style.display = "block";
      const menuModale1 = modal.querySelector(".menuModale1");
      menuModale1.style.display = "flex";
    };
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

//Défintion des catégories pour ajout photo
const categories = {
  Objets: "1",
  Appartements: "2",
  "Hôtels & restaurants": "3",
};

//Envoie de la requête POST afin d'upload l'image
const handleFormSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;

  // Transformation de la catégorie
  const categorySelect = form.querySelector("#category");
  const categoryValue =
    categorySelect.options[categorySelect.selectedIndex].value;
  const category = categories[categoryValue];

  const formData = new FormData(form);

  formData.set("category", category);

  for (let item of formData) {
    console.log(item[0], item[1]);
  }

  try {
    const token = getAccessTokenFromCookie();
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      body: formData,
      mode: "cors",
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error("Une erreur s'est produite lors de l'ajout de la photo.");
    }
    console.log("FirstStep OK !!!!");
    // Création de la nouvelle carte image
    const newCardImage = {
      id: responseData.id,
      title: formData.get("title"),
      imageUrl: responseData.imageUrl,
      categoryId: categories[formData.get("category")],
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
    deleteIcon.className = "fa-regular fa-trash-can";
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
    replaceModalContent();
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
    .find((cookie) => cookie.trim().startsWith("token="));
  if (!cookie) {
    console.log("Pas de cookies trouvé");
  }
  return cookie.split("=")[1];
}
