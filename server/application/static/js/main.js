// MAIN JS FILE

$(document).ready(function () {



    /*
        XMLHttpRequest to Python backend
    */
    var xhr = new XMLHttpRequest();



    /*
        CONST assigned from the folium generated map
    */
    const MAP = map_26925c45312d30b1d824ec463f4be208;



    /*
        CONST related to the select input for PRIM algorithm
    */
    const selectInput = $("#airports-list");



    /*
        CONST buttons of the panel
    */
    const panelButtons = $(".tool-button");



    /* --------------- PANEL FUNCTIONALITY --------------- */

    // Complete the select input on the panel
    completeSelect(MAP, selectInput);



    /* --------------- BUTTONS FUNCTIONALITY --------------- */

    // Call MST on backend
    function MST(method) {
        // Disable buttons
        toggleButtons(panelButtons);

        xhr.open("POST", "/api/v1", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        if (method == "prim") {
            let airportName = selectInput.val();
            xhr.send(JSON.stringify({ "airport": airportName, "method": method }));

        } else if (method == "kruskal") {
            xhr.send(JSON.stringify({ "method": method }));

        } else {
            return;
        }
        

        // Promise request
        xhr.onreadystatechange = function () {

            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

                // Server response
                var response = JSON.parse(xhr.responseText);

                // Draw the graph
                drawGraph(MAP, response).then(() => {
                    // Enable buttons again
                    toggleButtons(panelButtons);
                });

            }

        }
    }

    // -------- PRIM button function
    $(".tool-button.prim").click(function() {
        MST("prim");
    });

    // -------- KRUSKAL button function
    $(".tool-button.kruskal").click(function() {
        MST("kruskal")
    });

    // -------- RESET button function
    $(".tool-button.reset").click(function RESET() {
        // Disable buttons
        toggleButtons(panelButtons);

        // Reset the graph
        resetGraph(MAP);

        // Enable buttons again
        toggleButtons(panelButtons);

    });

});
