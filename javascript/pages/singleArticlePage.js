import { showToast } from '../modules/toast.js';
import { getValueFromURLParameter, everyPageUtils, ligthboxEventlistner } from '../modules/utils.js';
import { postsEndpoint } from '../apiClient.js';

const blogID = getValueFromURLParameter('id');

if (!blogID) {
    window.location.href = '/';
}

const articleHeading = document.getElementById('article-heading');
const articleBody = document.getElementById('article-body');
// const articleCommentsSection = document.getElementById('article-comments-section');
const articleMetaAuthor = document.getElementById('article-author');
const articleMetaDate = document.getElementById('article-published-date');
const articleMetaCategory = document.getElementById('article-category');
const articleMetaTags = document.getElementById('article-tags');
const lastBreadcrumb = document.getElementById('last-crumb');

async function fetchSingleArticle(blogID) {
    try {
        let response = await fetch(postsEndpoint + '/' + blogID + '?_embed');
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
    console.log(article);
    document.title = `${article.title.rendered} | Joakim Tveter - Thoughts on web development`;
    document.querySelector('meta[name="description"]').setAttribute('content', article.excerpt.rendered);
    lastBreadcrumb.innerText = article.title.rendered;
    articleHeading.innerText = article.title.rendered;
    articleMetaAuthor.innerText = article._embedded.author[0].name;
    articleMetaCategory.innerText = article._embedded['wp:term'][0].map((tag) => tag.name).join(', ');
    articleMetaTags.innerText = article._embedded['wp:term'][1].map((tag) => tag.name).join(', ');

    articleMetaDate.innerHTML = new Date(article.date).toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
    articleBody.innerHTML = article.content.rendered;
    hljs.highlightAll();
    ligthboxEventlistner();
}

const article = await fetchSingleArticle(blogID);
renderSingleArticle(article);

everyPageUtils();
