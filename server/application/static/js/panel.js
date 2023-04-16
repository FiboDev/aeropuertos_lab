/*
    Aside functions related to the panel
*/

// Complete the select input on the panel
function completeSelect(map, selectInput) {

    // Iterate over the markers on the map and get the airports name
    map.eachLayer(function (marker) {
        if (marker instanceof L.Marker) {

            let airportName = marker.options.name;

            // Add an option for each airport
            selectInput.append($('<option>', { // Append a new option element to the select input
                value: airportName,
                text: airportName
            }));

        }
    });

}

// Toggle buttons on the panel
function toggleButtons(buttons) {
    buttons.each(function () { // iterate over each button
        var isDisabled = $(this).prop('disabled'); // check if the button is disabled
        $(this).prop('disabled', !isDisabled); // toggle the disabled property
    });
}

// Normalize airport name
function normalizeName(str) {
    str = str.toUpperCase();
    let removedAccentsStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return removedAccentsStr
}