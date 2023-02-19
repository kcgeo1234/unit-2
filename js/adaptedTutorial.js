/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
    // add the content in L.tileLayer to map
    }).addTo(map);

    //call getData function
    getData();
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/MegaCities.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){            
            //create marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                // add the popup menu by calling onEachFeature function
                onEachFeature: onEachFeature,
                // add the prepared marker style to all location
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
            
        });
};

document.addEventListener('DOMContentLoaded',createMap)









// var map = L.map('map').setView([39.75621, -104.99404], 13); // setView([lat, long], Zoom)

// // add tile layer to make a base map
// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
// 	subdomains: 'abcd',
// 	maxZoom: 20
// // add the content in L.tileLayer to map
// }).addTo(map);


// // create GeoJSON variable (feature)
// var geojsonFeature = {
//     "type": "Feature",
//     "properties": {
//         "name": "Coors Field",
//         "amenity": "Baseball Stadium",
//         "popupContent": "This is where the Rockies play!"
//     },
//     "geometry": {
//         "type": "Point",
//         "coordinates": [-104.99404, 39.75621]
//     }
// };

// L.geoJSON(geojsonFeature).addTo(map);

// //load the data
// fetch("data/MegaCities.geojson")
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(json){
//         //create a Leaflet GeoJSON layer and add it to the map
//         L.geoJson(json).addTo(map);
//     })