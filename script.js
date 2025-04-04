let map;
let infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 13,
  });

  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSDBnuPCm8-RPry7XYdaij_cBOLKpHwm1E2G9XlR_kJsEmUlDAd9OJ9J0zn1_n_S8genHHqixASncI3/pub?gid=0&single=true&output=csv";

  fetch(sheetUrl)
    .then((response) => response.text())
    .then((csvText) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          infoWindow = new google.maps.InfoWindow();

          results.data.forEach((row) => {
            const name = row["Name"];
            const address = row["Address"];
            const phone = row["Phone"];
            const lat = parseFloat(row["Latitude"]);
            const lng = parseFloat(row["Longitude"]);
            const review = row["Review"];
            const link = row["Link"];
            const menu = row["Menu"];

            if (isNaN(lat) || isNaN(lng)) return;

            const marker = new google.maps.Marker({
              position: { lat, lng },
              map: map,
              title: name,
            });

            const popupContent = `
              <div style="max-width: 250px;">
                <h3>${name}</h3>
                ${address ? `<p><strong>Address:</strong> ${address}</p>` : ""}
                ${phone ? `<p><a href="tel:${phone.replace(/[^0-9]/g, '')}">${phone}</a></p>` : ""}
                ${menu ? `<p><a href="${menu}" target="_blank">📋 View Menu</a></p>` : ""}
                ${link ? `<p><a href="${link}" target="_blank">${link}</a></p>` : ""}
              </div>
            `;

            marker.addListener("click", () => {
              infoWindow.setContent(popupContent);
              infoWindow.open(map, marker);

              google.maps.event.addListenerOnce(infoWindow, "domready", () => {
                const closeBtn = document.querySelector(".gm-ui-hover-effect");
                if (closeBtn) {
                  closeBtn.innerHTML = "✖";
                  closeBtn.onclick = () => infoWindow.close();
                  Object.assign(closeBtn.style, {
                    pointerEvents: "auto",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#333",
                    background: "#fbeeca",
                    borderRadius: "6px",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  });
                }
              });
            });
          });
        },
      });
    })
    .catch((error) => {
      console.error("Error loading map data:", error);
    });
}
