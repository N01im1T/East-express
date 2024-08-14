const buttons = () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const ruBtn = document.getElementById("ru");
  const enBtn = document.getElementById("en");

  // Check site language
  document.addEventListener("DOMContentLoaded", function () {
    const enSelected = enBtn.getAttribute("aria-selected") === "true";
    if (enSelected) {
      document.querySelector(".indicator").style.transform = "translateX(0)";
    }
  });

  function switchLanguage(language) {
    if (language === "ru") {
      window.location.href = "/city-template/public/ru/index.html";
    } else if (language === "en") {
      window.location.href = "/city-template/public/en/index.html";
    }
  }

  if (toggleBtn && ruBtn && enBtn) {
    toggleBtn.addEventListener("click", function () {
      const ruSelected = ruBtn.getAttribute("aria-selected") === "true";

      if (ruSelected) {
        ruBtn.setAttribute("aria-selected", "false");
        enBtn.setAttribute("aria-selected", "true");
        document.querySelector(".indicator").style.transform = "translateX(0)";
        switchLanguage("en");
      } else {
        ruBtn.setAttribute("aria-selected", "true");
        enBtn.setAttribute("aria-selected", "false");
        document.querySelector(".indicator").style.transform =
          "translateX(100%)";
        switchLanguage("ru");
      }
    });
  }
};

export default buttons;
