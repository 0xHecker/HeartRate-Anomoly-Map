let locArray = [];

var dangerIcon = new H.map.Icon(
  "https://cdn0.iconfinder.com/data/icons/security-double-color-red-and-black-vol-1/52/alarm__alert__light__emergency-512.png",
  { size: { w: 40, h: 40 } }
);

var safe = new H.map.Icon("./img/green.png", {
  size: { w: 40, h: 40 },
});

var warningIcon = new H.map.Icon("./img/yellow40.png", {
  size: { w: 40, h: 40 },
});

var marker1 = new H.map.Marker(
  {
    lat: 13.3100139,
    lng: 78.4983098,
  },
  { icon: dangerIcon }
);

var marker2 = new H.map.Marker(
  {
    lat: 13.5100139,
    lng: 78.4983098,
  },
  { icon: warningIcon }
);
var marker3 = new H.map.Marker(
  {
    lat: 13.5200139,
    lng: 78.4983098,
  },
  { icon: safe }
);

var markers = [marker1, marker2, marker3];

function addMarker(latitude, longitude, icon) {
  var marker = new H.map.Marker(
    { lat: latitude, lng: longitude },
    { icon: icon }
  );
  markers.push(marker);
  console.log(markers);
}

addMarker(13.5100139, 78.183098, dangerIcon);

async function getData() {
  const res = await fetch("/api/v1/getdata");
  const obj = await res.json();
  const len = obj.data.length;

  for (let i = 0; i < len; i++) {
    const data = obj.data[i];
    const latitude = data.location.coordinates[0];
    const longitude = data.location.coordinates[1];
    const status = data.helpStatus;
    locArray.push({
      lat: latitude,
      lng: longitude,
      status: status,
    });
  }
  console.log(locArray);
}

async function addMarkersToMap() {
  await getData();
  init();
  await map.addObjects(markers);
  // map.addObject(marker1);
}

// Initialize the platform object:
const platform = new H.service.Platform({
  app_id: "DemoAppId01082013GAL",
  app_code: "AJKnXv84fjrb0KIHawS0Tg",
  useCIT: true,
  useHTTPS: true,
});

const maptypes = platform.createDefaultLayers();

// Instantiate (and display) a map object:
this.map = new H.Map(
  document.querySelector("#mapContainer"),
  maptypes.normal.map,
  {
    zoom: 8,
    center: {
      lat: 13, //13.564858, 79.353839
      lng: 79,
    },
  }
);

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

// Create the default UI components
var ui = H.ui.UI.createDefault(this.map, maptypes, "pt-BR");

function init() {
  console.log("init");
  for (let i = 0; i < locArray.length; i++) {
    let loc = locArray[i];
    let icon;
    if (loc.status == "unresolved") {
      icon = dangerIcon;
    }
    if (loc.status == "helpfound") {
      icon = warningIcon;
    }
    if (loc.status == "resolved") {
      icon = safe;
    }
    addMarker(locArray[i].lat, locArray[i].lng, icon);
  }
}
let interval = setInterval(getData, 5 * 60 * 1000);

// Now use the map as required...
addMarkersToMap();
