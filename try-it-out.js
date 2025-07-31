const URL = "./model/";
let model, webcam, labelContainer, maxPredictions;

let totalPoints = 0;
const POINT_INTERVAL = 2000;
let lastDetectedClass = null;
let lastPointTime = 0;

const testClasses = {
  "glass and plastic bottles": 5,
  "paper": 5,
  "compost": 10,
  "trash": 1,
  "hazardous waste": 15,
  "special waste": 10
};

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(400, 400, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  loadPoints();
  updatePointsUI();
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

    const labelDiv = labelContainer.childNodes[i];
    labelDiv.innerHTML = `${className}: ${probability}%`;

    // Remove old message if it exists
    const oldMsg = labelDiv.querySelector(".confidence-msg");
    if (oldMsg) oldMsg.remove();

    // Add message if prediction is high-confidence
    if (probability >= 90) {
      const msg = document.createElement("span");
      msg.className = "confidence-msg";
      msg.textContent = `This object is ${className}`;
      labelDiv.appendChild(msg);
    }
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
  const pointsElement = document.getElementById("points");
  if (pointsElement) {
    pointsElement.textContent = totalPoints;
  }
}

function savePoints() {
  localStorage.setItem("totalPoints", totalPoints.toString());
}

function loadPoints() {
  const savedPoints = localStorage.getItem("totalPoints");
  if (savedPoints !== null) {
    totalPoints = parseInt(savedPoints, 10);
  }
}

init();
