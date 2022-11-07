import { showToast } from './toast.js';

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

// DOM UTILITY FUNCTIONS

function loadingSpinner(location) {
    if (location) {
        location.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>`;
    }
}

function openMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.add('active');
}

function closeMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    mobileMenu.classList.remove('active');
}

function enableMenuButtons() {
    document.querySelectorAll('.hamburger').forEach((button) => {
        button.addEventListener('click', (e) => {
            openMenu();
        });
    });

    document.querySelectorAll('.hamburger-close').forEach((button) => {
        button.addEventListener('click', (e) => {
            closeMenu();
        });
    });
}

export { getValueFromURLParameter, setUrlParameterWithoutReload, loadingSpinner, enableMenuButtons };
