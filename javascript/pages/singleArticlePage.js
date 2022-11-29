import { showToast } from '../modules/toast.js';
import { getValueFromURLParameter, everyPageUtils, ligthboxEventlistner } from '../modules/utils.js';
import { postsEndpoint } from '../apiClient.js';

const blogID = getValueFromURLParameter('id');

if (!blogID) {
    window.location.href = '/';
}

const articleHeading = document.getElementById('article-heading');
const articleBody = document.getElementById('article-body');
const articleCommentsSection = document.getElementById('article-comments-section');

async function fetchSingleArticle(blogID) {
    try {
        let response = await fetch(postsEndpoint + '/' + blogID);
        let data = await response.json();
        return data;
    } catch (error) {
        showToast('Unable to fetch article', 'error');
        console.error(error);
        setTimeout(() => {
            window.location.href = '/';
        }, 3500);
    }
}

function renderSingleArticle(article) {
    document.title = `${article.title.rendered} | Joakim Tveter - Thoughts on web development`;
    document.querySelector('meta[name="description"]').setAttribute('content', article.excerpt.rendered);
    articleHeading.innerHTML = article.title.rendered;
    articleBody.innerHTML = article.content.rendered;
    hljs.highlightAll();
    ligthboxEventlistner();
}

const article = await fetchSingleArticle(blogID);
renderSingleArticle(article);

everyPageUtils();
