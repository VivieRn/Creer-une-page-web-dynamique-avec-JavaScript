export const formPictureSubmitHTML = `
      <form class="modaleForm" method="post" enctype="multipart/form-data">
        <label class="modaleFormMainTitle" for="image">Ajout photo</label>
        <input type="file" id="image" name="image" accept="image/*" required>
        <img id="image-preview" src="" alt="jpg, png: 4mo max">
        <label class="modaleFormTitle" for="title">Titre</label>
        <input type="text" name="title" id="title" required>
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
