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

    // iOS & Safari fixes for video autoplay and inline playback
    webcam.webcam.video.setAttribute('playsinline', '');
    webcam.webcam.video.setAttribute('muted', '');
    webcam.webcam.video.setAttribute('autoplay', '');
    webcam.webcam.video.muted = true;
    webcam.webcam.video.autoplay = true;
    webcam.webcam.video.playsInline = true;

    await webcam.play();

    webcam.canvas.setAttribute('playsinline', true);

    const webcamDiv = document.getElementById("webcam");
    webcamDiv.innerHTML = '';
    webcamDiv.appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = '';

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

  // Remove automatic init call to require user action
  // init();

  // Start button logic to initialize webcam & model on user click
  const startBtn = document.getElementById('start-camera-btn');

  startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    startBtn.textContent = "Loading...";
    try {
      await init();
      startBtn.style.display = 'none'; // hide button after starting
    } catch (e) {
      console.error('Error initializing webcam and model:', e);
      startBtn.disabled = false;
      startBtn.textContent = "Start Camera";
    }
  });

  // Hamburger menu code (unchanged)
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Continuous slider (unchanged)
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
