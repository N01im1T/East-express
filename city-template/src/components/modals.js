import { default as applyInputs } from "./inputs.js";
import { default as applyForms } from "./forms.js";

import closeIcon from "/city-template/public/assets/images/modals/close-window-btn.svg";
import userIcon from "/city-template/public/assets/images/transport/user-icon.svg";
import briefcaseIcon from "/city-template/public/assets/images/transport/briefcase-icon.svg";
import dictionary from "./modals-dictionary.json";

const modals = () => {
  const createElement = (tag, classNames = [], innerHTML = "") => {
    const element = document.createElement(tag);
    classNames.forEach((className) => element.classList.add(className));
    element.innerHTML = innerHTML;
    return element;
  };

  const createInputContainer = (
    id,
    type,
    name,
    pattern,
    originalText,
    errorMessage,
    labelContent,
  ) => {
    const inputContainer = createElement("div", ["input-container"]);
    inputContainer.innerHTML = `
      <input type="${type}" id="${id}" name="${name}" class="styled-input" 
        pattern="${pattern}" placeholder=" " required>
      <label for="${id}" class="floating-label" 
        data-original-text="${originalText}" 
        data-error-message="${errorMessage}">
        ${labelContent}
      </label>
    `;
    return inputContainer;
  };

  // Get the value of the lang attribute
  const rawLanguage = document.documentElement.lang;
  const language = rawLanguage ? rawLanguage.toLowerCase().split("-")[0] : "";

  const selectedLanguage = dictionary[language] ? language : "en";
  const messages = dictionary[selectedLanguage];

  const modal = createElement("div", ["modal"]);
  const modalContainer = createElement("div");
  modal.appendChild(modalContainer);

  const header = createElement("h4");
  const closeButton = createElement(
    "button",
    ["close-icon"],
    `<img src="${closeIcon}" alt="close-icon">`,
  );

  // Choose city modal
  const cityList = document.createElement("ul");
  cityList.classList.add("city-list");
  const checkMarkIcon = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="check-mark-color" d="M20 6L9 17L4 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
  `;

  let citiesData = [];
  let citiesLoaded = false;
  let selectedCity = null;

  async function loadCities() {
    try {
      const response = await fetch(
        "https://avto2a.ru/wp-admin/admin-ajax.php?action=get_cities",
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      citiesData = await response.json();
      citiesLoaded = true;
    } catch (error) {
      console.error("Fetching cities failed:", error);
    }
  }

  function displayCities() {
    cityList.innerHTML = "";

    citiesData.forEach((city) => {
      const cityItem = createElement("li", ["city-item"]);
      cityItem.dataset.url = `https://www.${city.url}`;

      const cityItemButton = createElement(
        "button",
        ["city-item-button"],
        (language === "ru" ? city.name : city.name_en) + checkMarkIcon,
      );
      cityItemButton.type = "button";

      cityItemButton.addEventListener("click", () => {
        document
          .querySelectorAll("li.selected")
          .forEach((item) => item.classList.remove("selected"));
        cityItem.classList.add("selected");
        selectedCity = cityItem;
      });

      cityItem.appendChild(cityItemButton);
      cityList.appendChild(cityItem);
    });
  }

  function createFormContent(btn) {
    modalContainer.className = "modal-container";
    modalContainer.innerHTML = "";
    cityList.innerHTML = "";

    const hiddenInput = createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "city";
    hiddenInput.value = " ";

    const form = createElement("form");
    form.action = "/submit";
    form.method = "post";

    const userNameInput = createInputContainer(
      "name",
      "text",
      "name",
      "[a-zA-Zа-яА-Я]{2,11}",
      messages.name,
      messages.nameError,
      messages.name,
    );
    const userPhoneInput = createInputContainer(
      "telephone",
      "tel",
      "telephone",
      "\\+?[0-9]{1,4}?[-.\\s]?(\\(?\\d{1,3}?\\)?[-.\\s]?)?[\\d-\\s]{5,10}",
      messages.phone,
      messages.phoneError,
      messages.phone,
    );
    const userEmailInput = createInputContainer(
      "email",
      "email",
      "email",
      "",
      messages.email,
      messages.emailError,
      messages.email,
    );
    const userMessageInput = createInputContainer(
      "message",
      "text",
      "message",
      "",
      "",
      "",
      messages.message,
    );

    const submitButton = createElement("button", ["btn", "btn-primary"]);
    const dataProcessing = createElement(
      "p",
      ["personal-data-processing"],
      messages.personalDataProcessing,
    );

    switch (btn) {
      case "btn-call-me-back":
        header.textContent = messages.callMeBack;

        submitButton.textContent = messages.callMeBack;
        submitButton.classList.add("btn-call-me-back");
        submitButton.type = "submit";

        form.classList.add("reply-form");
        form.append(userNameInput, userPhoneInput, hiddenInput, submitButton);

        break;

      case "btn-become-our-partner":
        header.textContent = messages.becomePartner;

        submitButton.textContent = messages.callMeBack;
        submitButton.classList.add("btn-call-me-back");
        submitButton.type = "submit";

        form.classList.add("reply-form");
        form.append(userNameInput, userPhoneInput, hiddenInput, submitButton);

        break;

      case "btn-get-transfer-cost":
        header.textContent = messages.transferCost;

        submitButton.classList.add("btn-calculate-price");
        submitButton.textContent = messages.calculateCost;
        submitButton.type = "submit";

        form.classList.add("reply-form");
        form.append(
          userNameInput,
          userEmailInput,
          userPhoneInput,
          userMessageInput,
          hiddenInput,
          submitButton,
        );

        break;

      case "btn-choose-city":
        modalContainer.classList.add("choose-city-modal");

        header.textContent = messages.chooseCity;

        if (citiesLoaded) {
          displayCities();
        } else {
          cityList.innerHTML = "<p>Загрузка городов...</p>";
        }

        submitButton.classList.add("btn-choose-city");
        submitButton.type = "button";
        submitButton.textContent = messages.choose;
        submitButton.addEventListener("click", () => {
          if (selectedCity) {
            window.location.href = selectedCity.dataset.url;
          } else {
            alert(messages.chooseCityError);
          }
        });

        break;

      case "btn-order":
        modalContainer.classList.add("modal-order");

        header.textContent = messages.transferCost;

        const orderFormWrapper = createElement("div", ["order-form-wrapper"]);
        const orderInputs = createElement("div", ["order-inputs"]);
        const transportCard = createElement(
          "div",
          ["transport-card"],
          `
          <div class="transport-card-goods">
            <div class="transport-card-goods-passenger">
              <img src="${userIcon}" alt="passenger-icon" />
              <span class="passenger-amount"></span>
            </div>
            <div class="transport-card-goods-luggage">
              <img src="${briefcaseIcon}" alt="luggage-icon" />
              <span class="luggage-amount"></span>
            </div>
          </div>
          <img class="transport-img" src="../assets/images/transport/toyota corolla.png" alt="transport-img" />
          <span class="transport-quality">Стандарт</span>
          <p class="transport-price">
            <span>от</span>
            <span class="price">13000</span>
            <span class="currency">₽</span>
          </p>
        `,
        );
        orderInputs.append(
          userNameInput,
          userEmailInput,
          userPhoneInput,
          userMessageInput,
          hiddenInput,
        );
        orderFormWrapper.append(orderInputs, transportCard, submitButton);

        submitButton.classList.add("btn-calculate-price");
        submitButton.type = "submit";
        submitButton.textContent = messages.calculateCost;

        form.classList.add("calculator-form");
        form.append(orderFormWrapper);

        break;

      case "btn-order-eef-transfer":
        header.textContent = messages.orderEefTransfer;

        form.classList.add("calculator-form");

        submitButton.classList.remove("btn-primary");
        submitButton.classList.add("btn-order-eef-transfer");
        submitButton.type = "submit";
        submitButton.textContent = messages.orderEef;

        form.append(
          userNameInput,
          userEmailInput,
          userPhoneInput,
          userMessageInput,
          hiddenInput,
          submitButton,
        );

        break;

      default:
        console.log("There isn't such button");
        break;
    }

    btn === "btn-choose-city"
      ? modalContainer.append(header, closeButton, cityList, submitButton)
      : modalContainer.append(header, closeButton, form, dataProcessing);
  }

  function createAndShowModal(btn) {
    modal.classList.remove("fade-out");
    createFormContent(btn);
    modal.classList.add("fade-in");
    document.body.appendChild(modal);
    modal.style.display = "block";
    applyInputs();
    applyForms();
  }

  // Event Listeners
  document
    .getElementById("btn-call-me-back")
    .addEventListener("click", () => createAndShowModal("btn-call-me-back"));
  document
    .getElementById("btn-become-our-partner")
    .addEventListener("click", () =>
      createAndShowModal("btn-become-our-partner"),
    );

  document
    .querySelectorAll(".btn-get-transfer-cost")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        createAndShowModal("btn-get-transfer-cost"),
      ),
    );

  document
    .getElementById("btn-choose-city")
    .addEventListener("click", () => createAndShowModal("btn-choose-city"));

  document.querySelectorAll(".btn-order").forEach((btn) => {
    btn.addEventListener("click", function () {
      createAndShowModal("btn-order");

      const transportCard = this.closest(".transport-card");
      modalContainer.querySelector(".passenger-amount").textContent =
        transportCard.querySelector(".passenger-amount").textContent;
      modalContainer.querySelector(".luggage-amount").textContent =
        transportCard.querySelector(".luggage-amount").textContent;
      modalContainer.querySelector(".transport-img").src =
        transportCard.querySelector(".transport-img").src;
      modalContainer.querySelector(".transport-quality").textContent =
        transportCard.querySelector(".transport-quality").textContent;
      modalContainer.querySelector(".price").textContent =
        transportCard.querySelector(".price").textContent;
    });
  });

  document.querySelectorAll(".btn-order-eef-transfer").forEach((btn) => {
    btn.addEventListener("click", function () {
      createAndShowModal("btn-order-eef-transfer");
    });
  });

  closeButton.addEventListener("click", () => {
    modal.classList.remove("fade-in");
    modal.classList.add("fade-out");
    modal.style.display = "none";
    setTimeout(() => modal.remove(), 600);
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("fade-in");
      modal.classList.add("fade-out");
      modal.style.display = "none";
      setTimeout(() => modal.remove(), 600);
    }
  });

  loadCities();
};

export default modals;
