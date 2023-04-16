// MAIN JS FILE

$(document).ready(function () {



    /*
        XMLHttpRequest to Python backend
    */
    var xhr = new XMLHttpRequest();
    /*
        some config for it
    */
    xhr.open("POST", "/api/v1", true);
    xhr.setRequestHeader("Content-Type", "application/json");



    /*
        CONST assigned from the folium generated map
    */
    const MAP = map_26925c45312d30b1d824ec463f4be208;



    /*
        CONST related to the select input for PRIM algorithm
    */
    const selectInput = $("airports-list");



    /* --------------- PANEL FUNCTIONALITY --------------- */

    // Complete the select input on the panel
    completeSelect(MAP, selectInput);


    // PRIM button function
    /*
    function PRIM() {
        xhr.send(JSON.stringify({"airport": "random", "method": "prim"}))
        xhr.onreadystatechange = function () {
    
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        
                //Server response
                var response = JSON.parse(xhr.responseText);
        
                console.log(response)
            }
        }
    }    
    */
});
