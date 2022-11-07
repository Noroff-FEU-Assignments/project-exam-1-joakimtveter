import { showToast } from '../modules/toast.js';
import { getValueFromURLParameter, enableMenuButtons } from '../modules/utils.js';
import { postsEndpoint } from '../apiClient.js';

const articleListContainer = document.getElementById('article-list');
const moreArticlesButton = document.getElementById('more-articles-button');
let articlesArr = [];

async function fetchArticles(numberOfArticles = 10, page = 1) {
    try {
        let response = await fetch(`${postsEndpoint}?per_page=${numberOfArticles}&page=${page}&_embed`);
        let data = await response.json();
        articlesArr = articlesArr.concat(data);
        renderPostList();
    } catch (error) {
        showToast('Unable to fetch articles', 'error');
        console.error(error);
    }
}

function addPostClickEventListeners() {
    const postCards = document.querySelectorAll('.post-list__card');
    postCards.forEach((postCard) => {
        postCard.addEventListener('click', (event) => {
            const postId = event.currentTarget.dataset.id;
            window.location.href = `article.html?id=${postId}`;
        });
    });
}

function renderPostList() {
    if (articlesArr.length === 0) {
        articleListContainer.innerHTML = '<p>No articles found</p>';
        return;
    }
    let articleListHTML = '';
    console.log('articles: ', articlesArr);
    articlesArr.forEach((article) => {
        let imageUrl = '';
        const authorName = article._embedded.author[0].name;
        const date = new Date(article.date).toLocaleDateString();
        if (article._embedded['wp:featuredmedia']) {
            imageUrl = article._embedded['wp:featuredmedia'][0].source_url;
        }

        articleListHTML += `
            <li class="post-list__card" data-id="${article.id}">
                <figure class='post-list__figure'>
                    <img class='post-list__image' src="${imageUrl}" alt="Placeholder image" />
                </figure>
                <div class="post-list__post-content">
                    <h3 class="post-list__post-title">
                        ${article.title.rendered}
                    </h3>
                    <small class="post-list__post-date">by: ${authorName} - ${date}</small>
                    <div class="post-list__post-excerpt">${article.excerpt.rendered}</div>
                    <a class="post-list__post-link" href="article.html?id=${article.id}">Read more</a>
                </div>
            </li>
        `;
    });

    articleListContainer.innerHTML = articleListHTML;
    addPostClickEventListeners();
}

fetchArticles(10, 1);
