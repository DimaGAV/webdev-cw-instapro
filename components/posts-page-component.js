import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, user, goToPage, getToken, setPosts } from "../index.js";
import { onAddLikeClick, onDisLikeClick } from "../api.js";
import { sanitizeHtml } from "../helpers.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  // console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postsHtml = posts
    .map((post, index) => {
      const createDate = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
      });
      if (getToken()) {
        const isLiked = isLikedPost(post);
        return `
        <li data-index="${index}" class="post">
                        <div class="post-header" data-user-id="${post.user.id}">
                            <img src="${
                              post.user.imageUrl
                            }" class="post-header__user-image">
                            <p class="post-header__user-name">${
                              post.user.name
                            }</p>
                        </div>
                        <div class="post-image-container">
                          <img class="post-image" src="${post.imageUrl}">
                        </div>
                        <div class="post-likes">
                          <button data-post-id="${
                            post.id
                          }" data-is-liked="${isLiked}" data-index="${index}" class="like-button">
                          <img src="${
                            isLiked
                              ? `./assets/images/like-active.svg`
                              : `./assets/images/like-not-active.svg`
                          }">
                          </button>
                          <p class="post-likes-text">
                  Нравится: <strong>${
                    posts[index].likes.length > 0
                      ? posts[index].likes[posts[index].likes.length - 1].name
                      : "0"
                  }</strong> ${
          posts[index].likes.length - 1 > 0
            ? "и ещё" + " " + (posts[index].likes.length - 1)
            : ""
        }
                  </p >
                        </div>
                        <p class="post-text">
                          <span class="user-name">${post.user.name}</span>
                          ${sanitizeHtml(post.description)}
                        </p>
                        <p class="post-date">
                          ${createDate} назад
                        </p>
                      </li>
        `;
      } else {
        return `
      <li data-index="${index}" class="post">
                      <div class="post-header" data-user-id="${post.user.id}">
                          <img src="${
                            post.user.imageUrl
                          }" class="post-header__user-image">
                          <p class="post-header__user-name">${
                            post.user.name
                          }</p>
                      </div>
                      <div class="post-image-container">
                        <img class="post-image" src="${post.imageUrl}">
                      </div>
                      <div class="post-likes">
                        <button data-post-id="${post.id}" data-is-liked="${
          post.isLiked
        }" data-index="${index}" class="like-button">
        <img src="./assets/images/like-not-active.svg">
        </button>
                        <p class="post-likes-text">
                Нравится: <strong>${
                  posts[index].likes.length > 0
                    ? posts[index].likes[posts[index].likes.length - 1].name
                    : "0"
                }</strong> ${
          posts[index].likes.length - 1 > 0
            ? "и ещё" + " " + (posts[index].likes.length - 1)
            : ""
        }
                </p >
                      </div>
                      <p class="post-text">
                        <span class="user-name">${post.user.name}</span>
                        ${sanitizeHtml(post.description)}
                      </p>
                      <p class="post-date">
                        ${createDate} назад
                      </p>
                    </li>
      `;
      }
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <header class="header-container"></header>
                <ul class="posts">${postsHtml}</ul>
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

  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const postId = likeButton.dataset.postId;
      const index = likeButton.dataset.index;

      onAddLikeClick({ token: getToken(), id: postId })

      if (getToken()) {
        const isLiked = isLikedPost(posts[index]);

        if (isLiked) {
          return onDisLikeClick({ token: getToken(), id: postId }).then(
            (res) => {
              const updatedPost = res.post; // Получаем обновленный пост из ответа
              updatedPostAndRender(updatedPost, appEl);
            }
          );
        } else {
          return onAddLikeClick({ token: getToken(), id: postId }).then(
            (res) => {
              const updatedPost = res.post;
              updatedPostAndRender(updatedPost, appEl);
            }
          );
        }
      }
    });
  }
}

function isLikedPost(post) {
  return post.likes.find((like) => {
    return like.id === user._id || like._id === user._id;
  });
}

function updatedPostAndRender(updatedPost, appEl) {
  const newPosts = posts.map((post) =>
    post.id === updatedPost.id ? updatedPost : post
  );
  setPosts(newPosts);
  renderPostsPageComponent({
    appEl,
  });
}
