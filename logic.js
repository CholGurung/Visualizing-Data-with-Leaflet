
//store api endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//perform a query request to the query
d3.json(queryUrl, function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakeData){
    var coords = [];
    //give each feature a popup descrbing the place and time of earthquake
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + 
        "<h3><hr><p>" + new Date(feature.properties.time) + "</p" + "<hr><p>Magnitude: " + feature.properties.mag + "</p>");
        //console.log("feauture_mag" , feature.properties.mag);
        coords.push({key:  [feature.geometry.coordinates[1],feature.geometry.coordinates[0]],
        value: feature.properties.mag});
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        //pointToLayer: L.circleMarker("37.6213129,-122.3811441")
        
    });

    //var faultlines = L.geoJSON()
    //console.log("earthquake value : ", coords);
    //send earthquake layer to createmap function
    createMap(earthquakes, coords);
}

function createMap(earthquakes, coords) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellitemap,
      "Outdoors": streetmap,
      "Gray Scale": darkmap,
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
      //Faultline: faultlines
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
      
    });
    
  
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Add circles to map
    for (var i = 0; i < coords.length; i++) {
      console.log("inside marker function " + coords[i].key);
      L.circleMarker(coords[i].key, {
        fillOpacity: 1,
        opacity: 1,
        color: "grey",
        fillColor: getColor(coords[i].value),
        radius: coords[i].value * 5
      }).addTo(myMap);
    }


    function getColor(mag){
      switch(true){
        case mag > 5:
          return "blue";
        case mag > 4:
          return "red";
        case mag > 3:
          return "yellow";
        case mag > 2:
          return "brown";
        case mag > 1:
          return "orange";
        default:
          return "purple";

      }

    }
  }
  

