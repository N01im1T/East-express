import { default as applyInputs } from "./inputs.js";
import { default as applyForms } from "./forms.js";

import closeIcon from "/city-template/public/assets/images/modals/close-window-btn.svg";
import userIcon from "/city-template/public/assets/images/transport/user-icon.svg";
import briefcaseIcon from "/city-template/public/assets/images/transport/briefcase-icon.svg";
import dictionary from "./modals-dictionary.json";

const modals = () => {
  // Get the value of the lang attribute
  const rawLanguage = document.documentElement.lang;
  const language = rawLanguage ? rawLanguage.toLowerCase().split("-")[0] : "";

  const selectedLanguage = dictionary[language] ? language : "en";
  const messages = dictionary[selectedLanguage];

  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalContainer = document.createElement("div");
  modal.appendChild(modalContainer);

  const header = document.createElement("h4");
  const closeButton = document.createElement("button");
  closeButton.classList.add("close-icon");
  closeButton.innerHTML = `
      <img src="${closeIcon}" alt="close-icon">
  `;

  // Choose city modal
  const cityList = document.createElement("ul");
  cityList.classList.add("city-list");
  const checkMarkIcon = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="check-mark-color" d="M20 6L9 17L4 12" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
  `;

  var citiesData = [];
  var citiesLoaded = false;

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
      const cityItem = document.createElement("li");
      const cityUrl = `https://www.${city.url}`;
      cityItem.setAttribute("data-url", cityUrl);
      cityItem.classList.add("city-item");

      const cityItemButton = document.createElement("button");
      cityItemButton.setAttribute("type", "button");
      cityItemButton.classList.add("city-item-button");

      const cityItemName = language === "ru"
      ? document.createTextNode(city.name)
      : document.createTextNode(city.name_en);
      cityItemButton.appendChild(cityItemName);

      cityItemButton.insertAdjacentHTML("beforeend", checkMarkIcon);

      cityItemButton.addEventListener("click", () => {
        if (cityItem.classList.contains("selected")) {
          cityItem.classList.remove("selected");
          selectedCity = null;
        } else {
          document.querySelectorAll("li.selected").forEach((item) => {
            item.classList.remove("selected");
          });
          cityItem.classList.add("selected");
          selectedCity = cityItem;
        }
      });

      cityItem.appendChild(cityItemButton);
      cityList.appendChild(cityItem);
    });
  }

  var selectedCity = null;

  // Order modal
  const orderFormWrapper = document.createElement("div");
  orderFormWrapper.classList.add("order-form-wrapper");

  const orderInputs = document.createElement("div");
  orderInputs.classList.add("order-inputs");

  const transportCard = document.createElement("div");
  transportCard.classList.add("transport-card");

  transportCard.innerHTML = `
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
  `;

  const form = document.createElement("form");
  form.setAttribute("action", "/submit");
  form.setAttribute("method", "post");

  const userNameInput = document.createElement("div");
  const userEmailInput = document.createElement("div");
  const userPhoneInput = document.createElement("div");
  const userMessageInput = document.createElement("div");
  const hiddenInput = document.createElement("input");

  userNameInput.classList.add("input-container");
  userEmailInput.classList.add("input-container");
  userPhoneInput.classList.add("input-container");
  userMessageInput.classList.add("input-container");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", "city");
  hiddenInput.setAttribute("value", " ");

  userNameInput.innerHTML = `
      <input type="text"  id="name" name="name" class="styled-input"
      pattern="[a-zA-Zа-яА-Я]{2,11}" placeholder=" " required>
      <label for="name" class="floating-label"
      data-original-text="${messages.name}"
      data-error-message="${messages.nameError}">
        ${messages.name}
      </label>
  `;
  userEmailInput.innerHTML = `
      <input type="email"  id="email" name="email" class="styled-input"
      placeholder=" " required>
      <label for="email" class="floating-label"
      data-original-text="${messages.email}"
      data-error-message="${messages.emailError}">
        ${messages.email}
      </label>
  `;
  userPhoneInput.innerHTML = `
      <input type="tel" id="telephone" name="telephone" class="styled-input"
      pattern="\\+?[0-9]{1,4}?[-.\\s]?(\\(?\\d{1,3}?\\)?[-.\\s]?)?[\\d-\\s]{5,10}"
      placeholder=" " required>
      <label for="telephone" class="floating-label"
      data-original-text="${messages.phone}"
      data-error-message="${messages.phoneError}">
        ${messages.phone}
      </label>
  `;
  userMessageInput.innerHTML = `
      <input type="text"  id="message" name="message" class="styled-input"
      placeholder=" ">
      <label for="message" class="floating-label">
        ${messages.message}
      </label>
  `;

  const submitButton = document.createElement("button");

  const dataProcessing = document.createElement("p");
  dataProcessing.classList.add("personal-data-processing");
  dataProcessing.innerHTML = messages.personalDataProcessing;

  function createAndShowModal(btn) {
    modal.classList.remove("fade-out");
    modalContainer.classList.value = "";
    modalContainer.classList.add("modal-container");
    modalContainer.innerHTML = "";

    cityList.innerHTML = "";

    form.innerHTML = "";
    form.classList.value = "";

    submitButton.removeAttribute("type");
    submitButton.classList.value = "";
    submitButton.classList.add("btn", "btn-primary");

    switch (btn) {
      case "btn-call-me-back":
        header.textContent = messages.callMeBack;

        form.classList.add("reply-form");

        submitButton.classList.add("btn-call-me-back");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = messages.callMeBack;

        form.append(userNameInput, userPhoneInput, hiddenInput, submitButton);
        modalContainer.append(header, closeButton, form, dataProcessing);

        break;

      case "btn-become-our-partner":
        header.textContent = messages.becomePartner;

        form.classList.add("reply-form");

        submitButton.classList.add("btn-call-me-back");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = messages.callMeBack;

        form.append(userNameInput, userPhoneInput, hiddenInput, submitButton);
        modalContainer.append(header, closeButton, form, dataProcessing);

        break;

      case "btn-get-transfer-cost":
        header.textContent = messages.transferCost;

        form.classList.add("calculator-form");

        submitButton.classList.add("btn-calculate-price");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = messages.calculateCost;

        form.append(
          userNameInput,
          userEmailInput,
          userPhoneInput,
          userMessageInput,
          hiddenInput,
          submitButton,
        );

        modalContainer.append(header, closeButton, form, dataProcessing);

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
        submitButton.setAttribute("type", "button");
        submitButton.textContent = messages.choose;
        submitButton.addEventListener("click", () => {
          if (selectedCity) {
            const url = selectedCity.getAttribute("data-url");
            window.location.href = url;
          } else {
            alert(messages.chooseCityError);
          }
        });

        modalContainer.append(header, closeButton, cityList, submitButton);

        break;

      case "btn-order":
        modalContainer.classList.add("modal-order");

        header.textContent = messages.transferCost;

        form.classList.add("calculator-form");

        submitButton.classList.add("btn-calculate-price");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = messages.calculateCost;

        orderInputs.append(
          userNameInput,
          userEmailInput,
          userPhoneInput,
          userMessageInput,
          hiddenInput,
        );

        orderFormWrapper.append(orderInputs, transportCard, submitButton);

        form.append(orderFormWrapper);

        modalContainer.append(header, closeButton, form, dataProcessing);

        break;

      case "btn-order-eef-transfer":
        header.textContent = messages.orderEefTransfer;

        form.classList.add("calculator-form");

        submitButton.classList.remove("btn-primary");
        submitButton.classList.add("btn-order-eef-transfer");
        submitButton.setAttribute("type", "submit");
        submitButton.textContent = messages.orderEef;

        form.append(
          userNameInput,
          userEmailInput,
          userPhoneInput,
          userMessageInput,
          hiddenInput,
          submitButton,
        );

        modalContainer.append(header, closeButton, form, dataProcessing);

        break;

      default:
        console.log("There isn't such button");

        break;
    }

    modal.classList.add("fade-in");
    document.body.appendChild(modal);

    applyInputs();
    applyForms();
  }

  document
    .getElementById("btn-call-me-back")
    .addEventListener("click", function () {
      createAndShowModal("btn-call-me-back");
      modal.style.display = "block";
    });

  document
    .getElementById("btn-become-our-partner")
    .addEventListener("click", function () {
      createAndShowModal("btn-become-our-partner");
      modal.style.display = "block";
    });

  document.querySelectorAll(".btn-get-transfer-cost").forEach((btn) => {
    btn.addEventListener("click", function () {
      createAndShowModal("btn-get-transfer-cost");
      modal.style.display = "block";
    });
  });
  document
    .getElementById("btn-choose-city")
    .addEventListener("click", function () {
      createAndShowModal("btn-choose-city");
      modal.style.display = "block";
    });
  document.querySelectorAll(".btn-order").forEach((btn) => {
    btn.addEventListener("click", function () {
      createAndShowModal("btn-order");
      modal.style.display = "block";

      const transportCard = this.closest(".transport-card");

      const passengerAmount =
        transportCard.querySelector(".passenger-amount").textContent;
      const luggageAmount =
        transportCard.querySelector(".luggage-amount").textContent;
      const transportImgSrc = transportCard.querySelector(".transport-img").src;
      const transportQuality =
        transportCard.querySelector(".transport-quality").textContent;
      const transportPrice = transportCard.querySelector(".price").textContent;

      modalContainer.querySelector(".passenger-amount").textContent =
        passengerAmount;
      modalContainer.querySelector(".luggage-amount").textContent =
        luggageAmount;
      modalContainer.querySelector(".transport-img").src = transportImgSrc;
      modalContainer.querySelector(".transport-quality").textContent =
        transportQuality;
      modalContainer.querySelector(".price").textContent = transportPrice;
    });
  });
  document.querySelectorAll(".btn-order-eef-transfer").forEach((btn) => {
    btn.addEventListener("click", function () {
      createAndShowModal("btn-order-eef-transfer");
      modal.style.display = "block";
    });
  });

  closeButton.addEventListener("click", () => {
    modal.classList.remove("fade-in");
    modal.classList.add("fade-out");
    modal.style.display = "none";
    setTimeout(() => {
      modal.remove();
    }, 500);
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("fade-in");
      modal.classList.add("fade-out");
      modal.style.display = "none";
      setTimeout(() => {
        modal.remove();
      }, 500);
    }
  });

  loadCities();
};

export default modals;
