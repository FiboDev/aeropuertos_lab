/*
    In this file you'll find manipulation of markers

    Markers were all set with folium, which uses leaflet.js
    -- More info at: http://python-visualization.github.io/folium/
*/





/* 
    STATES
*/
// Last marker selected
var lastMarkerSelected;
var isFirstSelected = true;
var from, to;
var blinking;
////

/*
    MARKERS
*/
// All markers
var markers = document.querySelectorAll(".awesome-marker-icon-gray.awesome-marker.leaflet-zoom-animated.leaflet-interactive");
// All selected markers
var selected_markers = document.getElementsByClassName("awesome-marker-icon-red awesome-marker leaflet-zoom-animated leaflet-interactive");
////





/*
    FUNCTIONS
*/
// Start blinking animation
function blink(element) {
    $(element).fadeOut(200);
    $(element).fadeIn(200);
    blinking = setInterval(function() {
        $(element).fadeOut(200);
        $(element).fadeIn(200);
    }
    ,500);
}

// Toggle delete button
function ToggleDelButton(airport_name) {
    var del_button = document.getElementById(`del_${airport_name}`);

    var isAdded = lastMarkerSelected.getAttribute('isadded');
    if (isAdded == 'true') {
        del_button.style.display = 'block';
    } else {
        del_button.style.display = 'none';
    }
}

// Add an airport to the graph
function AddAirport(airport_name, airport_lat, airport_lon) {
    // Set an ID to the selected marker
    lastMarkerSelected.setAttribute('id', `airport_${airport_name}`);

    // If the markers is added, add isAdded flag
    lastMarkerSelected.setAttribute('isadded', true);

    // Color the airport and add to the selected markers
    lastMarkerSelected.classList.remove("awesome-marker-icon-gray");
    lastMarkerSelected.classList.add("awesome-marker-icon-red");

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
            console.log('Select a different airport');
            return;
        }

        // Check is that edge already exists
        let edge_to_check = [from, to]
        var i = 0;
        while (i < graph.length) {
            if (JSON.stringify(graph[i]) == JSON.stringify(edge_to_check)) {
                console.log('That flight already exists.');
                return;
            }
            i++;
        }

        // XHRequest (Create nodes and establish connection)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/v1", true);
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify([from,to]))
        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                //aqui tienes la distancia
                var response = JSON.parse(xhr.responseText);

                console.log(response);

                if (response["distance"] == "null") {
                    console.log('No hay vuelo directo.');
                    isFirstSelected = true;
                    clearInterval(blinking);
                    return;
                }

                isFirstSelected = true;

                // Stop indication
                clearInterval(blinking);

                // Push new changes to the graph
                graph.push([from, to]);
                distances.push(response["distance"]);
                // Draw the graph
                DrawGraph();

                // Movement anim. for new created line
                MoveAirplane([from, to]);
            }
        }

        

        
    }


    // Toggle delete button
    ToggleDelButton(airport_name);

}

// Remove an airpot from the graph
function DelAirport(airport_name, airport_lat, airport_lon) {

    // Clear state if the marker selected WAS first selected
    if (isFirstSelected == false) {
        isFirstSelected = true;
        // Stop indication
        clearInterval(blinking);
    }

    // If the markers is removed, remove isAdded flag
    lastMarkerSelected.setAttribute('isadded', false);

    // Remove the button
    ToggleDelButton(airport_name);

    // Color the airport and remove from the selected markers
    lastMarkerSelected.classList.add("awesome-marker-icon-gray");
    lastMarkerSelected.classList.remove("awesome-marker-icon-red");

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
////





/*
    ON-LOAD SCRIPT
*/
// Get the HTML element clicked
document.onclick = e => {
    // If clicked on a marker (with a DIV tag)
    if (e.target.tagName == 'DIV') {
        for (let i = 0; i < markers.length; i++) {
            if (e.target == markers[i]) {
                lastMarkerSelected = e.target;
            }
        }
    }

    // If clicked on a marker icon (with a I tag)
    if (e.target.tagName == 'I') {
        for (let i = 0; i < markers.length; i++) {
            if (e.target.parentElement == markers[i]) {
                lastMarkerSelected = e.target.parentElement;
            }
        }
    }
    
}


////
