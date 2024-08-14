const steps = () => {
  function getDesktopSVGContent(stepNumber) {
    if (stepNumber === 4) {
      return `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M80 40C80 65.5 61.3248 80 39.5062 80C17.6875 80 0 62.0914 0 40C0 17.9086 17.6875 0 39.5062 0C61.3248 0 80 17.5 80 40Z" fill="#F2C94C" />
                    <text x="39" y="41" class="centered-text" dominant-baseline="middle">${stepNumber}</text>
                </svg>
            `;
    }
    return `
            <path d="M96 40C96 44.5 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0C62.0914 0 96 35.5 96 40Z" fill="#F2C94C" />
            <text x="39" y="41" class="centered-text" dominant-baseline="middle">${stepNumber}</text>
        `;
  }

  function getMobileSVGContent(stepNumber) {
    if (stepNumber === 4) {
      return `
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M80 40C80 65.5 61.3248 80 39.5062 80C17.6875 80 0 62.0914 0 40C0 17.9086 17.6875 0 39.5062 0C61.3248 0 80 17.5 80 40Z" fill="#F2C94C"/>
                    <text x="39" y="41" class="centered-text" dominant-baseline="middle">${stepNumber}</text>
                </svg>
            `;
    } else {
      return `
                <path d="M40 96C35.5 96 -2.7141e-06 62.0914 -1.74846e-06 40C-7.8281e-07 17.9086 17.9086 -2.7141e-06 40 -1.74846e-06C62.0914 -7.8281e-07 80 17.9086 80 40C80 62.0914 44.5 96 40 96Z" fill="#F2C94C"/>
                <text x="39" y="41" class="centered-text" dominant-baseline="middle">${stepNumber}</text>
            `;
    }
  }

  function updateSVGContent() {
    for (let i = 1; i <= 4; i++) {
      let svgElement = document.getElementById(`step-svg-${i}`);
      if (svgElement) {
        if (window.innerWidth <= 615) {
          if (i === 4) {
            svgElement.outerHTML = getMobileSVGContent(i);
          } else {
            svgElement.innerHTML = getMobileSVGContent(i);
            svgElement.setAttribute("width", "80");
            svgElement.setAttribute("height", "96");
            svgElement.setAttribute("viewBox", "0 0 80 96");
          }
        } else {
          svgElement.innerHTML = getDesktopSVGContent(i);
          svgElement.setAttribute("width", "96");
          svgElement.setAttribute("height", "80");
          svgElement.setAttribute("viewBox", "0 0 96 80");
        }
      }
    }
  }

  window.addEventListener("resize", updateSVGContent);
  window.addEventListener("DOMContentLoaded", updateSVGContent);
};

export default steps;
