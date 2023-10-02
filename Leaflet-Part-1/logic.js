const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getColor(d) {
  return d > 90  ? '#FF0000' :
         d > 70  ? '#FF6600' :
         d > 50  ? '#FFCC00' :
         d > 30  ? '#FFFF00' :
         d > 10  ? '#CCFF00' :
         d > 0  ? '#66FF00' :
                  '#00FF00';
}

function createMarkers(data) {
  let locations = data.features;
  let quakeMarkers = [];

  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];
    let quakeMarker = L.circle(
      [location.geometry.coordinates[1], location.geometry.coordinates[0]],
      {
        color: "#000000",
        fillColor: getColor(location.geometry.coordinates[2]),
        fillOpacity: 0.5,
        radius: location.properties.mag * 10000,
        weight: .5,
      }
    ).bindPopup(`<b>location</b>: ${location.properties.place}<br>
                 <b>magnitude</b>: ${location.properties.mag}<br>
                 <b>depth</b>: ${location.geometry.coordinates[2]}`);
    quakeMarkers.push(quakeMarker);
  }

  createMap(L.layerGroup(quakeMarkers));
}

function createMap(quakeLocations) {
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let baseMaps = {
    "Street Map": streetmap
  };

  let overlayMaps = {
    "Earthquake Locations": quakeLocations
  };

  let map = L.map("map", {
    center: [39.0, 34.0], 
    zoom: 3, 
    layers: [streetmap, quakeLocations]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  let info = L.control({position: "bottomRight"});
  info.onAdd = function(map) {
    let div = L.DomUtil.create("div", "legend");
    
    return div;
  }
  info.addTo(map);  

}

function updateLegend() {
  let legend = document.querySelector("#legend");
  if (!legend) {
    console.error("Legend element not found");
    return;
  }
  legend.innerHTML = "<p>i give up</p>";
}

d3.json(url).then(function(data) {
  createMarkers(data);
  updateLegend();
  
});
