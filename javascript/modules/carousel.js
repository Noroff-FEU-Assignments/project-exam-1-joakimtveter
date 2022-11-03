const slidesContainer = document.querySelector('.post-slider__posts-container');
const post = document.querySelector('.post-slider__post');
const prevButton = document.querySelector('.post-slider__button.back');
const nextButton = document.querySelector('.post-slider__button.next');

nextButton.addEventListener('click', () => {
    const postWidth = post.clientWidth;
    slidesContainer.scrollLeft += postWidth + 16;
});

prevButton.addEventListener('click', () => {
    const postWidth = post.clientWidth;
    slidesContainer.scrollLeft -= postWidth + 16;
});
