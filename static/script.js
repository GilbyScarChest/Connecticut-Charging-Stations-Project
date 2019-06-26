
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
    accessToken: API_KEY,
}).addTo(map);


/////////////////////////////////////////////////////////
// Markers
/////////////////////////////////////////////////////////
  
var link = "/api/data"

d3.json(link, function(data) {

  // console.log(data.Lon)  // This works!
  // console.log(data.Lat)  // This works!

  for (i = 0; i < data.Lon.length; i++) {

    // console.log(data.Lon.length) // This works!
    //console.log(data.Lat[i]) // This works!

    var marker = L.marker([data.Lon[i], data.Lat[i]], {
      draggable: true,
      title: "Markers",
      color: "red"
      }).bindPopup("<h1>" + data['Location Name'][i] + "</h1> <hr> <h3> <strong>Address: </strong>" + data['Address'][i] + "</h3> \n <h3> <strong>Hours: </strong>" + data['Hours'][i] + "</h3>").addTo(map).on("click", clickZoom); 
  }

  // Zoom and center on marker, then call gaugeSetup
  function clickZoom(e) {
    map.setView(e.target.getLatLng(),13);
    gaugeSetup(data.Hours);
  }

  
  /////////////////////////////////////////////////////////
  // Gauge Setup
  /////////////////////////////////////////////////////////
  // Telling the gauge how to rank each Hours Str.
  function gaugeSetup(data){
    convenience = 0

    console.log(data) // This works!

    if (data.Hours == "24 hours daily" 
      || data.Hours == "Open 24 Hours" 
    ){convenience = 5}
    else if (data.Hours == "Open 24/7 is a pay lot"
      || data.Hours == "Open 24 Hours-Guests Only"
    ){convenience = 4}
    else if (data.Hours == "5AM-2AM M-Sat, 8AM-2AM Sun"
      || data.Hours == "Daily: 6AM-Midnight"
      || data.Hours == "Daily: 6Am-3AM"
    ){convenience = 3}
    else if (data.Hours == "5AM-2AM M-Sat, 8AM-2AM Sun"
      || data.Hours == "6 AM-11:45 PM 7 days a week"
      || data.Hours == "8 AM-7 PM M-Thur, 8 AM-5 PM F-Sun"
      || data.Hours == "9 AM-5 PM M-Sat"
      || data.Hours == "9 AM-5 PM M-Th, 9 AM-2 PM F-Sat"
      || data.Hours == "9:30 AM-5:30 PM M-Sat, 11AM-5PM Sun"
      || data.Hours == "9:30 AM-5:30 PM M-Sat, 11AM-5PM Sun"
    ){convenience = 2}
    else {
      convenience = 1
    }

    return convenience
  }

  // Calling gauge functions
  gaugeSetup(data.Hours);
  buildGauge(convenience);
  

})

/////////////////////////////////////////////////////////
// Gauge Visualization
/////////////////////////////////////////////////////////
function buildGauge(convenience) {

  console.log(convenience)

  // Enter a speed between 0 and 180
  var level = convenience;
  
  // Trig to calc meter point
  var degrees = 180 - (level * 36), // 36 is 180/5
       radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);
  
  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/5, 50/5, 50/5, 50/5, 50/5, 50/5, 50],
    rotation: 90,
    text: ['Very Convenient!', 'Convenient', 'Somewhat Convenient', 'Less So',
              'Not Very', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(232, 226, 202, .5)',
                           'rgba(255, 255, 255, 0)']},
    labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];
  
  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Location Hours</b> <br> Convenience',
    height: 1000,
    width: 1000,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };
  
  Plotly.plot('gauge', data, layout);
}





  