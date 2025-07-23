function findLocations() {
  const address = document.getElementById('address-input').value;
  const resultsDiv = document.getElementById('results');

  if (!address) {
    resultsDiv.innerHTML = "<p>Please enter a location.</p>";
    return;
  }

  const query = encodeURIComponent(`clothing donation near ${address}`);
  const mapsURL = `https://www.google.com/maps/search/${query}`;

  resultsDiv.innerHTML = `
    <p>Click below to view donation centers near <strong>${address}</strong>:</p>
    <a href="${mapsURL}" target="_blank">${mapsURL}</a>
  `;
}
