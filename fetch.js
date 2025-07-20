// fetch.js

let totalPoints = 0;

// Load points from localStorage
function loadPoints() {
  const saved = localStorage.getItem("trashClassifierPoints");
  totalPoints = saved ? parseInt(saved, 10) : 0;
  updatePointsUI();
}

// Save points to localStorage
function savePoints() {
  localStorage.setItem("trashClassifierPoints", totalPoints);
}

// Update points on page
function updatePointsUI() {
  const pointsElem = document.getElementById("pointsValue");
  if (pointsElem) {
    pointsElem.textContent = totalPoints;
  }
}

// Handle reward claim
function claimReward(cost, rewardName) {
  if (totalPoints >= cost) {
    totalPoints -= cost;
    savePoints();
    updatePointsUI();
    alert(`🎉 Congrats! You have claimed the ${rewardName}.\nCheck your email for more info on your reward.`);
  } else {
    alert(`⚠️ Sorry, you need ${cost} points to claim the ${rewardName}.\nYou currently have ${totalPoints} points.`);
  }
}

// Add click listeners to all reward boxes
function setupRewardClicks() {
  const rewards = document.querySelectorAll(".reward-box");
  rewards.forEach((reward) => {
    reward.addEventListener("click", () => {
      const cost = parseInt(reward.getAttribute("data-cost"), 10);
      const rewardName = reward.querySelector("p").textContent;
      claimReward(cost, rewardName);
    });
    // Keyboard accessibility (Enter or Space)
    reward.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reward.click();
      }
    });
  });
}

// Initialize page
window.addEventListener("DOMContentLoaded", () => {
  loadPoints();
  setupRewardClicks();
});
