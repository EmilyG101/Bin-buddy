// In-memory storage for demo purposes
const requests = [];

// Bonus points per volunteer claim (example)
const BONUS_POINTS = 100;

// Helpers to get elements
const requestForm = document.getElementById('requestForm');
const requestsList = document.getElementById('requestsList');
const successMessage = document.getElementById('requestSuccess');

// Go back to homepage
function goHome() {
  window.location.href = 'index.html';
}

// Add new request
requestForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('requesterName').value.trim();
  const address = document.getElementById('address').value.trim();
  const type = document.getElementById('recyclingType').value;
  const notes = document.getElementById('notes').value.trim();

  if (!name || !address || !type) {
    alert('Please fill all required fields.');
    return;
  }

  const id = Date.now();

  requests.push({
    id,
    name,
    address,
    type,
    notes,
    claimed: false,
  });

  requestForm.reset();
  showSuccessMessage();
  renderRequests();
});

function showSuccessMessage() {
  successMessage.hidden = false;
  setTimeout(() => {
    successMessage.hidden = true;
  }, 4000);
}

// Render requests for volunteers to claim
function renderRequests() {
  const openRequests = requests.filter(r => !r.claimed);

  if (openRequests.length === 0) {
    requestsList.innerHTML = '<p>No open requests at the moment.</p>';
    return;
  }

  requestsList.innerHTML = '';

  openRequests.forEach(r => {
    const div = document.createElement('div');
    div.className = 'request-item';
    div.innerHTML = `
      <strong>${r.name}</strong>
      <div><strong>Address:</strong> ${r.address}</div>
      <div><strong>Help Type:</strong> ${r.type}</div>
      ${r.notes ? `<div><strong>Notes:</strong> ${r.notes}</div>` : ''}
      <button onclick="claimRequest(${r.id})">Claim This Job</button>
    `;
    requestsList.appendChild(div);
  });
}

// Claim a request (volunteer action)
function claimRequest(id) {
  const request = requests.find(r => r.id === id);
  if (!request || request.claimed) {
    alert('This request has already been claimed.');
    return;
  }

  request.claimed = true;
  alert(`Thank you for volunteering! A safety agreement and verification check have been sent to your email. After completing the job, you will receive a verification form to submit for points.`);

  renderRequests();

  // TODO: Integrate email sending and real points awarding workflow
}

// Initial render
renderRequests();

// Expose functions to global so button onclick works
window.goHome = goHome;
window.claimRequest = claimRequest;
