import { showToast } from '../modules/toast.js';
import { getValueFromURLParameter, everyPageUtils, escapeHtml } from '../modules/utils.js';
import { postsEndpoint } from '../apiClient.js';

const searchResultsContainer = document.getElementById('search-results');
const moreResultsButton = document.getElementById('more-results-button');
const resultCount = document.getElementById('result-length');
const resultTerm = document.getElementById('search-term');
const searchTerm = escapeHtml(getValueFromURLParameter('q'));

resultTerm.innerText = searchTerm;
document.title = `Search results for ${searchTerm} | Joakim Tveter - Thoughts on web development`;

let resultsArr = [];
let page = 1;
moreResultsButton.addEventListener('click', (event) => {
    page = page + 1;
    searchForArticles(searchTerm);
});

function updateResultCount() {
    resultCount.innerText = resultsArr.length;
}

async function searchForArticles(searchTerm) {
    if (searchTerm === '') {
        showToast('Please enter a search term', 'error');
        searchResultsContainer.innerHTML = 'No serach term entered';
        moreResultsButton.ariaDisabled = true;
        moreResultsButton.disabled = true;
        moreResultsButton.classList.add('disabled');
        return;
    }
    try {
        let response = await fetch(
            `${postsEndpoint}?search=${searchTerm}&per_page=10&page=${page}&orderby=relevance&_embed`
        );
        let data = await response.json();
        if (!data | (data.length < 10)) {
            moreResultsButton.ariaDisabled = true;
            moreResultsButton.disabled = true;
            moreResultsButton.classList.add('disabled');
        }
        resultsArr = resultsArr.concat(data);
        updateResultCount();
        renderSearchResults();
    } catch (error) {
        showToast('Unable to fetch articles', 'error');
        console.error(error);
        moreResultsButton.ariaDisabled = true;
        moreResultsButton.disabled = true;
        moreResultsButton.classList.add('disabled');
    }
}

function renderSearchResults() {
    if (resultsArr.length === 0) {
        articleListContainer.innerHTML = '<p>No results found</p>';
        return;
    }
    let resultsListHTML = '';
    resultsArr.forEach((article) => {
        let imageUrl = '';
        let altText = '';
        const authorName = article._embedded.author[0].name;
        const date = new Date(article.date).toLocaleDateString('nb-NO');
        if (article._embedded['wp:featuredmedia']) {
            imageUrl = article._embedded['wp:featuredmedia'][0].source_url;
            altText = article._embedded['wp:featuredmedia'][0].alt_text;
        }

        resultsListHTML += `
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

    searchResultsContainer.innerHTML = resultsListHTML;
}

searchForArticles(searchTerm);
everyPageUtils();
