
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

var link = "/api/data"

d3.json(link, function(data) {

  // console.log(data.Lon)  // This works!
  // console.log(data.Lat)  // This works!

  for (i = 0; i < data.Lon.length; i++) {

    // console.log(data.Lon.length) // This works!
    //console.log(data.Lat[i]) // This works!

    L.marker([data.Lon[i], data.Lat[i]], {
      draggable: true,
      title: "Markers"
      }).bindPopup("<h1>" + data['Lacation Name'][i] + "</h1> <hr> <h3> Address: " + data['Address'][i] + "</h3>").addTo(map); 
  }

})

  