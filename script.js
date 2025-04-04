let map;
let infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 13,
  });

  const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSDBnuPCm8-RPry7XYdaij_cBOLKpHwm1E2G9XlR_kJsEmUlDAd9OJ9J0zn1_n_S8genHHqixASncI3/pub?gid=0&single=true&output=csv';

  fetch(sheetUrl)
    .then(response => response.text())
    .then(csvText => {
      const parsed = Papa.parse(csvText, { header: true });
      const rows = parsed.data;

      infoWindow = new google.maps.InfoWindow();

      rows.forEach(row => {
        const name = row['Name'];
        const lat = parseFloat(row['Latitude']);
        const lng = parseFloat(row['Longitude']);
        const address = row['Address'];
        const phone = row['Phone'];
        const link = row['Link'];
        const menuLink = row['Menu Link'];

        if (isNaN(lat) || isNaN(lng)) return;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: name,
        });

        const popupContent = `
          <div style="max-width: 250px; font-family: 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.4; margin: 0;">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; padding: 0;">${name}</h3>
            ${address ? `<p style="margin: 0 0 6px 0;"><strong>Address:</strong> ${address.replace(/"/g, '')}</p>` : ''}
            ${phone ? `<p style="margin: 0 0 6px 0;"><a href="tel:${phone.replace(/[^0-9]/g, '')}">${phone}</a></p>` : ''}
            ${menuLink ? `<p style="margin: 0 0 6px 0;"><a href="${menuLink}" target="_blank">📋 View Menu</a></p>` : ''}
            ${link ? `<p style="margin: 0;"><a href="${link}" target="_blank">${link}</a></p>` : ''}
          </div>
        `;

        marker.addListener("click", () => {
          infoWindow.setContent(popupContent);
          infoWindow.open(map, marker);

          // ✅ Attach the close button override *after popup opens*
          google.maps.event.addListenerOnce(infoWindow, "domready", () => {
            const closeBtn = document.querySelector(".gm-ui-hover-effect");
            if (closeBtn) {
              closeBtn.innerHTML = "✖";
              closeBtn.onclick = () => infoWindow.close();

              Object.assign(closeBtn.style, {
                pointerEvents: "auto",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: "1",
                fontWeight: "bold",
                color: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fbeeca",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
              });
            }
          });
        });
      });
    })
    .catch(error => {
      console.error("Error loading spots:", error);
    });
}
