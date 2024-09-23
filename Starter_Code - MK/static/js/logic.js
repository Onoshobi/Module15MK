// Initialize the map and setting view around Italy,and zoom level 4
var map_leaflet = L.map('map').setView([41.8719, 12.5674], 4); // 

// Adding a tile layer to our variable map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_leaflet);


// marker size 
function fixingMarkerSize(magnitude) {

    // Adjusting scale 
    return magnitude * 15000; 
}

// Function to determine color based on depth
function getColorEQ(depth) {
    let color = "";
    if (depth>90){
            color =  '#800026';
    }
    else if(depth> 70){
            color =  '#BD0026';
    }
    else if(depth > 50){
            color = '#bd0026b6';
    }
    else if (depth > 30){
            color = '#E31A1C';
    }
    else if (depth >10){
           color = '#FC4E2A';
    }
   else{
            color = '#FD8D3C';
    }
    console.log(color)
    return color;
}


//Adding legend to the map

function createLegend() {
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        var grades = [-10, 10, 30, 50,70,90];
        var labels = [];

        // Add legend title
        div.innerHTML += '<strong>Depth (km)</strong><br>';

        // Add legend color entries
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorEQ(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map_leaflet);
}



//Getting the earthquick data 
function init_get_data_visualize() {
      d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then((data) => {
    
        // get the metadata field
    const data_metadata = data['metadata'];
    //console.log(data_metadata);
    //Get the features
    var features = data['features'];
    features.forEach(earthquick =>  {
        let coords = earthquick.geometry.coordinates;
        let magnitude = earthquick.properties.mag;
        let lng = coords[0];
        let lat = coords[1];
        let depth = coords[2];

        //Adding each earthquick to the map with color and setting the marker as the magnitude
        L.circle([lat, lng], {
            color: getColorEQ(depth),
            fillColor: getColorEQ(depth),
            fillOpacity: 0.7,
            radius: fixingMarkerSize(magnitude) 
        }).addTo(map_leaflet)
          .bindPopup('<b>Magnitude:</b> ' + magnitude + '<br><b>Depth:</b> ' + depth + ' km');


      
        
    });
      // Adding legend to the map
      createLegend();
})
.catch(error => console.error('Error fetching data:', error));
}

init_get_data_visualize()