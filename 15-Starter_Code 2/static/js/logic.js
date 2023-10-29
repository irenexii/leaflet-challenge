 let myMap = L.map('map').setView([40.73, -74.0059], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(myMap);

function markerSize(magnitude) {
    return magnitude * 500;
}

function markerColor(depth) {
    if (depth < 10) return 'lightgreen';
    if (depth < 30) return 'green';
    if (depth < 50) return 'yellow';
    if (depth < 70) return 'orange';
    if (depth < 90) return 'red';
    return 'darkred';
}

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function (data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: 'black',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap);

    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 10, 30, 50, 70, 90];
        let labels = [];

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});
