// Creating map object
var map = L.map("map", {
    center: [41.6032, -72.6877],
    zoom: 9
  });

  // Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);

  var marker = L.marker([trace.Lat, trace.Lon], {
    draggable: true,
    title: "Markers"
  }).addTo(myMap);