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
    try {
        let response = await fetch(
            `${postsEndpoint}?search=${searchTerm}&per_page=10&page=${page}&orderby=relevance&_embed`
        );
        let data = await response.json();
        console.log(data);
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
        resultsListHTML += `
            <li class="post-card" data-id="${article.id}">
                <a class="post-card__title" data-id="${article.id}">
                    ${article.title.rendered}
                </a>
            </li>
        `;
    });

    searchResultsContainer.innerHTML = resultsListHTML;
}

searchForArticles(searchTerm);
everyPageUtils();
