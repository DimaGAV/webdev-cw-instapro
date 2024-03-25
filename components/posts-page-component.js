import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const userId = user.id;
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                 <li class="post">
                    <div class="post-header" data-user-id="${userId}">
                        <img src="${user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${user.name}</p>
                    </div>
                  
                    
                    <div class="post-image-container">
                      <img class="post-image" src="${posts.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${posts.id}" class="like-button">
                        <img src="./assets/images/like-not-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${posts.likes.lenght}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${user.name}</span>
                      ${posts.description}
                    </p>
                    <p class="post-date">
                      ${posts.createdAt}
                    </p>
                  </li>
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
