import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, page, goToPage, getToken, setPosts, renderApp } from "../index.js";
import { onAddLikeClick, onDisLikeClick, getPosts } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postsHtml = posts
    .map((post, index) => {
      return `
    <li data-index="${index}" class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" data-is-liked="${
        post.isLiked
      }" class="like-button">
                      <img src="${
                        post.isLiked === true
                          ? "./assets/images/like-active.svg"
                          : "./assets/images/like-not-active.svg"
                      }">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.name}</strong>
                        
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${post.createdAt}
                    </p>
                  </li>
    `;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
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

  for (let likeButtonEl of document.querySelectorAll(".like-button")) {
    likeButtonEl.addEventListener("click", () => {
      // console.log(likeButtonEl.dataset.postId);
      const postId = likeButtonEl.dataset.postId;
      const isLiked = likeButtonEl.dataset.isLiked === true;
      const token = getToken();
      if (isLiked) {
        onDisLikeClick({ token, id: postId })
          .then(() => {
            likeButtonEl.dataset.isLiked = "false";
            // updatePosts(postId, false);
          })
          .catch((error) => {
            alert(error.message);
          });
      } else {
        onAddLikeClick({
          token,
          id: postId,
        })
          .then(() => {
            setPosts(posts);
            // getPosts({ token }).then((res) => {
            //   console.log(res);
              
            //   renderApp();
            // });
          likeButtonEl.dataset.isLiked = "true";
          })
          .catch((error) => {
            alert(error.message);
          });
      }

      renderPostsPageComponent({ appEl });
    });
  }
}
