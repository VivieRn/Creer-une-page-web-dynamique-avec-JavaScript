let modal = null;
const focusableSelector = "button, input, textarea, a";
let focusables = [];
let previouslyFocusedElement = null;

//Ouvrir la modale présente sur une autre page html
const openModal = async function (e) {
  if (typeof e !== "undefined") {
    e.preventDefault();
    const target = e.target.getAttribute("href");
    {
      modal = await loadModal(target);
    }
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
    }
    const addButton = modal
      .querySelector(".ajouterPhotos")
      .addEventListener("click", function () {
        replaceModalContent();
      });
  }
};
//Remplacement du contenu pour ajouter une photo
const replaceModalContent = async function () {
  // Création du contenu formulaire
  const formHTML = `
  <button class="modal-retour">Retour</button>
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
  <button type="Valider">Envoyer</button>
</form>
`;

  // Insertion du formulaire dans la modale
  const modalContent = modal.querySelector(".modaleGallery");
  modalContent.innerHTML = formHTML;
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
