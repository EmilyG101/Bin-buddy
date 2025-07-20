// In-memory storage for demo purposes
const requests = [];

const BONUS_POINTS = 100;

const requestForm = document.getElementById('requestForm');
const requestsList = document.getElementById('requestsList');
const successMessage = document.getElementById('requestSuccess');

let currentClaimId = null; // To track which job volunteer is agreeing to

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
      <button id="claim-btn-${r.id}" onclick="openSafetyModal(${r.id})">Claim This Job</button>
    `;
    requestsList.appendChild(div);
  });
}

// Modal functions

function openSafetyModal(id) {
  currentClaimId = id;
  const modal = document.getElementById('safetyModal');
  modal.style.display = 'block';
}

function closeSafetyModal() {
  const modal = document.getElementById('safetyModal');
  modal.style.display = 'none';
  currentClaimId = null;
}

function agreeSafety() {
  if (currentClaimId === null) return;

  const request = requests.find(r => r.id === currentClaimId);
  if (!request || request.claimed) {
    alert('This request has already been claimed or does not exist.');
    closeSafetyModal();
    return;
  }

  // Instead of awarding points immediately:
  alert(
    'Verification and safety agreement sent to your email. ' +
    'Please complete the safety agreement form and submit proof after completing the job to earn points.'
  );

  // Mark request as claimed (optional, or you can wait for verification)
  request.claimed = true;

  closeSafetyModal();
  renderRequests();

  // TODO: Send verification email logic here (placeholder)
  console.log(`Send safety agreement and verification form email for request ID: ${currentClaimId}`);

  currentClaimId = null;
}

// Close modal if clicking outside the modal content
window.onclick = function(event) {
  const modal = document.getElementById('safetyModal');
  if (event.target === modal) {
    closeSafetyModal();
  }
};

// Initial render
renderRequests();

// Expose functions to global scope for inline onclick handlers
window.goHome = goHome;
window.openSafetyModal = openSafetyModal;
window.closeSafetyModal = closeSafetyModal;
window.agreeSafety = agreeSafety;
