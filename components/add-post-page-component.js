//add-post-page-component.js
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { getToken, goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";

export function renderAddPostPageComponent({
  appEl,
  onAddPostClick,
  }) {
  let imageUrl = "";
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: appEl.querySelector(".input").value,
        imageUrl,
        token: getToken(),
      })
        .then((data) => {
          console.log("Пост успешно добавлен:", data);
          return data; // Возвращаем данные, которые могут быть полезны при необходимости
        })
        .catch((error) => {
          console.error("Ошибка при добавлении поста:", error.message);
          throw error; // Прокидываем ошибку дальше, чтобы её можно было обработать в вызывающем коде
        });
        goToPage(POSTS_PAGE);
      });
  };

  render();
}
