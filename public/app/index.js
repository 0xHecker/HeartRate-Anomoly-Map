let locArray = [];

var map = L.map("map").setView([13.54, 78.51], 10);
L.tileLayer(
  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=1lWDMjxuHkrYSuSmRDB5",
  {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  }
).addTo(map);

var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [32, 32],
    popupAnchor: [0, -3],
  },
});

const redIcon = new LeafIcon({
  iconUrl:
    "https://cdn0.iconfinder.com/data/icons/security-double-color-red-and-black-vol-1/52/alarm__alert__light__emergency-512.png",
});

const yellowIcon = new LeafIcon({
  iconUrl: "/img/yellow40.png",
});
const greenIcon = new LeafIcon({
  iconUrl: "/img/green.png",
});

async function getData() {
  const res = await fetch("/api/v1/getdata");
  const obj = await res.json();
  const len = obj.data.length;
  for (let i = 0; i < len; i++) {
    const data = obj.data[i];
    const latitude = data.location.coordinates[0];
    const longitude = data.location.coordinates[1];
    const status = data.helpStatus;
    const deviceId = data.deviceId;
    const BPM = data.BPM;
    const dataId = data._id;
    locArray.push({
      lat: latitude,
      lng: longitude,
      status: status,
      deviceId: deviceId,
      dataId: dataId,
      BPM: BPM,
    });

    if (status == "unresolved") {
      icon = redIcon;
    }
    if (status == "helpfound") {
      icon = yellowIcon;
    }
    if (status == "resolved") {
      icon = greenIcon;
    }

    var marker = L.marker([latitude, longitude], { icon: icon }).addTo(map);
    L.popup();

    marker.bindPopup(`<b>Device Id: </b>${deviceId}<br>
    <b>dataId: </b> <a href='api/v1/update/${dataId}/helpfound' target="_blank">${dataId}</a> <br>
    <b>BPM: </b>${BPM}<br>
    <b>lat: </b> ${latitude}<br>
    <b>lng: </b> ${longitude}<br>
    <b><a href="https://www.google.com/maps/place/${latitude},${longitude}" target="_blank">View on Maps</a></b><br>
    <b>Status: </b>${status}`);
  }
}

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You are pointing at " + e.latlng.toString())
    .openOn(map);
}

// locArray.map(()=>{
//
// })

getData();

let interval = setInterval(getData, 2 * 60 * 1000);

map.on("click", onMapClick);
