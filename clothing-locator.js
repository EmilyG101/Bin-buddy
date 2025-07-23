const form = document.getElementById('location-form');
const mapDiv = document.getElementById('map');

let map = L.map('map').setView([40.7128, -74.0060], 12); // Default: NYC
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

const locations = [
  {
    name: 'Salvation Army - Manhattan',
    lat: 40.73061,
    lon: -73.935242,
  },
  {
    name: 'Goodwill NY - Brooklyn',
    lat: 40.6782,
    lon: -73.9442,
  },
  {
    name: 'Local Church Donation Center',
    lat: 40.758896,
    lon: -73.98513,
  },
];

locations.forEach(loc => {
  L.marker([loc.lat, loc.lon]).addTo(map).bindPopup(loc.name);
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const address = document.getElementById('address').value;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await res.json();

  if (data && data.length > 0) {
    const { lat, lon } = data[0];
    map.setView([lat, lon], 13);
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup('Your Location')
      .openPopup();
  } else {
    alert('Location not found. Try a different address.');
  }
});
