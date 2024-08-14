const aboutCompany = () => {
  const slides = document.querySelectorAll(".awards-slider-slide");
  const slider = document.querySelector(".awards-slider");
  const slideList = document.querySelector(".awards-slides");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const paginationDots = document.querySelectorAll(".pagination-dot");
  var currentIndex = 0;

  function updateSliderHeight() {
    var maxHeight = 0;

    slides.forEach((slide) => {
      const height = slide.scrollHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    if (slider) {
      slider.style.height = maxHeight + "px";
    }
  }

  function updateSlidePosition() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });
    paginationDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
    updateSliderHeight();
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidePosition();
  }

  function showPrevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
  }

  if (prevButton) {
    prevButton.addEventListener("click", showPrevSlide);
  }

  if (nextButton) {
    nextButton.addEventListener("click", showNextSlide);
  }

  if (paginationDots.length > 0) {
    paginationDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlidePosition();
      });
    });
  }

  updateSlidePosition();

  window.addEventListener("resize", () => {
    updateSliderHeight();
  });
};

export default aboutCompany;
