const header = () => {
  const topBar = document.querySelector(".top-bar");
  const burgerBtn = document.querySelector(".mobile-burger-btn");
  const closeBtn = document.querySelector(".mobile-btn-close-top-bar");
  const callMeBackBtn = document.getElementById("btn-call-me-back");

  const mobileBarOverlay = document.createElement("div");
  mobileBarOverlay.classList.add("mobile-bar-overlay");

  function handleResize() {
    if (window.innerWidth > 1250) {
      topBar.classList.remove("mobile-bar");
      topBar.classList.remove("active");
      topBar.classList.remove("deactive");
      callMeBackBtn.classList.remove("black");
      mobileBarOverlay.remove();
      burgerBtn.style.display = "none";
    } else if (topBar.classList.contains("active")) {
      burgerBtn.style.display = "none";
    } else {
      burgerBtn.style.display = "block";
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize();

  burgerBtn.addEventListener("click", function () {
    topBar.classList.add("mobile-bar");
    topBar.classList.remove("deactive");
    topBar.classList.add("active");
    callMeBackBtn.classList.add("black");
    document.body.appendChild(mobileBarOverlay);
    burgerBtn.style.display = "none";
  });

  closeBtn.addEventListener("click", function () {
    topBar.classList.remove("active");
    topBar.classList.add("deactive");
    callMeBackBtn.classList.remove("black");
    burgerBtn.style.display = "block";
    topBar.classList.remove("mobile-bar");
    mobileBarOverlay.remove();
  });

  mobileBarOverlay.addEventListener("click", function () {
    topBar.classList.remove("active");
    topBar.classList.add("deactive");
    callMeBackBtn.classList.remove("black");
    burgerBtn.style.display = "block";
    topBar.classList.remove("mobile-bar");
    mobileBarOverlay.remove();
  });
};

export default header;
