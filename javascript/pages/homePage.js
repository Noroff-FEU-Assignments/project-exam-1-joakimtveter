import { showToast } from '../modules/toast.js';
import { everyPageUtils } from '../modules/utils.js';
import { postSliderInit } from '../modules/carousel.js';
import { postsEndpoint } from '../apiClient.js';

async function fetchLatestArticles() {
    try {
        let response = await fetch(`${postsEndpoint}?per_page=8&orderby=date&order=desc&_embed`);
        let data = await response.json();
        renderLatestPosts(data);
        postSliderInit();
    } catch (error) {
        showToast('Unable to fetch latest articles', 'error');
        console.error(error);
    }
}

function renderLatestPosts(posts) {
    const postsContainer = document.querySelector('.post-slider__posts-container');
    let postsHtml = '';
    if (posts.length === 0) {
        postsContainer.innerHTML = 'No posts found';
        return;
    }
    posts.forEach((post) => {
        let imageUrl = '';
        let altText = '';
        if (post._embedded['wp:featuredmedia']) {
            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
            altText = post._embedded['wp:featuredmedia'][0].alt_text;
        }
        const date = new Date(post.date).toLocaleDateString('nb-NO');
        postsHtml += `
        <li class="post-slider__post">
            <figure>
                <img src="${imageUrl}" alt="${altText}" data-id="${post.id}" />
            </figure>
            <div class="post-slider__post-content">
                <h3 class="post-slider__post-title">
                    ${post.title.rendered}
                </h3>
                <p class="post-slider__post-meta">By: ${post._embedded.author[0].name} - ${date}  </p>
                <div>
                    ${post.excerpt.rendered}
                    <a class="post-slider__post-link" href="blog.html?id=${post.id}" aria-label="Read article; ${post.title.rendered}">
                        Read more
                    </a>
                </div>
            </div>
        </li>`;
    });
    postsContainer.innerHTML = postsHtml;
}

fetchLatestArticles();
everyPageUtils();
