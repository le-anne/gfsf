let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 }, // Centered on San Francisco
    zoom: 13,
  });

  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSDBnuPCm8-RPry7XYdaij_cBOLKpHwm1E2G9XlR_kJsEmUlDAd9OJ9J0zn1_n_S8genHHqixASncI3/pub?output=csv';

  fetch(sheetUrl)
    .then(response => response.text())
    .then(csv => {
      const rows = csv.split('\n').slice(1); // Skip header row

      rows.forEach(row => {
        const columns = row.split(',');

        if (columns.length < 7) return; // Make sure it's a full row

        const name = columns[0];
        const type = columns[1];
        const vibes = columns[2];
        const lat = parseFloat(columns[3]);
        const lng = parseFloat(columns[4]);
        const review = columns[5];
        const link = columns[6];

        if (isNaN(lat) || isNaN(lng)) return;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px;">
              <h3 style="margin-bottom: 0.2rem;">${name}</h3>
              <p style="margin: 0.3rem 0;"><strong>${type}</strong></p>
              <p style="font-size: 0.9rem;">${review}</p>
              <p><a href="${link}" target="_blank" rel="noopener">More info</a></p>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    })
    .catch(error => {
      console.error("Error loading GF spots:", error);
    });
}
