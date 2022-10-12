/*
    In this file you'll find the creation of the graph.

    Reference(s):
    -- Arrows on leaflet.js: https://github.com/slutske22/leaflet-arrowheads
    -- Text path on leaflet.js: https://github.com/makinacorpus/Leaflet.TextPath
*/



/* 
    Requests
*/
var xhr = new XMLHttpRequest();
////




/* 
    MAP
*/
const map = map_44e742c23e81cd705d2fc47524212eb2;
////

/*
    GRAPH
*/
var graph = [];

/*
    The graph consists on this structure:
    * main brackets for the graph itself:
    []
    * inner brackets representing a line:
    [[line_1], [line_2], [line_3], ...]
    * inner brackets for each line, represented with xy points:
    [[[x,y],[x,y]], [[x,y],[x,y]], [[x,y],[x,y]], ...]
*/
////

/*
    DISTANCES
*/
var distances = [];
////




/*
    FUNCTIONS
*/
// Draw graph
function DrawGraph() {
    // Delete previous graph
    ClearGraph();

    // For each pair of nodes,
    for (let i = 0; i < graph.length; i++) {
        let new_line;

        // Draw a line between them
        new_line = L.polyline(graph[i], {color: 'red'});

        // Add a direction
        new_line.arrowheads({size: '5px', fill: true,  frequency: 3});

        // Add weight to the line
        new_line.setText(`${parseInt(distances[i])} km`, {repeat: false, center: true, offset: -5, attributes: {fill: 'gray', 'font-size': '14px'}});
        
        // Add del function to the edge
        new_line.on("dblclick", (e) => {
            DelEdge(e.target.getLatLngs());
        });
        
        // Add it to the map
        new_line.addTo(map);
    }
}

// Delete edge
function DelEdge(coords) {
    let from = [coords[0].lat, coords[0].lng];
    let to = [coords[1].lat, coords[1].lng];

    let edge_to_del = [from, to];

    // Loop
    var i = 0;
    while (i < graph.length) {
        if (JSON.stringify(graph[i]) == JSON.stringify(edge_to_del)) {
            graph.splice(i, 1);
            distances.splice(i,1);
            i--; // Index corrector when splicing
        }
        i++;
    }

    // Draw the graph
    DrawGraph();
}

// Clear graph
function ClearGraph() {
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}
////



// Tests
// map.eachLayer(function (layer) {
//     try {
//         console.log(layer._icon);
//     }
//     catch(e) {}
// });