window.addEventListener("DOMContentLoaded", () => {
  const URL = "./model/";
  let model, webcam, labelContainer, maxPredictions;

  const webcamDiv = document.getElementById("webcam");
  labelContainer = document.getElementById("label-container");

  // Start immediately
  init();

  async function init() {
    try {
      // Load the Teachable Machine model
      model = await tmImage.load(URL + "model.json", URL + "metadata.json");
      maxPredictions = model.getTotalClasses();

      // Setup the webcam
      webcam = new tmImage.Webcam(300, 300, true); // width, height, flip
      await webcam.setup(); // request access to webcam
      await webcam.play();
      webcam.canvas.setAttribute("playsinline", "true"); // for iOS Safari

      // Add webcam canvas to page
      webcamDiv.innerHTML = "";
      webcamDiv.appendChild(webcam.canvas);

      // Add empty label divs
      labelContainer.innerHTML = "";
      for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        div.style.margin = "0.3rem 0";
        labelContainer.appendChild(div);
      }

      // Start prediction loop
      window.requestAnimationFrame(loop);
    } catch (error) {
      console.error("Error starting camera or model:", error);
      alert("Failed to start camera or load model. Check console.");
    }
  }

  async function loop() {
    webcam.update(); // update webcam frame
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
