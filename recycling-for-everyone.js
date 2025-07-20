const requests = [];
const BONUS_POINTS = 100;

const requestForm = document.getElementById('requestForm');
const requestsList = document.getElementById('requestsList');
const successMessage = document.getElementById('requestSuccess');

const safetyModal = document.getElementById('safetyModal');
const agreeBtn = document.getElementById('agreeBtn');
const cancelBtn = document.getElementById('cancelBtn');

let pendingClaimId = null;

function goHome() {
  window.location.href = 'index.html';
}

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
      <button onclick="openSafetyModal(${r.id})">Claim & Earn ${BONUS_POINTS} Bonus Points</button>
    `;
    requestsList.appendChild(div);
  });
}

function openSafetyModal(id) {
  pendingClaimId = id;
  safetyModal.hidden = false;
}

agreeBtn.addEventListener('click', () => {
  if (pendingClaimId !== null) {
    claimRequest(pendingClaimId);
    pendingClaimId = null;
  }
  safetyModal.hidden = true;
});

cancelBtn.addEventListener('click', () => {
  pendingClaimId = null;
  safetyModal.hidden = true;
});

function claimRequest(id) {
  const request = requests.find(r => r.id === id);
  if (!request || request.claimed) {
    alert('This request has already been claimed.');
    return;
  }

  request.claimed = true;
  alert(`Thank you for volunteering! A confirmation form will be sent to your email upon job completion before awarding points.`);

  renderRequests();

  // TODO: Integrate email sending and real points awarding workflow
}

renderRequests();

window.goHome = goHome;
window.openSafetyModal = openSafetyModal;
window.claimRequest = claimRequest;
