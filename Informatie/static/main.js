//------------------------------------------- Settings -------------------------------------------//
var state = 0;
var choice = 'None';
var nb_steps_advanced = 1;
var nb_steps_beginner = 1;
var sequtions_saved = false;



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
        if (data.status == 0) {
            alert("De Arduino is niet verbonden, gelieve de Arduino te verbinden en opnieuw te proberen");
        } 
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


function motor() {  
    fetch('/motor')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });}

function servo() {
    const servo_value = document.getElementById('servo-value');
    if (servo_value.value == '') {
        alert("Vul eerst een waarde in");
        return;
    }

    if (servo_value.value > 180) {
        alert("De waarde moet kleiner zijn dan 180");
        return;
    }

    if (servo_value.value < 0) {
        alert("De waarde moet groter zijn dan 0");
        return;
    }

    fetch('/servo?position=' + servo_value.value.toString())
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

//------------------------------------------- Pico -------------------------------------------//


function pico_changslider(input_value) {
    var value = parseInt(input_value);
    document.getElementById("slider_pico_value").textContent = (value*3.3/164).toFixed(2);
    send_pico_value(value);
  }


function send_pico_value(value) {
    if (value <= 164) {
        fetch('/pico_volt?value=' + value.toString())
        .then(response => response.json())
        .then(data => {
            console.log(data);
    });
    }
}

save_pico_value = function(value, index, input) {

    if (value > 3.3) {
        input.value = 3.3;
    }

    if (value < 0) {
        input.value = 0;
    }

    value = value * 164 / 3.3;
    value = Math.round(value);

    fetch('/pico_save_values?value=' + value.toString() + '&index=' + index.toString())
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });    


}

function loadVoltages() {
    fetch('/load-voltages')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        for (var i = 0; i < 15; i++) {
            document.getElementById("voltage_" + i.toString()).value = (data.voltages[i]*3.3/164).toFixed(2);
        }
    });
}



//------------------------------------------- Servo -------------------------------------------//

function addAngle(sequention) {
    var angle = document.createElement("input");
    angle.type = "number";
    angle.id = "sequention-" + sequention + "-angle-" + document.getElementById("sequention-" + sequention).childElementCount;
    angle.min = "0";
    angle.max = "180";
    angle.value = "90";
    document.getElementById("sequention-" + sequention).appendChild(angle);
}

function removeAngle(sequention) {
    if (document.getElementById("sequention-" + sequention).childElementCount > 1) {
        document.getElementById("sequention-" + sequention).removeChild(document.getElementById("sequention-" + sequention).lastChild);
    }
}

function saveSequentions() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < document.getElementById("sequention-" + i).childElementCount; j++) {
            if((document.getElementById("sequention-" + i + "-angle-" + j).value) < 0 || (document.getElementById("sequention-" + i + "-angle-" + j).value) > 180) {
                alert("De hoek moet tussen 0 en 180 liggen");
                return;
            }
        }
    }

    picked_names = [];

    for (var i = 0; i < 4; i++) {
        if (document.getElementById("sequention-" + i + "-name").value in picked_names) {
            alert("Eén kleur per optie!");}
        picked_names.push(document.getElementById("sequention-" + i + "-name").value);
    }

    var sequentions = [];
    for (var i = 0; i < 4; i++) {
        var sequention = {
            name: document.getElementById("sequention-" + i + "-name").value,
            angles: []
        }
        for (var j = 0; j < document.getElementById("sequention-" + i).childElementCount; j++) {
            sequention.angles.push(document.getElementById("sequention-" + i + "-angle-" + j).value);
        }
        sequentions.push(sequention);
    }
    fetch('/save-sequentions?sequentions=' + JSON.stringify(sequentions))
    .then(response => response.json())
    .then(data => {
        console.log(data);
        sequtions_saved = true;
        document.getElementById("saveSequentionsMessage").textContent = "Sequenties opgeslagen";
        setTimeout(function(){
            document.getElementById("saveSequentionsMessage").textContent = " Opslaan";
            document.getElementById('saveSequentionsMessage').style.opacity = 0;
            document.getElementById('saveSequentionsMessage').style.opacity = 1;
        }
        , 3000);

    });

}

function loadSequentions() {
    fetch('/load-sequentions')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        for (var i = 0; i < 15; i++) {
            document.getElementById("sequention-" + i + "-name").value = data.sequentions[i].name;
            for (var j = 0; j < data.sequentions[i].angles.length; j++) {
                if (j == 0) {
                    document.getElementById("sequention-" + i + "-angle-" + j).value = data.sequentions[i].angles[j];
                } else {
                    addAngle(i);
                    document.getElementById("sequention-" + i + "-angle-" + j).value = data.sequentions[i].angles[j];
                }
            }
        }
        sequtions_saved = data.sequentions_saved;
    });
}

function runSequention(sequention) {
    if (sequtions_saved == false) {
        alert("Sla eerst de sequenties op");
        return;
    }

    fetch('/run-sequention?sequention=' + sequention)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

//------------------------------------------- Test Sequence -------------------------------------------//
function test() {
    const detected_color_combination = document.getElementById('detected-color-combination-test');
    const button = document.getElementById('testButton');


    detected_color_combination.textContent = "";
    button.disabled = true;
    button.classList.add("disabled");

    fetch('/test')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        detected_color_combination.textContent = data.detected_color_combination;
        button.disabled = false;
        button.classList.remove("disabled");
    });
}

function runColorBox() {
    var colorBox = document.getElementById('colorBoxTest');
    var colorCombination = document.getElementById('colorCombination');

    var firstColor = 'black';
    var secondColor = 'black';

    if (colorCombination.value == 0) {
        firstColor = 'black';
        secondColor = 'black';
    } else if (colorCombination.value == 1) {
        firstColor = 'black';
        secondColor = 'red';
    } else if (colorCombination.value == 2) {
        firstColor = 'black';
        secondColor = 'blue';
    } else if (colorCombination.value == 3) {
        firstColor = 'black';
        secondColor = 'green';
    } else if (colorCombination.value == 4) {
        firstColor = 'black';
        secondColor = 'white';
    } else if (colorCombination.value == 5) {
        firstColor = 'red';
        secondColor = 'red';
    } else if (colorCombination.value == 6) {
        firstColor = 'red';
        secondColor = 'blue';
    } else if (colorCombination.value == 7) {
        firstColor = 'red';
        secondColor = 'green';
    } else if (colorCombination.value == 8) {
        firstColor = 'red';
        secondColor = 'white';
    } else if (colorCombination.value == 9) {
        firstColor = 'blue';
        secondColor = 'blue';
    } else if (colorCombination.value == 10) {
        firstColor = 'blue';
        secondColor = 'green';
    } else if (colorCombination.value == 11) {
        firstColor = 'blue';
        secondColor = 'white';
    } else if (colorCombination.value == 12) {
        firstColor = 'green';
        secondColor = 'green';
    } else if (colorCombination.value == 13) {
        firstColor = 'green';
        secondColor = 'white';
    } else if (colorCombination.value == 14) {
        firstColor = 'white';
        secondColor = 'white';
    }

    // For 20 seconds display the first color for 1 second and the second color for 1 second
    var i = 0;
    document.getElementById("colorBoxBtn").disabled = true;
    document.getElementById("colorBoxBtn").classList.add("disabled");

    var interval = setInterval(function() {
        if (i % 2 == 0) {
            colorBox.style.backgroundColor = firstColor;
        } else {
            colorBox.style.backgroundColor = secondColor;
        }
        i++;
        if (i == 20) {
            clearInterval(interval);
            document.getElementById("colorBoxBtn").disabled = false;
            document.getElementById("colorBoxBtn").classList.remove("disabled");
            colorBox.style.backgroundColor = '#f9f9f9';
        }
    }, 1000);
     

}

//------------------------------------------- Run -------------------------------------------//
function run(){
    const red_value = document.getElementById('detected-red-value');
    const green_value = document.getElementById('detected-green-value');
    const blue_value = document.getElementById('detected-blue-value');
    const detected_color = document.getElementById('detected-color');
    const detected_name = document.getElementById('detected-name');
    const button = document.getElementById('runButton');

    red_value.textContent = "";
    green_value.textContent = "";
    blue_value.textContent = "";
    detected_color.textContent = "";
    detected_name.textContent = "";
    button.disabled = true;
    button.classList.add("disabled");


    fetch('/run')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        red_value.textContent = data.red_value;
        green_value.textContent = data.green_value;
        blue_value.textContent = data.blue_value;
        detected_color.textContent = data.detected_color;
        detected_name.textContent = data.name;
        button.disabled = false;
        button.classList.remove("disabled");
    }
    );


}

//------------------------------------------- Color Sensor -------------------------------------------//

function detectColor() {
    const red_value = document.getElementById('detected-red-value');
    const green_value = document.getElementById('detected-green-value');
    const blue_value = document.getElementById('detected-blue-value');
    const detected_color = document.getElementById('detected-color');
    const button = document.getElementById('detectColorButton');
    
    red_value.textContent = "";
        green_value.textContent = "";
        blue_value.textContent = "";
        detected_color.textContent = "";
        button.disabled = true;
        button.classList.add("disabled");


    fetch('/detect-color')
    .then(response => response.json())
    .then(data => {
        red_value.textContent = data.red_value;
        green_value.textContent = data.green_value;
        blue_value.textContent = data.blue_value;
        detected_color.textContent = data.detected_color;
        button.disabled = false;
        button.classList.remove("disabled");
    }); 
}

function getSensorValues() {
    

    for (let i = 0; i < 5; i++) {
        const red_value = document.getElementById('red-value-' + i.toString());
        const green_value = document.getElementById('green-value-' + i.toString());
        const blue_value = document.getElementById('blue-value-' + i.toString());
        

        fetch('/get-sensor-color-values?color=' + i.toString())
        .then(response => response.json())
        .then(data => {
            if (data.red_value < 10000 && data.green_value  < 10000 && data.blue_value  < 10000) {
            red_value.value = data.red_value;
            green_value.value = data.green_value;
            blue_value.value = data.blue_value;

            }
            console.log(data);
        });
    }
}

function updateSensorValues(color) {
    const red_value = document.getElementById('red-value-' + color.toString());
    const green_value = document.getElementById('green-value-' + color.toString());
    const blue_value = document.getElementById('blue-value-' + color.toString());
    const detect_color_button = document.getElementById('detectColorButton');
    const color_form_info = document.getElementById('colorFormInfo');

    if (red_value.value == '' || green_value.value == '' || blue_value.value == '') {
        alert("Vul alle waardes eerst in voor deze kleur");
        return;
    }

    if (red_value.value >= 10000 || green_value.value >= 10000 || blue_value.value >= 10000) {
        alert("De waardes moeten kleiner zijn dan 10000");
        return;
    }

    detect_color_button.disabled = true;
    detect_color_button.classList.add("disabled");
    fetch('/change-sensor-color-values?color=' + color.toString() + '&red-value=' + red_value.value.toString() + '&green-value=' + green_value.value.toString() + '&blue-value=' + blue_value.value.toString())
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getSensorValues();
        detect_color_button.disabled = false;
        detect_color_button.classList.remove("disabled");
        color_form_info.textContent = "De waardes zijn aangepast";
        setTimeout(function(){ 

            color_form_info.textContent = "";
        }, 3000);
    });     
}


function alignColorRows() {
    var rows = document.querySelectorAll('.colorRow');
    
    var h3Widths = Array.from(rows).map(function (row) {
        return row.querySelector('h3').getBoundingClientRect().width;
    });

    var inputWidths = Array.from(rows[0].querySelectorAll('.inputContainer')).map(function (input) {
        return input.getBoundingClientRect().width;
    });

    rows.forEach(function (row) {
        var h3 = row.querySelector('h3');
        h3.style.width = Math.max(...h3Widths) + 'px';
        
        var inputs = row.querySelectorAll('.inputContainer');
        inputs.forEach(function (input, index) {
            input.style.width = inputWidths[index] + 'px';
        });
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
                (choice === 'beginner' && state == 9) ||
                (choice === 'advanced' && state == 1) ||
                (choice === 'advanced' && state == 4)) {

                initializeSlider();
            }

            if ((choice === 'beginner' && state == 5) ) {
                getSensorValues();
                alignColorRows();
            }

            if ((choice === 'beginner' && state == 7) ) {
                loadSequentions();
            }

            if ((choice === 'beginner' && state == 8) ) {
                loadVoltages();
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