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

// Add edge
function AddEdge(airport_lat, airport_lon) {

    // Check the order of selection of the airport and draw the graph on the map
    if (isFirstSelected) {
        // From which airport
        from = [airport_lat, airport_lon];
        isFirstSelected = false;

        // Indicate state of selection
        let iconOnWait = lastMarkerSelected.children[0];
        blink(iconOnWait);

    } else {
        // To another airport
        to = [airport_lat, airport_lon];

        // Check if it is the same airport (from == to)
        if (from[0] == to[0] && from[1] == to[1]) {
            console.log('Selecciona un aeropuerto distinto.');
            return;
        }

        // Check is that edge already exists
        let edge_to_check = [from, to]
        var i = 0;
        while (i < graph.length) {
            if (JSON.stringify(graph[i]) == JSON.stringify(edge_to_check)) {
                console.log('Ese vuelo ya existe.');
                return;
            }
            i++;
        }

        // XHRequest (Create nodes and establish connection)
        xhr.open("POST", "/api/v1", true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify({"from": from, "to": to, "method": "add"}))
        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                //Server response
                var response = JSON.parse(xhr.responseText);

                // CASES:
                // If there's no route
                if (response == "null") {
                    console.log('No hay vuelo directo.');
                    isFirstSelected = true;
                    clearInterval(blinking);
                    return;
                }
                // If there's a direct connection (response = distance)
                if (typeof response == "number") {
                    isFirstSelected = true;

                    // Stop indication
                    clearInterval(blinking);

                    // Push new changes to the graph
                    graph.push([from, to]);
                    distances.push(response);

                    // Draw the graph
                    DrawGraph();
                    // Movement anim. for new created line
                    MoveAirplane([from, to]);

                    return;
                }
                // If there's NO direct connection (response = route + distances)
                if (typeof response == "object") {
                    console.log("No hay vuelo directo. Recalculando ruta...")
                    isFirstSelected = true;

                    // Stop indication
                    clearInterval(blinking);

                    for(let i = 0; i < response["vertices"].length; i++) {
                        if (typeof response["vertices"][i+1] != "undefined") {
                            // Create edges for recalculated route
                            let new_line = [response["vertices"][i], response["vertices"][i+1]];
                            let new_distance = response["distances"][i];

                            // Verify if the edge already exists
                            let edge_exists = false;
                            let n = 0;
                            while (n < graph.length) {
                                if (JSON.stringify(graph[n]) == JSON.stringify(new_line)) {
                                    edge_exists = true;
                                }
                                n++;
                            }

                            if (!edge_exists) {
                                // Push changes
                                graph.push(new_line);
                                distances.push(new_distance);
                            }
                            
                        }

                        // Add each new vertex to selected markers on the map
                        map.eachLayer(function (layer) {
                            try {
                                if (response["vertices"][i][0] == layer._latlng.lat && response["vertices"][i][1] == layer._latlng.lng) {
                                    // Each marker on the new route
                                    let marker_on_route = layer._icon;

                                    // Check those markers that aren't on the selected markers group
                                    if (marker_on_route.getAttribute('isadded') != 'true') {
                                        // Add them and set a bunch of properties... lmao

                                        // Get airport name on that coordinate
                                        let airport_on_route = response["nombres_con_tildes"][i];

                                        // Set an ID to the selected marker
                                        marker_on_route.setAttribute('id', `${airport_on_route}`);

                                        // If the markers is added, add isAdded flag
                                        marker_on_route.setAttribute('isadded', true);

                                        // Color the airport and add to the selected markers
                                        marker_on_route.classList.remove("awesome-marker-icon-gray");
                                        marker_on_route.classList.add("awesome-marker-icon-red");

                                        // Toggle delete button
                                        // The way leaflet works with graphs is horrible...
                                        // The following block adds a function that waits to be executed once the user clicks
                                        // on the awaited airport.
                                        marker_on_route.addEventListener("click", function() {
                                            let delay = setInterval(() => {
                                                ToggleDelButton(airport_on_route);
                                                clearInterval(delay);
                                            }, 100);
                                        }, {once : true});
                                        
                                    }
                                }
                               
                            }
                            catch(e) {}
                        });
                    }

                    // Draw the graph
                    DrawGraph();
                    // Movement anim. for new created line
                    MoveAirplane(response["vertices"]);

                    return;
                    
                }

                
            }
        }

        

        
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

    //
    xhr.open("POST", "/api/v1", true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify({"from": from, "to": to, "method": "remove_edge"}))
        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                console.log("Vuelo eliminada.");
            }
        }
}

// Delete associated edges of a marker on deletion
function DelAssoEdges(airport_lat, airport_lon) {
    //Remove any polylines from the graph connect with the deleted airport
    let marker_to_del = [airport_lat, airport_lon];
    // Loop
    var i = 0;
    while (i < graph.length) {
        if (JSON.stringify(graph[i][0]) == JSON.stringify(marker_to_del) || JSON.stringify(graph[i][1]) == JSON.stringify(marker_to_del)) {
            graph.splice(i, 1);
            distances.splice(i, 1);
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
            catch(e) {}
        }
    }
}

// FUNCTIONS FROM THE PANEL

// BFS traversal
function BFSTraversal() {
    console.log("Haga clic en un aeropuerto ya añadido.");

    let on_selection = true;
    let marker_clicked;

    // Get a click from the user
    function getClick() {
        return new Promise(acc => {
          function handleClick() {
            document.removeEventListener('click', handleClick);
            acc();
          }
          document.addEventListener('click', handleClick);
          document.onclick = e => { // Save last element clicked
            // If clicked on a marker (with a DIV tag)
            if (e.target.tagName == 'DIV') {
                for (let i = 0; i < markers.length; i++) {
                    if (e.target == markers[i]) {
                        marker_clicked = e.target;
                    }
                }
            }

            // If clicked on a marker icon (with a I tag)
            if (e.target.tagName == 'I') {
                for (let i = 0; i < markers.length; i++) {
                    if (e.target.parentElement == markers[i]) {
                        marker_clicked = e.target.parentElement;
                    }
                }
            }
          } 
        });
    }

    // Hold the user until it clicks a correct element
    setTimeout(async function () {
        while(on_selection) {
            await getClick(); // Wait for a user click...
            
            try {
                if (marker_clicked.getAttribute("isadded") == "true") {
                    on_selection = false;
                    console.log("Selección correcta!");
                } else{
                    console.log("Haga clic en un aeropuerto 'NARANJA'.");
                }
            } catch (e) {}
            
        }
    }, 100);
    

    // let startPoint = lastMarkerSelected;

    // // Get traversal from backend
    // map.eachLayer(function (layer) {
    //     try {
    //         if (layer._icon == startPoint) {
    //             console.log("Hay un punto de inicio!");
    //         }
           
    //     }
    //     catch(e) {}
    // });
}
////