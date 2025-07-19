const URL = "./model/"; // Adjust if your model path is different
let model, webcam, labelContainer, maxPredictions;

let totalPoints = 0;
let lastDetectedClass = "";
let lastPointTime = 0;
const POINT_INTERVAL = 3000; // ms

const pointValues = {
  plastic: 5,
  aluminum: 10,
  metal: 10,
  compost: 7,
  banana: 7,
  glass: 8,
  cardboard: 6,
  box: 6
};

async function init() {
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(300, 300, true); // width, height, flip
  await webcam.setup();
  await webcam.play();
  webcam.canvas.setAttribute("playsinline", "true"); // for iOS

  document.getElementById("webcam").appendChild(webcam.canvas);

  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "";
  for (let i = 0; i < maxPredictions; i++) {
    const div = document.createElement("div");
    labelContainer.appendChild(div);
  }

  loadPoints();
  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  // Find the highest probability prediction
  let topPrediction = prediction[0];
  for (let i = 1; i < prediction.length; i++) {
    if (prediction[i].probability > topPrediction.probability) {
      topPrediction = prediction[i];
    }
  }

  // Display all predictions
  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className;
    const probability = (prediction[i].probability * 100).toFixed(1);
    labelContainer.childNodes[i].innerHTML = `${className}: ${probability}%`;
  }

  // Give points if confidence > 85%
  if (topPrediction.probability > 0.85) {
    const now = Date.now();
    const classKey = topPrediction.className.toLowerCase();

    if (classKey !== lastDetectedClass || now - lastPointTime > POINT_INTERVAL) {
      // Check which point value applies
      for (const key in pointValues) {
        if (classKey.includes(key)) {
          totalPoints += pointValues[key];
          updatePointsUI();
          savePoints();
          lastDetectedClass = classKey;
          lastPointTime = now;
          break;
        }
      }
    }
  }
}

function updatePointsUI() {
  document.getElementById("pointsValue").textContent = totalPoints;
}

function savePoints() {
  localStorage.setItem("trashClassifierPoints", totalPoints);
}

function loadPoints() {
  const saved = localStorage.getItem("trashClassifierPoints");
  if (saved) {
    totalPoints = parseInt(saved, 10);
    updatePointsUI();
  }
}

// Hamburger menu toggle
document.getElementById("hamburger").addEventListener("click", () => {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("active");
  document.getElementById("hamburger").classList.toggle("active");
});

window.addEventListener("DOMContentLoaded", init);
