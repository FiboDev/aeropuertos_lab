/*
    Options to draw the graph received from backend
*/

// Draw the lines of the graph
function drawGraph(map, graph, data) {

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

        // Draw a line
        
    }

}
