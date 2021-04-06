// Create a map object
var myMap = L.map("map", {
      center: [15.5994, -28.6731],
      zoom: 2
    });
    
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: "pk.eyJ1IjoidG9tcG8iLCJhIjoiY2ttb3BhcHNrMDljdTJvcXB4Y3J6MnRkbCJ9.TEJneXaFNBW1OoWETwQ5rQ"
}).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//==================== MAP ==============================
// Grabbing our GeoJSON data..
d3.json(link, function(data) {

      // Loop through the cities array and create one marker for each city object
      for (var i = 0; i < data.features.length; i++) {

            // Conditionals for countries points
            var color = "";
            if (data.features[i].properties.mag > 4) {
                  color = "#E31A1C";
            }
            else if (data.features[i].properties.mag < 4 ) {
                  color = "#FC4E2A";
            }
            else if (data.features[i].properties.mag < 3) {
                  color = "#FD8D3C";
            }
            else if (data.features[i].properties.mag < 2) {
                  color = "#FEB24C";
            }
            else if (data.features[i].properties.mag < 1) {
                  color = "#FED976";
            }

            // convert ISO 8601 time format to string
            var d = new Date(data.features[i].properties.time);
            var time = d.toISOString();
            // store earthquake information for bindPopup
            var lat = data.features[i].geometry.coordinates[1];
            var lon = data.features[i].geometry.coordinates[0];
            var mag = data.features[i].properties.mag;
            var moreInfoUrl = data.features[i].properties.url;
            var place = data.features[i].properties.place;
            var depth = data.features[i].geometry.coordinates[2];

            // Add earthquake locations to map
            L.circle([lat,lon], {
                  colorOpacity: 0.75,
                  color: color,
                  // Adjust radius based on magnitude and and popup information
                  radius: data.features[i].properties.mag * 20000
                  }).bindPopup("<h2>" + place + "</h2><hr>" + 
                              "<p><b>Depth: </b>"+ depth +" km <br>" +
                              "<b>Magnitude: </b>"+ mag +  " ml <br>" +
                              "<b>Coordinates: </b>"+ lat + ", " + lon + "<br>" +
                              "<b>Time: </b>"+ time + "<br>" +
                              "<b><a href="+ moreInfoUrl +">More Info</a></b>" +
                              "</p>" ).addTo(myMap);
            }

      // ====================== LEGEND ======================================
      // create a legend in the botto right 
      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function(myMap) {
      // create div for legend and create buckets
      var div = L.DomUtil.create("div", "legend");
            div.innerHTML += "<h4>Richter <br> Scale</h4>";
            div.innerHTML += '<i style="background: #E31A1C"></i><span>5+</span><br>';
            div.innerHTML += '<i style="background: #FC4E2A"></i><span>4-5</span><br>';
            div.innerHTML += '<i style="background: #FD8D3C"></i><span>3-4</span><br>';
            div.innerHTML += '<i style="background: #FEB24C"></i><span>2-3</span><br>';
            div.innerHTML += '<i style="background: #FED976"></i><span>1-2</span><br>';
            div.innerHTML += '<i style="background: #FED976"></i><span>0-1</span><br>';
            div.innerHTML += "<b><a href=https://en.wikipedia.org/wiki/Richter_magnitude_scale>Richter Scale Info</a></b>"

            return div;
      };
      legend.addTo(myMap);

});