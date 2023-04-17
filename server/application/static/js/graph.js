/*
    Options to draw the graph received from backend
*/

// Draw the lines of the graph
async function drawGraph(map, data) {

    // Iterate over the airports in the data provided
    for (const route of data) {



        // Set the route
        let from = Object.keys(route)[0],   // start point
            to = route[from][0],            // end point
            distance = route[from][1];      // distance

        let startMarker, endMarker;



        // Find markers on the map
        map.eachLayer(function (marker) {
            if (marker instanceof L.Marker) {

                // If the marker name corresponds of those I am looking for
                if (marker.options.name == from) {
                    startMarker = marker
                }
                if (marker.options.name == to) {
                    endMarker = marker
                }

            }
        });



        // Set color to the pair of markers
        let icon = L.AwesomeMarkers.icon(
            { "extraClasses": "fa-rotate-0", "icon": "plane", "iconColor": "white", "markerColor": "blue", "prefix": "glyphicon" }
        );
        startMarker.setIcon(icon); endMarker.setIcon(icon);



        // Draw a path between markers
        // This one is the visible path for the user
        let visiblePath = L.polylineDecorator(
            [startMarker.getLatLng(), endMarker.getLatLng()],
            {
                patterns: [
                    { offset: 0, repeat: 10, symbol: L.Symbol.dash({ pixelSize: 5, pathOptions: { color: '#000', weight: 1, opacity: 0.2 } }) },
                    {
                        offset: '16%', repeat: '33%', symbol: L.Symbol.marker({
                            rotate: true, markerOptions: {
                                icon: L.icon({
                                    iconUrl: 'static/img/icon_plane.png',
                                    iconAnchor: [16, 16]
                                })
                            }
                        })
                    }
                ]
            }
        ).addTo(map);

        // This one is an invisible path to display the distance
        let invisiblePath = L.polyline([startMarker.getLatLng(), endMarker.getLatLng()], {
            weight: 15,
            color: '#00000000'
        }).addTo(map);

        // Display distance
        invisiblePath.setText(`${Math.round(distance * 100) / 100} km`, {
            repeat: false,
            offset: -10,
            center: true,
            orientation: 0,
            attributes: {
                fill: 'gray',
                'font-size': '16'
            }
        });

        await delay(500); // delay execution for 1 second
    }

}

// Delay graph drawing
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}