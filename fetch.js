// Load points from localStorage on page load
let totalPoints = 0;

function loadPoints() {
  const saved = localStorage.getItem("trashClassifierPoints");
  if (saved) {
    totalPoints = parseInt(saved, 10);
  } else {
    totalPoints = 0;
  }
  updatePointsUI();
}

function savePoints() {
  localStorage.setItem("trashClassifierPoints", totalPoints);
}

function updatePointsUI() {
  const pointsElem = document.getElementById("pointsValue");
  if (pointsElem) {
    pointsElem.textContent = totalPoints;
  }
}

// Setup click handlers for reward boxes
function setupRewardClicks() {
  const rewardBoxes = document.querySelectorAll(".reward-box");
  rewardBoxes.forEach(box => {
    box.addEventListener("click", () => {
      const cost = parseInt(box.getAttribute("data-cost"), 10);
      if (totalPoints >= cost) {
        totalPoints -= cost;
        savePoints();
        updatePointsUI();
        alert(`Congrats! You claimed this reward.\nCheck your email for more info on your reward.`);
      } else {
        alert(`Sorry, you need at least ${cost} points to claim this reward.`);
      }
    });

    // Allow keyboard accessibility (Enter and Space keys)
    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        box.click();
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadPoints();
  setupRewardClicks();
});

