// Add all scripts to the JS folder
var map = L.map('map').setView([51.505, -0.009], 13);

// add tile layer
L.tileLayer('https://a.tile.openstreetmap.de/{z}/{x}/{y}.png https://b.tile.openstreetmap.de/{z}/{x}/{y}.png https://c.tile.openstreetmap.de/{z}/{x}/{y}.png', [
    maxZoom: 19, 
    attribution: &copy; <a href='http://www.openstreetmap.org/copyright'>(
        addTo(map);
    )
])