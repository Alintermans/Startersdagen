//------------------------------------------- Settings -------------------------------------------//
var state = 0;
var choice = 'None';
var nb_steps_advanced = 1;
var nb_steps_beginner = 1;



//------------------------------------------- Buttons -------------------------------------------//


    

function led() {
    fetch('/led')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });}



function reset() {
    fetch('/reset')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
    });}

function beginner() {
    fetch('/beginner')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
    });}

function advanced() {
    fetch('/advanced')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
    });}

function next() {
    fetch('/next')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
    });}

function back() {
    fetch('/back')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
    });}

//------------------------------------------- Color Sensor -------------------------------------------//

function detectColor() {
    const red_value = document.getElementById('detected-red-value');
    const green_value = document.getElementById('detected-green-value');
    const blue_value = document.getElementById('detected-blue-value');
    const detected_color = document.getElementById('detected-color');
    fetch('/detect-color')
    .then(response => response.json())
    .then(data => {
        red_value.textContent = data.red_value;
        green_value.textContent = data.green_value;
        blue_value.textContent = data.blue_value;
        detected_color.textContent = data.detected_color;
    }); 
}


//------------------------------------------- RGB-SLIDER -------------------------------------------//

function initializeSlider() {
    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    redSlider.addEventListener('input', updateColor);
    greenSlider.addEventListener('input', updateColor);
    blueSlider.addEventListener('input', updateColor);

    updateColor(); // Initialize color box
}


function updateColor() {
    const redSlider = document.getElementById('redSlider');
    const greenSlider = document.getElementById('greenSlider');
    const blueSlider = document.getElementById('blueSlider');
    const colorBox = document.getElementById('colorBox');
    const redValueElement = document.getElementById('redValue');
    const greenValueElement = document.getElementById('greenValue');
    const blueValueElement = document.getElementById('blueValue');
    const redValue = redSlider.value;
    const greenValue = greenSlider.value;
    const blueValue = blueSlider.value;

    redValueElement.textContent = redValue;
    greenValueElement.textContent = greenValue;
    blueValueElement.textContent = blueValue;

    const color = `rgb(${redValue},${greenValue},${blueValue})`;
    colorBox.style.backgroundColor = color;
    updateRGBLED(redValue, greenValue, blueValue);
}

function updateRGBLED(red, green, blue) {
    fetch('/rgb-led?red-value=' + red + '&green-value=' + green + '&blue-value=' + blue)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}





//------------------------------------------- Page Loading -------------------------------------------//

function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            hljs.highlightAll();

            if ((choice === 'beginner' && state == 3) ||
                (choice === 'beginner' && state == 5) ||
                (choice === 'advanced' && state == 1) ||
                (choice === 'advanced' && state == 4)) {

                initializeSlider();
            }
            

        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

function loadContent() {
    fetch('/get_data').then(response => response.json()).then(data => {
        
        state = data.state;
        choice = data.choice;

        nb_steps_advanced = data.nb_steps_advanced;
        nb_steps_beginner = data.nb_steps_beginner;
        console.log("nb_steps_advanced: " + nb_steps_advanced);
        if (data.state === 0) {
            console.log("current state is 0");
            document.getElementById("back_button").classList.add("disabled");
            document.getElementById("back_button").disabled = true;
            document.getElementById("next_button").classList.add("disabled");
            document.getElementById("next_button").disabled = true;
        } 
        else if (data.choice === 'beginner' && data.state == nb_steps_beginner) {
            document.getElementById("next_button").classList.add("disabled");
            document.getElementById("next_button").disabled = true;
            document.getElementById("back_button").classList.remove("disabled");
            document.getElementById("back_button").disabled = false;
        } else if (data.choice === 'advanced' && data.state == nb_steps_advanced) {
            document.getElementById("next_button").classList.add("disabled");
            document.getElementById("next_button").disabled = true;
            document.getElementById("back_button").classList.remove("disabled");
            document.getElementById("back_button").disabled = false;
        } else {
            document.getElementById("back_button").classList.remove("disabled");
            document.getElementById("back_button").disabled = false;
            document.getElementById("next_button").classList.remove("disabled");
            document.getElementById("next_button").disabled = false;
        }

        


        loadPage(data.page);

        
    });


    
}

window.onload = loadContent;
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