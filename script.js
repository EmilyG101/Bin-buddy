// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
  const URL = "./model/";
  let model, webcam, labelContainer, maxPredictions;

  async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    webcam.canvas.setAttribute('playsinline', true);

    const webcamDiv = document.getElementById("webcam");
    webcamDiv.replaceWith(webcam.canvas);
    webcamDiv.innerHTML = '';
    webcamDiv.appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    window.requestAnimationFrame(loop);
  }

  async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
  }

  async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      const className = prediction[i].className;
      const probability = (prediction[i].probability * 100).toFixed(1);
      labelContainer.childNodes[i].innerHTML = `${className}: ${probability}%`;
    }
  }

  init();

  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Continuous slider
  const slider = document.querySelector(".slider");
  let sliderWidth = slider.scrollWidth;
  let containerWidth = slider.parentElement.offsetWidth;
  let currentX = 0;

  function moveSlider() {
    currentX -= 0.5;
    if (Math.abs(currentX) >= sliderWidth) {
      currentX = containerWidth;
    }
    slider.style.transform = `translateX(${currentX}px)`;
    requestAnimationFrame(moveSlider);
  }

  moveSlider();
});
