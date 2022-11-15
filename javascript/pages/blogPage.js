import { showToast } from '../modules/toast.js';
import { getValueFromURLParameter, everyPageUtils } from '../modules/utils.js';
import { postsEndpoint } from '../apiClient.js';

const articleListContainer = document.getElementById('article-list');
const moreArticlesButton = document.getElementById('more-articles-button');
let articlesArr = [];
let page = 1;
moreArticlesButton.addEventListener('click', (event) => {
    page = page + 1;
    fetchArticles();
});

async function fetchArticles() {
    try {
        let response = await fetch(`${postsEndpoint}?per_page=10&page=${page}&_embed`);
        let data = await response.json();
        console.log(data);
        if (!data | (data.length < 10)) {
            moreArticlesButton.ariaDisabled = true;
            moreArticlesButton.disabled = true;
            moreArticlesButton.classList.add('disabled');
        }
        articlesArr = articlesArr.concat(data);
        renderPostList();
    } catch (error) {
        showToast('Unable to fetch articles', 'error');
        console.error(error);
        moreArticlesButton.ariaDisabled = true;
        moreArticlesButton.disabled = true;
        moreArticlesButton.classList.add('disabled');
    }
}

function addPostClickEventListeners() {
    const postCardsTitles = document.querySelectorAll('.post-card__title');
    const postCardsImages = document.querySelectorAll('.post-card__image');
    postCardsTitles.forEach((title) => {
        title.addEventListener('click', (event) => {
            const postId = event.currentTarget.dataset.id;
            window.location.href = `article.html?id=${postId}`;
        });
    });
    postCardsImages.forEach((image) => {
        image.addEventListener('click', (event) => {
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
    articlesArr.forEach((article) => {
        let imageUrl = '';
        let altText = '';
        const authorName = article._embedded.author[0].name;
        const date = new Date(article.date).toLocaleDateString('nb-NO');
        if (article._embedded['wp:featuredmedia']) {
            imageUrl = article._embedded['wp:featuredmedia'][0].source_url;
            altText = article._embedded['wp:featuredmedia'][0].alt_text;
        }

        articleListHTML += `
            <li class="post-card" data-id="${article.id}">
                <div class="post-card__body">
                    <figure class='post-card__figure'>
                        <img class='post-card__image' src="${imageUrl}" alt="${altText}" data-id="${article.id}"/>
                    </figure>
                    <div class="post-card__content">
                        <h3 class="post-card__title" data-id="${article.id}">
                            ${article.title.rendered}
                        </h3>
                        <small class="post-card__meta">by: <span class="author" data-id="${article.author}">${authorName} </span> - ${date}</small>
                        <div class="post-card__post-excerpt">${article.excerpt.rendered}</div>
                    </div>
                </div>
                <div class="post-card__footer">
                    <a class="post-card__footer-link" href="article.html?id=${article.id}">
                        Read more
                    </a>
                </div>
            </li>
        `;
    });

    articleListContainer.innerHTML = articleListHTML;
    addPostClickEventListeners();
}

fetchArticles();
everyPageUtils();
