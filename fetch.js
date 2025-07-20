// Initialize points (you can load from localStorage if you want persistence)
let points = 50;

const pointsSpan = document.getElementById('points');
const message = document.getElementById('message');
const claimBtn = document.getElementById('claimBtn');

function updatePointsDisplay() {
  pointsSpan.textContent = points;
}

claimBtn.addEventListener('click', () => {
  if (points >= 10) {
    points -= 10;
    updatePointsDisplay();
    message.textContent = '🎉 Reward has been sent to your email! Check for details.';
    message.style.color = 'green';
  } else {
    message.textContent = '⚠️ Not enough points to claim reward.';
    message.style.color = 'red';
  }
});

updatePointsDisplay();
