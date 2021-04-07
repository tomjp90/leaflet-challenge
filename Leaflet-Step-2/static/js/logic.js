// create a map object
var myMap = L.map("map", {
      center: [15.5994, -28.6731],
      zoom: 2.3
});
// create basemap
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
}).addTo(myMap);

//link to earthquake data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//==================== MAP ==============================

// colour gor magnitude - need to replace this with switch case
function getColour(d) {
      var magColour = ""
      if (d >= 5) { magColour = '#800026' }
      else if (d >= 4 && d < 5) { magColour = "#FC4E2A"; }
      else if (d >= 3 && d < 4) { magColour = "#FD8D3C"; }
      else if (d >= 2 && d < 3) { magColour = "#FEB24C"; }
      else if (d >= 1 && d < 2) { magColour = "#FED976"; }
      else if (d >= 0 && d < 1) { magColour = "#fAF0BE"; }
      return (magColour)
};

// grabbing our GeoJSON data..
d3.json(link, function (data) {
      // loop through the cities array and create one marker for each city object
      for (var i = 0; i < data.features.length; i++) {
            var mag = data.features[i].properties.mag;
            // conditionals colour for marker magnitude
            var color = getColour(mag)

            // convert unix date to ISO 8601 date
            var d = new Date(data.features[i].properties.time);
            var time = d.toISOString();

            // store earthquake information for bindPopup
            var lat = data.features[i].geometry.coordinates[1];
            var lon = data.features[i].geometry.coordinates[0];
            var moreInfoUrl = data.features[i].properties.url;
            var place = data.features[i].properties.place;
            var depth = data.features[i].geometry.coordinates[2];

            // Add earthquake locations to map
            L.circle([lat, lon], {
                  colorOpacity: 0.75,
                  color: color,
                  // Adjust radius based on magnitude and and popup information
                  radius: data.features[i].properties.mag * 40000
            }).bindPopup("<h2>" + place + "</h2><hr>" +
                  "<p><b>Depth: </b>" + depth + " km <br>" +
                  "<b>Magnitude: </b>" + mag + " ml <br>" +
                  "<b>Coordinates: </b>" + lat + ", " + lon + "<br>" +
                  "<b>Time: </b>" + time + "<br>" +
                  "<b><a href=" + moreInfoUrl + ">More Info</a></b>" +
                  "</p>").addTo(myMap);
      }
});
      // ====================== LEGEND ======================================
      // create a legend in the bottom right 
      var legend = L.control({ position: "bottomright" });

      legend.onAdd = function (myMap) {
            // create div for legend and create buckets
            var div = L.DomUtil.create("div", "info legend");
            div.innerHTML += "<h4>Richter <br> Scale</h4>";
            div.innerHTML += '<i style="background:' + getColour(5) + '"></i><span>5+</span><br>';
            div.innerHTML += '<i style="background:' + getColour(4) + '"></i><span>4-5</span><br>';
            div.innerHTML += '<i style="background:' + getColour(3) + '"></i><span>3-4</span><br>';
            div.innerHTML += '<i style="background:' + getColour(2) + '"></i><span>2-3</span><br>';
            div.innerHTML += '<i style="background:' + getColour(1) + '"></i><span>1-2</span><br>';
            div.innerHTML += '<i style="background:' + getColour(0) + '"></i><span>0-1</span><br>';
            div.innerHTML += "<b><a href=https://en.wikipedia.org/wiki/Richter_magnitude_scale>Richter Scale Info</a></b>"

            return div;
      };
      legend.addTo(myMap);

