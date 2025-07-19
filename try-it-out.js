const URL = "./model/";
let model, webcam, labelContainer, maxPredictions;

let totalPoints = 0;
let lastDetectedClass = "";
let lastPointTime = 0;
const POINT_INTERVAL = 3000;

const testClasses = {
  phone: 5,
  pants: 5,
  // add other classes and points here as you want
};

async function init() {
  model = await tmImage.load(URL + "model.json", URL + "metadata.json");
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();
  webcam.canvas.setAttribute("playsinline", "true");

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

  let topPrediction = prediction[0];
  for (let i = 1; i < prediction.length; i++) {
    if (prediction[i].probability > topPrediction.probability) {
      topPrediction = prediction[i];
    }
  }

  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className;
    const probability = (prediction[i].probability * 100).toFixed(1);
    labelContainer.childNodes[i].innerHTML = `${className}: ${probability}%`;
  }

  const classKey = topPrediction.className.toLowerCase().trim();

  if (topPrediction.probability > 0.85) {
    const now = Date.now();

    if (classKey !== lastDetectedClass || now - lastPointTime > POINT_INTERVAL) {
      if (testClasses[classKey] !== undefined) {
        totalPoints += testClasses[classKey];
        updatePointsUI();
        savePoints();
        lastDetectedClass = classKey;
        lastPointTime = now;
        console.log(`Added points for ${classKey}. Total: ${totalPoints}`);
      }
    }
  }
}

function updatePointsUI() {
  const pointsElem = document.getElementById("pointsValue");
  if (pointsElem) {
    pointsElem.textContent = totalPoints;
  }
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

window.addEventListener("DOMContentLoaded", init);
