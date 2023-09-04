// check to see if links work
console.log("Start of map using logic_1");

// logic_1 creates the initial tile layers, a layersGroup for the earthquakes and a layer control

// logic_2 gets the USGS earthquake data and creates a circleMarker for each earthquake
// using a common radius, common color and popup with location, time and magnitude

// logic_3 creates circleMarker with radius as a function of magnitude markerSize()
// and color as a function of depth: funciton called markerColor()
// with an overall styleInfo function tha t calls both styleInfo()



// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' + 
    '<br> Lead Analyst: Lauren <a href="https://github.com/lphelpspittman/Leaflet-Challenge">Github Repo</a>'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' + 
    '<br> Lead Analyst: Lauren <a href="https://github.com/lphelpspittman/Leaflet-Challenge">Github Repo</a>'
});

// Create a baseMaps object.
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

// create an empty (new) leaflet layerGroup for earthquakes
let earthquakes = new L.layerGroup();

// create an overlay object to hold our overlay.
let overlayMaps = {
    Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3.5,
    layers: [street, earthquakes]
});

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// get earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
// Perform a d3.json AJAX to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    console.log(data.features[0]);

    // create a function for markerColor using depth (km)
    function markerColor(depth) {
        return depth > 150 ? '#d73027' :
        depth > 500  ? '#f46d43' :
        depth > 50  ? '#fdae61' :
        depth > 25  ? '#fee08b' :
        depth > 10   ? '#d9ef8b' :
        depth > 5   ? '#a6d96a' :
        depth > 2   ? '#66bd63' :
                   '#1a9850';
    }

    // create function for markerSize
    function markerSize(magnitude) {
        // note I am using a USGS feed for magnitude of 1+ therefore I will not hav a circle with radius 0
        return magnitude * 4
    }

    // create a GeoJSON layer using data
    function styleInfo(feature) {
        return {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
        };
    }

    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        // use styleInfo to define circleMarker style
        style: styleInfo,

        // use onEachFeature to add a popup with location, time, magnitude and depth
        onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><h3>Magnitude: ${feature.properties.mag.toLocaleString()}</h3>
            <h3>Depth: ${feature.geometry.coordinates[2].toLocaleString()}</h3>`);
        }
    }).addTo(earthquakes);

// data with d3 is only available above this point
});