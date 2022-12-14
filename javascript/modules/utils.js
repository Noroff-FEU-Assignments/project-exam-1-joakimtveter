import { showToast } from './toast.js';

const menuButton = document.getElementById('menu-button');
const searchToggle = document.getElementById('toggle-search-button');

// URL UTILITY FUNCTIONS

function getValueFromURLParameter(parameter) {
    const urlParams = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return urlParams[parameter];
}

function setUrlParameterWithoutReload(parameter = '', value = '') {
    const currentPath = window.location.pathname;
    if (parameter.length > 0 && value.length > 0) {
        window.history.pushState({}, '', `${currentPath}?${parameter}=${value}`);
    } else {
        window.history.pushState({}, '', currentPath);
    }
}

// INPUT UTILITY FUNCTIONS

const escapeHtml = (unsafe) => {
    return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
};

// DOM UTILITY FUNCTIONS

function loadingSpinner(location) {
    if (!location) return;
    location.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>`;
}

// LIGHTBOX
const lighbox = document.getElementById('lightbox');

function ligthboxEventlistner() {
    const articleFeaturedImage = document.querySelector('.featured-image');
    const articleImages = document.querySelectorAll('.wp-block-image');

    articleFeaturedImage?.addEventListener('click', (e) => {
        openLightbox(e);
    });

    articleImages.forEach((image) => {
        image.addEventListener('click', (e) => {
            openLightbox(e);
        });
    });

    lighbox.addEventListener(
        'click',
        (e) => {
            closeLightbox(e);
        },
        { useCapture: true }
    );
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });
}

function openLightbox(e) {
    const caption = e.target.parentElement?.lastChild?.innerText || ' ';
    document.getElementById('lightbox-image').src = e.target.src;
    document.getElementById('lightbox-image').alt = e.target.alt;
    document.getElementById('lightbox-caption').innerText = caption;
    lighbox.classList.add('active');
    document.querySelector('body').style.overflow = 'hidden';
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
}

function closeLightbox(e) {
    console.log('closeLightbox1: ', e.target);
    if (e.target.id === 'lightbox-image') return;
    if (e.target.id === 'lightbox-caption') return;
    console.log('closeLightbox2: ', e.target.id);
    lighbox.classList.remove('active');
    document.querySelector('body').style.overflow = 'auto';
}

// SCRIPTS THAT LOAD ON EVERY PAGE

function toggleSearch() {
    const searchform = document.getElementById('search-form');
    searchform.classList.toggle('active');
}

function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    } else {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        hamburgerIcon.style.display = 'none';
        closeIcon.style.display = 'block';
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                toggleMenu();
            }
        });
    }
}

function everyPageUtils() {
    const currentLocation = window.location.pathname;
    // Highlight avtive menu link
    document.querySelectorAll('.main-navigation__link').forEach((link) => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
    // Deactivate logo link on homepage
    if (currentLocation === '/index.html' || currentLocation === '/') {
        const logo = document.getElementById('logo');
        logo.removeAttribute('href');
        logo.style.cursor = 'default';
    }

    menuButton.addEventListener('click', toggleMenu);
    searchToggle.addEventListener('click', toggleSearch);
}

export {
    getValueFromURLParameter,
    setUrlParameterWithoutReload,
    loadingSpinner,
    openLightbox,
    everyPageUtils,
    escapeHtml,
    ligthboxEventlistner,
};
