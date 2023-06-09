
const tectonicLines = d3.json("static/js/PB2002_boundaries.json");

function createMap(x) {

  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var baseMaps = {
    Street: street,
    Topography: topo
  };

  var overlayMaps = {
    Earthquakes: x,
  };

  var myMap = L.map("map", {
    center: [20, -100],
    zoom: 3,
    layers: [street, x]
    });

  const legend = L.control({ position:'bottomleft'});

  legend.onAdd = function (myMap) {
    const div = L.DomUtil.create("div", "info legend");
  
    const labels = [">30 km Below Surface", "20-30 km Below Surface", "10-20 km Below Surface", "0-10 km Below Surface", "Above Sea Level"];
    const colors = ["rgb(0, 0, 128)", "rgb(30, 144, 255)", "rgb(70, 130, 180)", "rgb(135, 206, 250)", "Orange"];
    div.innerHTML += "<h4>Legend</h4>";
    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += `<i style="background: ${colors[i]}"></i><span>${labels[i]}</span><br>`;
    }
    return div;
  };
  legend.addTo(myMap);
  
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

function createMarkers(y) {
  quakes = y.features;
  var quakeMarkers = [];

  for (let i = 0; i < quakes.length; i++) {

    if (quakes[i].geometry.coordinates[2] >= 30) {
        var depthcol =  "rgb(0, 0, 128)"; 
      } else if (quakes[i].geometry.coordinates[2] >= 20) {
        var depthcol =  "rgb(30, 144, 255)"; 
      } else if (quakes[i].geometry.coordinates[2] >= 10) {
        var depthcol =  "rgb(70, 130, 180)"; 
      } else if (quakes[i].geometry.coordinates[2] >= 0) {
        var depthcol =  "rgb(135, 206, 250)"; 
      } else {
        var depthcol =  "Orange"; 
      }
      
    var quakeMark = L.circle([quakes[i].geometry.coordinates[1], quakes[i].geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      weight: 1,
      fillColor: depthcol,
      radius: (quakes[i].properties.mag)*30000
      }).bindPopup(`<h3>Magnitude: ${
        quakes[i].properties.mag
        }</h3>  <h3>Depth: ${
        quakes[i].geometry.coordinates[2]
        } km</h3> <h3>Location: ${
        quakes[i].properties.place
        }</h3><h3>Date & Time: ${
        Date(quakes[i].properties.time*1000)
        }</h3>`);

    quakeMarkers.push(quakeMark);
  }
return L.layerGroup(quakeMarkers);
}

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson').then(function(response) {
  createMap(createMarkers(response));
})