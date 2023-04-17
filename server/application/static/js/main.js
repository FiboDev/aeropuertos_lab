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

    // -------- PRIM button function
    $(".tool-button.prim").click(function PRIM() {
        // Disable buttons
        toggleButtons(panelButtons);

        let airportName = selectInput.val();

        xhr.open("POST", "/api/v1", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ "airport": airportName, "method": "prim" }));

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
