import dictionary from "./modals-dictionary.json";

const inputs = (container = document) => {
  const rawLanguage = document.documentElement.lang;
  const language = rawLanguage ? rawLanguage.toLowerCase().split("-")[0] : "";
  const selectedLanguage = dictionary[language] ? language : "en";
  const messages = dictionary[selectedLanguage];

  const fieldsMap = {
    name: {
      originalText: messages.name,
      errorMessage: messages.nameError,
    },
    email: {
      originalText: messages.email,
      errorMessage: messages.emailError,
    },
    telephone: {
      originalText: messages.phone,
      errorMessage: messages.phoneError,
    },
    message: {
      originalText: messages.message,
      errorMessage: null,
    },
  };

  container.querySelectorAll(".input-container").forEach((inputContainer) => {
    const input = inputContainer.querySelector(".styled-input");
    const label = inputContainer.querySelector(".floating-label");
    const fieldId = input.id;

    if (fieldsMap[fieldId]) {
      const { originalText, errorMessage } = fieldsMap[fieldId];

      label.setAttribute("data-original-text", originalText);
      if (errorMessage) {
        label.setAttribute("data-error-message", errorMessage);
      }

      label.textContent = originalText;

      input.addEventListener("input", () => {
        if (input.value.trim() === "") {
          label.textContent = label.getAttribute("data-original-text");
          return;
        }

        if (input.validity.valid) {
          input.classList.remove("invalid");
          label.textContent = label.getAttribute("data-original-text");
        } else {
          input.classList.add("invalid");
          label.textContent = label.getAttribute("data-error-message");
        }
      });
    }
  });

  container.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", (e) => {
      input.value = input.value.replace(/\D/g, "");
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
    });

    input.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  });
};

export default inputs;