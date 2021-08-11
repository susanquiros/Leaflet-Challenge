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
// function getColor(mag) {
//     if (mag >= 5) {
//         return '#C73866'
//     } else {
//         if (mag > 4) {
//             return '#FE676e'
//         } else {
//             if (mag > 3) {
//                 return '#FD8F52'
//             } else {
//                 if (mag > 2) {
//                     return '#FFBD71'
//                 } else {
//                     if (mag > 1) {
//                         return '#FFDCA2'
//                     } else {
//                         return '#C8C6C9'
//                     }
//                 }
//             }
//         }
//     }
// };

// Depth function
//['', '', '', '', '', '', '', '', '', '']
function getFillColor(depth) {
    if (depth >= 90) {
        return '#ffffe0'
    } else {
        if (depth > 80) {
            return '#caefdf'
        }
        else {
            if (depth > 70) {
                return '#abdad9'
            }
            else {
                if (depth > 60) {
                    return '#93c4d2'
                } else {
                    if (depth > 50) {
                        return '#7daeca'
                    } else {
                        if (depth > 40) {
                            return '#6997c2'
                        } else {
                            if (depth > 30) {
                                return '#5681b9'
                            } else {
                                if (depth > 20) {
                                    return '#426cb0'
                                } else {
                                    if (depth > 10) {
                                        return '#2b57a7'
                                    } else {
                                        return '#00429d'
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
                weight: 0
            }).addTo(myMap);   
        }
    });
});

// Starting pop up layers
function onEachFeature(feature, layer) {
    // console.log('Creating pop up'),
    // Time format
    var format = d3.timeFormat('%d-%b-%Y at %H:%M');
    //Pop up layer using title, title and magnitude
    var popupText = (layer.bindPopup('<h2>' + 'Location : ' + '<br>' + feature.properties.title + '</h2>' + '<hr>' + '<h3>' + 'Time : ' + (format(new Date (feature.properties.time))) + '</h3>' + '<h3>' + 'Type : '   + feature.properties.type + '</h3>' + '<h3>' + 'Magnitude : ' + feature.properties.mag + '</h3>' + '<h3>' + 'Depth : '+feature.geometry.coordinates[2] + '</h3>'
    )).addTo(myMap)
};

// Defining legend
var legend = L.control({ position: 'bottomleft' });
legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    var depth = [-10,10,20,30,40,50,60,70,80,90];
    var colors = ['#00429d', '#2b57a7', '#426cb0', '#5681b9', '#6997c2', '#7daeca', '#93c4d2', '#abdad9', '#caefdf', '#ffffe0']
    var labels = [];
    // var labelsInfo = '<h4>Depth</h4>';
    // Add min & max
    div.innerHTML = '<h2>Depth</h2>'+'<div class="labels"><div class="min">' + depth[0] + '</div> \
    <div class="max">' + depth[depth.length - 1] + '</div></div>';
    depth.forEach(function (depth, index) {
        labels.push('<li style="background-color: ' + colors[index] + '"></li>')
      })
      div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
    };
legend.addTo(myMap)