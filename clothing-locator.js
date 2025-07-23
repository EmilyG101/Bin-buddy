function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
  });

  const geocoder = new google.maps.Geocoder();

  document.getElementById("location-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const address = document.getElementById("address").value;
    geocodeAddress(geocoder, map, address);
  });
}

function geocodeAddress(geocoder, map, address) {
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === "OK") {
      map.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
