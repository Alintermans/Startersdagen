//------------------------------------------- Settings -------------------------------------------//
var led = false;

//------------------------------------------- Buttons -------------------------------------------//

function turn_on() {
    fetch('/turn_on')
    .then(response => response.json())
    .then(data => console.log(data));}

function turn_off() {
    fetch('/turn_off')
    .then(response => response.json())
    .then(data => console.log(data));}
    

function led_switch() {
if (led == false) {
    led = true;
    turn_on();
} else {
    led = false;
    turn_off();
}
}
//------------------------------------------- Error Box  -------------------------------------------//

// var error_box_visible = false;

// function showErrorMessage(msg) {
//     error_box_visible = true;
//     var errorContainer = document.getElementById("error-container");
//     errorContainer.innerHTML = "<div class='error-box'>" + msg + " <button class='button button-usb-in-errorbox' onclick='reset_usb_button()'><i class='fas fa-undo'></i> Reset USB</button></div>";
// }

// function hideErrorMessage() {
//     error_box_visible = false;
//     var errorContainer = document.getElementById("error-container");
//     errorContainer.innerHTML = "";
// }

// var error_source = new EventSource('/error_stream');
// error_source.onmessage = function(event) {
//     var data = JSON.parse(event.data);
//     if (data.message != "") {
//         showErrorMessage(data.message);
//     } else if (error_box_visible) {
//         hideErrorMessage();
//     }
// };