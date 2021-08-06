// Load the GeoJSON url.
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson';
// Creating the map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5
});
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
// Get marker color bases on earthquake magnitude
function getColor(mag) {
  if (mag >= 5) {
    return '#C73866'
  } else {
    if (mag > 4) {
      return '#FE676E'
    } else {
      if (mag > 3) {
        return '#FD8F52'
      } else {
        if (mag > 2) {
          return '#FFBD71'
        } else {
          if (mag > 1) {
            return '#FFDCA2'
          } else {
            return '#C8C6C9'
          }
        }
      }
    }
  }
};
// Depth function
function getFillColor(depth) {
  if (depth >= 90) {
    return '#DF8782'
  } else {
    if (depth > 80) {
      return '#E7A08C'
    }
    else {
      if (depth > 70) {
        return '#EEB899'
      }
      else {
        if (depth > 60) {
          return '#F4D0A9'
        } else {
          if (depth > 50) {
            return '#FAE8C0'
          } else {
            if (depth > 40) {
              return '#FFD9C3'
            } else {
              if (depth > 30) {
                return '#FFB0A4'
              } else {
                if (depth > 20) {
                  return '#FF8483'
                } else {
                  if (depth > 10) {
                    return '#FD4E5D'
                  } else {
                    return '#E9002C'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
// Get Data
d3.json(url).then(function (data) {
  console.log(data);
  L.geoJSON(data, {
    onEachFeature: onEachFeature,
    // Creating circle marker
    pointToLayer: function (feature, latlng) {
      console.log('Creatin marker');
      return new L.CircleMarker(latlng, {
        // Defining circle radius according to the magnitude
        radius: feature.properties.mag * 4,
        fillColor: getFillColor(feature.geometry.coordinates[2]),
        fillOpacity: 0.6,
      }).addTo(myMap);
    }
  });
});
// Starting pop up layers
function onEachFeature(feature, layer) {
  // console.log('Creating pop up'),
  //Pop up layer using title, title and magnitude
  var popupText = (layer.bindPopup('<h2>' + 'Location : ' + feature.properties.title + '</h2>' + '<hr>' + '<p>' + 'Type : ' + feature.properties.type + '</p>' + '<p>' + 'Magnitude : ' + feature.properties.mag + '</p>'
  )).addTo(myMap)
};
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  var depth = [-10, 10, 30, 50, 70, 90];
  var colors = ['#DF8782', '#E7A08C', '#EEB899', '#F4D0A9', '#FAE8C0', '#FFD9C3', '#FFB0A4', '#FF8483', '#FD4E5D', '#E9002C']
  var labels = [];
  var labelsInfo = '<h4>Depth</h4>';
  // Add min & max
  div.innerHTML = '<h1>Depth</h1>' + '<div class="labels"><div class="min">' + depth[0] + '</div> \
    <div class="max">' + depth[depth.length - 1] + '</div></div>';
  limits.forEach(function (depth, index) {
    labels.push('<li style="background-color: ' + colors[index] + '"></li>')
  })
  div.innerHTML += '<ul>' + labels.join('') + '</ul>'
  return div
};
legend.addTo(myMap)

