import { getTokenFromCache } from "./getTokenFromCache.js";

export const handlePictureSubmit = async function (e) {
  e.preventDefault();
  const form = e.target;

  // Transformation de la catégorie
  const categorySelect = form.querySelector("#category");
  const categoryValue =
    categorySelect.options[categorySelect.selectedIndex].value;
  const category = categories[categoryValue];

  const formData = new FormData(form);

  formData.set("category", category);

  const token = await getTokenFromCache();
  try {
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
  } catch (error) {
    alert(
      "Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet, si le problème persiste veuillez contacter l'administrateur du serveur."
    );
    console.error(error);
    return null;
  }
};

// Définition des catégories pour ajout photo
const categories = {
  Objets: "1",
  Appartements: "2",
  "Hôtels & restaurants": "3",
};
