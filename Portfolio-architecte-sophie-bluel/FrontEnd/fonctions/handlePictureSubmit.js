import { getTokenFromCache } from "./getTokenFromCache.js";

export const handlePictureSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;
  const title = form.title.value;
  const file = form.image.files[0];

  if (!title || !file) {
    const errorMsg = document.querySelector(".emptyMsg");
    errorMsg.style.display = "block";
    const border = document.querySelector(".selectPicture");
    border.style.border = "1px solid red";
    border.style.borderRadius = "5px";
    const redBorders = document.querySelectorAll(
      "input[type='text'], input[type='file']"
    );
    for (let i = 0; i < redBorders.length; i++) {
      redBorders[i].style.border = "1px solid red";
    }
    return;
  }

  // Transformation de la catégorie
  const categorySelect = form.querySelector("#category");
  const categoryValue =
    categorySelect.options[categorySelect.selectedIndex].value;
  const category = categories[categoryValue];

  const formData = new FormData(form);

  formData.set("category", category);

  const token = await getTokenFromCache();
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    },
    body: formData,
    mode: "cors",
  });

  if (!response.ok) {
    alert("Utilisateur non autorisé, merci de vous reconnecter.");
  } else {
    const responseData = await response.json();

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

    // Ajout de la nouvelle carte image à la galerie
    const gallery = document.querySelector("#gallery");
    gallery.appendChild(pieceElement);

    // Remplacement du contenu du modal avec la nouvelle carte image
    replaceModalContent(newCardImage);
  }
};

// Définition des catégories pour ajout photo
const categories = {
  Objets: "1",
  Appartements: "2",
  "Hôtels & restaurants": "3",
};
