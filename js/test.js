//declare map var in global scope
var map;
var minValue;

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map').setView([25.05, 121.50], 12); // setView([lat, long], Zoom)

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

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each station
    for(var station of data.features){
        //loop through each year
        for(var year = 2015; year <= 2022; year+=1){
              //get ridership for current year
              var value = station.properties["yr"+ String(year)];
              //add value to array
              if (value == 0){continue}
              else{
              allValues.push(value);}
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius

    return radius;
};

// function onEachFeature(feature, layer) {
//     //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };

function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "yr2015";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>StationName:</b> " + feature.properties.stationName + "</p><p><b>" + attribute.slice(-4) + ":</b> " + feature.properties[attribute] + "</p>";

    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius) 
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};


// Add circle markers for point features to the map
function createPropSymbols(data){
    
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        // onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
        // function (feature, latlng) {
        //     //Step 5: For each feature, determine its value for the selected attribute
        //     var attValue = Number(feature.properties[attribute]);

        //     // //Step 6: Give each feature's circle marker a radius based on its attribute value
        //     geojsonMarkerOptions.radius = calcPropRadius(attValue);
        //     //create circle markers
        //     return L.circleMarker(latlng, geojsonMarkerOptions);
        // }
    }).addTo(map);
};


// Import GeoJSON data
function getData(){
    //load the data
    fetch("data/tpeMRT_ridership.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
        })
};

document.addEventListener('DOMContentLoaded',createMap)