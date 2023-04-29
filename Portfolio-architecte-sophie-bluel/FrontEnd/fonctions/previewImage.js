export function previewImage(event) {
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

  document.querySelector(".modaleFormMainTitle").style.display = "none";
  document.querySelector(".fa-image").style.display = "none";
  document.querySelector(".selectPicture").style.backgroundColor = "white";
  document.querySelector(".selectPicture").style.border = "none";
  document.getElementById("btnAjoutPhoto").style.backgroundColor = "#1d6154";
  document.getElementById("btnAjoutPhoto").style.cursor = "pointer";
}
