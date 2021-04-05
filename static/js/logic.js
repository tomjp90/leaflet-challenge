// Create a map object
var myMap = L.map("map", {
      center: [15.5994, -28.6731],
      zoom: 3
    });
    
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: "pk.eyJ1IjoidG9tcG8iLCJhIjoiY2ttb3BhcHNrMDljdTJvcXB4Y3J6MnRkbCJ9.TEJneXaFNBW1OoWETwQ5rQ"
    }).addTo(myMap);

    var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

     // Grabbing our GeoJSON data..
    d3.json(link, function(data) {

    // Loop through the cities array and create one marker for each city object
    for (var i = 0; i < data.features.length; i++) {

      // Conditionals for countries points
      var color = "";
      if (data.features[i].properties.mag > 4) {
            color = "red";
      }
      else if (data.features[i].properties.mag < 4 ) {
        color = "orange";
      }
      else if (data.features[i].properties.mag < 3) {
            color = "yellow";
          }
      else if (data.features[i].properties.mag < 2) {
            color = "green";
      }
      else if (data.features[i].properties.mag < 1) {
            color = "green";
      }
    

      var d = new Date(data.features[i].properties.time);
      var time = d.toISOString();

      var lat = data.features[i].geometry.coordinates[1];
      var lon = data.features[i].geometry.coordinates[0];
      var mag = data.features[i].properties.mag;
      var moreInfoUrl = data.features[i].properties.url;
      var place = data.features[i].properties.place;
      var depth = data.features[i].geometry.coordinates[2];
      
      
      // Add circles to map
      L.circle([lat,lon], {
        colorOpacity: 0.75,
        color: color,
        // Adjust radius
        radius: data.features[i].properties.mag * 20000
      }).bindPopup("<h2>" + place + "</h2><hr>" + 
                  "<p><b>Depth: </b>"+depth+" km <br>" +
                  "<b>Magnitude: </b>"+ mag +  " ml <br>" +
                  "<b>Coordinates: </b>"+lat+ ", " + lon + "<br>" +
                  "<b>Time: </b>"+time + "<br>" +
                  "<b><a href="+ moreInfoUrl +">More Info</a></b>" +
                  "</p>" ).addTo(myMap);
      }
// LEGEND fdddddddddddddfg

 });