//global variables
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide img, .carousel-slide video');
const intervalTime = 5000; // Time in milliseconds
let autoSlideInterval;
let paused = false;

function moveSlide(n) {
    clearInterval(autoSlideInterval); // Stop the current auto-slide
    showSlides(slideIndex += n);
    if (!paused) {
        autoSlide(); // Restart the auto-slide timer
    }
}

function showSlides(n) {
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    slides.forEach((slide, index) => {
        slide.style.display = (index === slideIndex) ? 'block' : 'none';
    });

    updateIndicators();
}

function autoSlide() {
    autoSlideInterval = setInterval(() => {
        moveSlide(1);
    }, intervalTime);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function createIndicators() {
    const indicatorContainer = document.querySelector('.carousel-indicators');
    slides.forEach((_, index) => {
        const indicator = document.createElement('span');
        indicator.classList.add('carousel-indicator');
        indicator.addEventListener('click', () => showSlides(index));
        indicatorContainer.appendChild(indicator);
    });
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
}

function togglePlayPause() {
    const pauseButton = document.querySelector('.pause');
    if (paused) {
        autoSlide();
        pauseButton.innerHTML = '&#10073;&#10073;'; // Pause icon
    } else {
        stopAutoSlide();
        pauseButton.innerHTML = '&#9658;'; // Play icon
    }
    paused = !paused;
}


document.addEventListener('DOMContentLoaded', () => {
    createIndicators();
    showSlides(slideIndex);
    autoSlide();
});

document.querySelectorAll('.carousel-slide video').forEach(video => {
    video.addEventListener('play', () => {
        stopAutoSlide();
        paused = true;
        document.querySelector('.pause').innerHTML = '&#9658;'; // Change to play icon
    });

    video.addEventListener('pause', () => {
        if (paused) {
            togglePlayPause();
        }
    });

    video.addEventListener('ended', () => {
        if (paused) {
            togglePlayPause();
        }
    });
});