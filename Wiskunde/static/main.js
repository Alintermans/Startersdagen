//------------------------------------------- Settings -------------------------------------------//
var state = 0;
var nb_steps = 1;



//------------------------------------------- Buttons -------------------------------------------//


    



function reset() {
    fetch('/reset')
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





//------------------------------------------- Latex -------------------------------------------//

function update_math() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}


//------------------------------------------- PICTURE SLIDER --------------------------------------//
var currentPicture = 0;

function initializePicture() {
    const blackSlider = document.getElementById('blackSlider');
    blackSlider.addEventListener('input', updatePicture);
    currentPicture = blackSlider.value;
    updatePicture();
}

function updatePicture() {
    const values = ['20x15', '40x30', '80x60', '160x120', '320x240', '640x480']
    const blackSlider = document.getElementById('blackSlider');
    const blackValueElement = document.getElementById('blackValue');
    const blackValue = values[blackSlider.value];
    const picture = document.getElementById('picture_resolution_img');
    picture.src = "/static/images/scale-"+blackSlider.value+".jpg";
    blackValueElement.textContent = blackValue;

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

//------------------------------------------- small quiz -------------------------------------------//
function check_q1() {
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');
    const q4 = document.getElementById('q4');
    const q5 = document.getElementById('q5');
    const result = document.getElementById('result_q1');

    if (q2.checked && q3.checked && q4.checked && !q1.checked && !q5.checked) {
        result.innerHTML = "<div class='correct'>Correct!</div>";
    } else {
        result.innerHTML = "<div class='incorrect'>Fout! probeer opnieuw</div>";
    }
    q1.checked = false;
    q2.checked = false;
    q3.checked = false;
    q4.checked = false;
    q5.checked = false;


}




//------------------------------------------- Camera -------------------------------------------//
function start_camera(){
    fetch('/start_camera')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

function stop_camera(){
    fetch('/stop_camera')
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
            update_math();
            if (state == 2) {
                initializePicture();
            }
            else if ( state == 3) {
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

        nb_steps = data.nb_steps;

        if (data.state === 0) {
            console.log("current state is 0");
            document.getElementById("back_button").classList.add("disabled");
            document.getElementById("back_button").disabled = true;
            document.getElementById("next_button").classList.remove("disabled");
            document.getElementById("next_button").disabled = false;
        } else if (data.state == data.nb_steps) {
            document.getElementById("back_button").classList.remove("disabled");
            document.getElementById("back_button").disabled = false;
            document.getElementById("next_button").classList.add("disabled");
            document.getElementById("next_button").disabled = true;
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