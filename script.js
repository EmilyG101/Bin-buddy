// Wait for DOM to load
window.addEventListener("DOMContentLoaded", () => {
  // --- Teachable Machine setup ---
  const URL = "./model/";
  let model, webcam, labelContainer, maxPredictions;

  async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; // mirror webcam
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();

    // Replace #webcam div with webcam canvas
    const webcamDiv = document.getElementById("webcam");
    webcamDiv.replaceWith(webcam.canvas);

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

  // Initialize Teachable Machine
  init();

  // --- Hamburger menu toggle ---
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    // Animate hamburger bars (optional)
    hamburger.classList.toggle("active");
  });

  // --- Continuous left-moving slider ---
  const slider = document.querySelector(".slider");
  let sliderWidth = slider.scrollWidth;
  let containerWidth = slider.parentElement.offsetWidth;
  let currentX = 0;

  function moveSlider() {
    currentX -= 0.5; // adjust speed here (smaller = slower)
    if (Math.abs(currentX) >= sliderWidth) {
      currentX = containerWidth;
    }
    slider.style.transform = `translateX(${currentX}px)`;
    requestAnimationFrame(moveSlider);
  }

  moveSlider();
});
