var xhr = new XMLHttpRequest();

function PRIM() {
    xhr.open("POST", "/api/v1", true);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify({"airport": "random", "method": "prim"}))
    xhr.onreadystatechange = function () {

        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    
            //Server response
            var response = JSON.parse(xhr.responseText);
    
            console.log(response)
        }
    }
}

