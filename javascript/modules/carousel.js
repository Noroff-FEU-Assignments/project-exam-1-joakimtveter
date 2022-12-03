function postSliderInit() {
    const slidesContainer = document.querySelector('.post-slider__posts-container');
    const prevButton = document.querySelector('.post-slider__button.back');
    const nextButton = document.querySelector('.post-slider__button.next');

    nextButton.addEventListener('click', () => {
        slidesContainer.scrollLeft += slidesContainer.clientWidth;
    });

    prevButton.addEventListener('click', () => {
        slidesContainer.scrollLeft -= slidesContainer.clientWidth;
    });
}

export { postSliderInit };
