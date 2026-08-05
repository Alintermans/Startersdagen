//------------------------------------------- Settings -------------------------------------------//
var state = 0;
var nb_steps = 1;

var caemra_on = false;

var profs = ['prof. Beernaert', 'prof. De-Laet', 'prof. Van-Hamme', 'prof. Van-Puyvelde', 'prof. Vander-Sloten', 'prof. Vandebril', 'prof. Rijmen', 'prof. Vansteenwegen', 'prof. Vanmeensel', 'prof. Smets', 'prof. Geraedts', 'prof. Jacobs', 'prof. Dehaene']

var colors = ["#000000", "#ff0000", "#00ff00", "#0000ff",   "#00ffff", "#ff00ff", "#ffff00","#ffffff"];
var options = ["Koffie", "Koffie met suiker", "Koffie met melk en suiker", "Koffie met melk", "Thee", "Thee met melk", "Thee met melk en suiker", "Thee met suiker"];
var songs = ["'Riptide' Official Video.mp3", "Canon in D Major.mp3", "De Zji.mp3", "Eye Of The Tiger.mp3", "Feral Roots.mp3", "Hijo de la Luna (Videoclip).mp3", "Louis Neefs.mp3", "No One Knows.mp3", "Sultans Of Swing.mp3", "The Way To Your Heart.mp3", "Vuurwerk - Lyrics.mp3", "Where Is My Mind_.mp3", "yevgueni.mp3", "europe-the-final-countdown-official-video-9jK-NcRmVcw.mp3"];
var preferences_profs = {'prof. Geraedts': [2,"europe-the-final-countdown-official-video-9jK-NcRmVcw.mp3"], 'prof. Van-Hamme': [0, "No One Knows.mp3"], 'prof. Vandepitte': [3, "The Way To Your Heart.mp3"], 'prof. Houssa': [1, "Canon in D Major.mp3"], 'prof. Blanpain': [4, "Louis Neefs.mp3"],  'prof. Vanmeensel': [0, "yevgueni.mp3"], 'prof. Beernaert': [3, "Hijo de la Luna (Videoclip).mp3"], 'prof. Van-Puyvelde': [0, "Where Is My Mind_.mp3"],   'prof. Dehaene': [3, "Sultans Of Swing.mp3"], 'prof. Moelans': [3, "Canon in D Major.mp3"], 'prof. Anton': [0, "'Riptide' Official Video.mp3"],  'prof. Vandebril': [0, "Eye Of The Tiger.mp3"], 'prof. Baelmans': [2, "Hijo de la Luna (Videoclip).mp3"], 'prof. Jacobs': [0, "Vuurwerk - Lyrics.mp3"], 'prof. De-Laet': [2, "Feral Roots.mp3"], 'prof. Van-De-Walle': [3, "De Zji.mp3"], 'prof. Rijmen': [1, "yevgueni.mp3"], 'prof. Smets': [0, "Eye Of The Tiger.mp3"], 'prof. Holvoet': [3, "'Riptide' Official Video.mp3"], 'prof. Vander-Sloten': [3, "The Way To Your Heart.mp3"], 'prof. Vanmeensel': [3, "The Way To Your Heart.mp3"]};
var audio = false;

var savedOptions = [];
var savedColors = [];

var correctly_answered = false;
var correct_answered_q2 = false;


//------------------------------------------- Buttons -------------------------------------------//


    



function reset() {
    fetch('reset')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
        stop_camera();
    });}


function next() {
    if ((state == 8) && (correctly_answered == false)) {
        alert("Please answer the questions first");
        return;
    }

    if ((state == 10) && (correct_answered_q2 == false)) {
        alert("Please answer the questions first");
        return;
    }

    if (state == 12) {
        if (!checkEveryThirdOptionIsDifferent()) {
            return;
        }
        saveOptions();
    }
    // if (state == 11) {
    //     if (!checkAllDifferent()) {
    //         return;
    //     }
    //     saveColors();
    // }


    fetch('next')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
        stop_camera();
    });}

function back() {
    if (state == 12) {
        saveOptions();
    }
    // if (state == 11) {
        
    //     saveColors();
    // }
    fetch('back')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
        stop_camera();
        if (audio != false) {
            audio.pause();
        }
    });}

//------------------------------------------- Basic Face Recognition -------------------------------------------//
var current_step = 0;
const numebr_of_steps_alg = 5;

function initializeAlgorithm() {
    const first_canvas = document.getElementById('cnv_alg_0');
    const second_canvas = document.getElementById('cnv_alg_1');
    const third_canvas = document.getElementById('cnv_alg_2');
    const fourth_canvas = document.getElementById('cnv_alg_3');
    const fifth_canvas = document.getElementById('cnv_alg_4');

    var image = new Image();
    image.src = 'static/images/JVDS.png';
    image.onload = function () {
        first_canvas.width = image.width;
        first_canvas.height = image.height;
        const ctx = first_canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }

    var image2 = new Image();
    image2.src = 'static/images/JVDS_crop.png';
    image2.onload = function () {
        second_canvas.width = image2.width;
        second_canvas.height = image2.height;
        const ctx = second_canvas.getContext('2d');
        ctx.drawImage(image2, 0, 0);
    }

    var image3 = new Image();
    image3.src = 'static/images/JVDS_grey.png';
    image3.onload = function () {
        third_canvas.width = image3.width;
        third_canvas.height = image3.height;
        const ctx = third_canvas.getContext('2d');
        ctx.drawImage(image3, 0, 0);
    }

    var image4 = new Image();
    image4.src = 'static/images/average_face.png';
    image4.onload = function () {
        fourth_canvas.width = image4.width;
        fourth_canvas.height = image4.height;
        const ctx = fourth_canvas.getContext('2d');
        ctx.drawImage(image4, 0, 0);
    }

    var image5 = new Image();
    image5.src = 'static/images/JVDS_diff.png';
    image5.onload = function () {
        fifth_canvas.width = image5.width;
        fifth_canvas.height = image5.height;
        const ctx = fifth_canvas.getContext('2d');
        ctx.drawImage(image5, 0, 0);
    }

}

function reset_alg() {
    const current_div = document.getElementById('alg-'+current_step);
    current_div.style.display = "none";
    current_step = 0;
    const first_div = document.getElementById('alg-0');
    first_div.style.display = "flex";
    const next_button = document.getElementById('next_step_alg_btn');
        next_button.classList.remove("disabled");
        next_button.disabled = false;
    
}

function next_step_alg() {
    if (current_step == numebr_of_steps_alg) {
        return;
    }
    const current_div = document.getElementById('alg-'+current_step); 
    const next_div = document.getElementById('alg-'+(current_step+1));
    current_div.style.display = "none";
    next_div.style.display = "flex";
    current_step += 1;

    if (current_step == numebr_of_steps_alg) {
        const next_button = document.getElementById('next_step_alg_btn');
        next_button.classList.add("disabled");
        next_button.disabled = true;
    }

}

function alg_crop_and_scale() {
    const first_canvas = document.getElementById('cnv_alg_0');

    var image = new Image();
    image.src = 'static/images/JVDS_crop.png';
    image.onload = function () {
        first_canvas.width = image.width;
        first_canvas.height = image.height;
        const ctx = first_canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }
}

var in_grey = false;
function alg_to_grey() {
    const second_canvas = document.getElementById('cnv_alg_1');
    var image = new Image();
    if (in_grey) {
        image.src = 'static/images/JVDS_crop.png';
        in_grey = false;
    } else {
        image.src = 'static/images/JVDS_grey.png';
        in_grey = true;
    }
    
    image.onload = function () {
        second_canvas.width = image.width;
        second_canvas.height = image.height;
        const ctx = second_canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }
    


}

var in_mean = false;
function alg_to_mean() {
    const third_canvas = document.getElementById('cnv_alg_2');
    var image = new Image();
    
    if (in_mean) {
        image.src = 'static/images/JVDS_grey.png';
        in_mean = false;
    } else {
        image.src = 'static/images/average_face.png';
        in_mean = true;
    }
    image.onload = function () {
        third_canvas.width = image.width;
        third_canvas.height = image.height;
        const ctx = third_canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }
}
var in_diff = false;
function alg_to_diff() {
    const fourth_canvas = document.getElementById('cnv_alg_3');
    var image = new Image();
    if (in_diff) {
        image.src = 'static/images/average_face.png';
        in_diff = false;
    } else {
    image.src = 'static/images/JVDS_diff.png';
    in_diff = true;
    }

    image.onload = function () {
        fourth_canvas.width = image.width;
        fourth_canvas.height = image.height;
        const ctx = fourth_canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }


}

var in_eigen = false;
function alg_to_eigenfaces() {
    const fifth_canvas = document.getElementById('cnv_alg_4');
    var image = new Image();
    if(in_eigen) {
        image.src = 'static/images/JVDS_diff.png';
        in_eigen = false;
    } else {
        image.src = 'static/images/eigenface_0.png';
        in_eigen = true;
    }
    image.onload = function () {
        fifth_canvas.width = image.width;
        fifth_canvas.height = image.height;
        const ctx = fifth_canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }
}

function alg_compare() {
    const clostest_match = document.getElementById('closest_match');
    const clostest_matches = document.getElementById('closest_matches');

    clostest_match.style.display = "block";
    clostest_matches.style.display = "block";

}


//------------------------------------------- RGB-to-grey-values -------------------------------------------//

function convert_to_grey() {
    const redPercentageInput = document.getElementById('redPercentage');
    const greenPercentageInput = document.getElementById('greenPercentage');
    const bluePercentageInput = document.getElementById('bluePercentage');
    const outputCanvas = document.getElementById('outputCanvas');
    const outputCanvas2 = document.getElementById('outputCanvas2');
    const ctx = outputCanvas.getContext('2d');
    const ctx2 = outputCanvas2.getContext('2d');
    const redPercentage = parseFloat(redPercentageInput.value);
    const greenPercentage = parseFloat(greenPercentageInput.value);
    const bluePercentage = parseFloat(bluePercentageInput.value);

    if (isNaN(redPercentage) || isNaN(greenPercentage) || isNaN(bluePercentage)) {
        alert('Onjuiste percentage waardes.');
        return;
    }

    if (redPercentage < 0 || redPercentage > 1) {
        alert('De roodwaarde moet tussen 0 en 1 liggen.');
        return;
    }

    if (greenPercentage < 0 || greenPercentage > 1) {
        alert('De groenwaarde moet tussen 0 en 1 liggen.');
        return;
    }

    if (bluePercentage < 0 || bluePercentage > 1) {
        alert('De blauwwaarde moet tussen 0 en 1 liggen.');
        return;
    }

    

    const image = new Image();
    const image2 = new Image();
    image.src = 'static/images/RGB.png';
    image2.src = 'static/images/Times-Square-New-York.jpeg';


    image.onload = function () {
        outputCanvas.width = image.width;
        outputCanvas.height = image.height;

        outputCanvas2.width = image2.width;
        outputCanvas2.height = image2.height;

        ctx.drawImage(image, 0, 0);
        ctx2.drawImage(image2, 0, 0);

        const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
        const data = imageData.data;

        const imageData2 = ctx2.getImageData(0, 0, outputCanvas2.width, outputCanvas2.height);
        const data2 = imageData2.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const grayscaleValue = Math.round(redPercentage * r + greenPercentage * g + bluePercentage * b);

            if (grayscaleValue > 255) {
                greyscaleValue = 255;
            }


            data[i] = grayscaleValue;
            data[i + 1] = grayscaleValue;
            data[i + 2] = grayscaleValue;
        }

        for (let i = 0; i < data2.length; i += 4) {
            const r = data2[i];
            const g = data2[i + 1];
            const b = data2[i + 2];

            const grayscaleValue = Math.round(redPercentage * r + greenPercentage * g + bluePercentage * b);

            if (grayscaleValue > 255) {
                greyscaleValue = 255;
            }

            data2[i] = grayscaleValue;
            data2[i + 1] = grayscaleValue;
            data2[i + 2] = grayscaleValue;
        }



        ctx.putImageData(imageData, 0, 0);
        ctx2.putImageData(imageData2, 0, 0);
    };
}

//------------------------------------------- Save Colors -------------------------------------------//
function checkAllDifferent() {
    const colorsDiv = document.getElementById('color_select_div');
    const selectColors = colorsDiv.querySelectorAll('select');
    const selectedColors = [];
    selectColors.forEach(select => {
        selectedColors.push(select.value);
    });
    const unique = [...new Set(selectedColors)];
    if (unique.length != selectColors.length) {
        alert("Je hebt twee dezelfde opties geselecteerd voor twee kleuren, probeer opnieuw!");
        return false;
    }
    return true;
}


function saveColors() {
    const colorsDiv = document.getElementById('color_select_div');
    savedColors = [];
    const selectColors = colorsDiv.querySelectorAll('select');
    selectColors.forEach(select => {
        savedColors.push(select.value);
    });
    console.log(savedColors);
}

function downloadColors() {
    if (!checkAllDifferent()) {
        return;
    }

    const colorsDiv = document.getElementById('color_select_div');
    const selectColors = colorsDiv.querySelectorAll('select');
    const colors = [];
    selectColors.forEach(select => {
        colors.push(select.value);
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(colors));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "Database.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function uploadColorsAndOptions() {
    const colorsDiv = document.getElementById('color_select_div');
    const selectColors = colorsDiv.querySelectorAll('select');
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        if (file.type != "application/json") {
            alert("Het lijk erop dat je een verkeerd bestand hebt geupload, probeer opnieuw!");
            return;
        }
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            const data = JSON.parse(content);
            if (!data.hasOwnProperty("colors") || !data.hasOwnProperty("options") || data.colors.length != selectColors.length) {
                alert("Het lijk erop dat je een verkeerd bestand hebt geupload, probeer opnieuw!");
                return;
            }
            selectColors.forEach((select, index) => {
                select.value = data.colors[index];
            });
            saveColors();
            
            savedOptions = data.options;
            //saveOptions();
        }
    }
    input.click();
}

function downloadColorsAndOptions() {
    if (!checkAllDifferent()) {
        return;
    }

    const colorsDiv = document.getElementById('color_select_div');
    const selectColors = colorsDiv.querySelectorAll('select');
    const colors = [];
    selectColors.forEach(select => {
        colors.push(select.value);
    });

    
    if (savedOptions.length == 0) {
        alert("Je hebt nog geen opties geselecteerd, probeer opnieuw!");
        return;
    }
    
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({colors: colors, options: savedOptions}));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "Database.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function loadColors() {
    const colorsDiv = document.getElementById('color_select_div');
    
    const selectColors = colorsDiv.querySelectorAll('select');
    selectColors.forEach((select, index) => {
        select.value = savedColors[index];
    });
}


//------------------------------------------- Save options -------------------------------------------//


function saveOptions() {
    const optionsDiv = document.getElementById('profs_div');
    const selectOptions = optionsDiv.querySelectorAll('select');
    savedOptions = [];
    selectOptions.forEach(select => {
        savedOptions.push(select.value);
    });
    console.log(savedOptions);
}

function loadOptions() {
    const optionsDiv = document.getElementById('profs_div');
    const selectOptions = optionsDiv.querySelectorAll('select');

    selectOptions.forEach((select, index) => {
        select.value = savedOptions[index];
    });
}

function checkEveryThirdOptionIsDifferent() {
    const optionsDiv = document.getElementById('profs_div');
    const selectOptions = optionsDiv.querySelectorAll('select');
    const selectedOptions = [];
    selectOptions.forEach(select => {
        selectedOptions.push(select.value);
    });
    const filteredOptions = [];
    for (let i = 2; i < selectedOptions.length; i += 3) {
        filteredOptions.push(selectedOptions[i]);
    }
    const unique = [...new Set(filteredOptions)];
    if (unique.length != filteredOptions.length) {
        alert("Je hebt twee dezelfde opties geselecteerd voor twee kleuren, probeer opnieuw!");
        return false;
    }
    return true;
}
        



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
    picture.src = "static/images/scale-"+blackSlider.value+".jpg";
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
    fetch('rgb-led?red-value=' + red + '&green-value=' + green + '&blue-value=' + blue)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

//------------------------------------------- FinalColorBox -------------------------------------------//
function runColorBox(colorCombination) {
    var colorBox = document.getElementById('detected_color_box');

    var firstColor = 'black';
    var secondColor = 'black';

    console.log("Color combination: " + colorCombination);

    if (colorCombination == 0) {
        firstColor = 'black';
        secondColor = 'black';
    } else if (colorCombination == 1) {
        firstColor = 'black';
        secondColor = 'red';
    } else if (colorCombination == 2) {
        firstColor = 'black';
        secondColor = 'blue';
    } else if (colorCombination == 3) {
        firstColor = 'black';
        secondColor = '#00FF00';
    } else if (colorCombination == 4) {
        firstColor = 'black';
        secondColor = 'white';
    } else if (colorCombination == 5) {
        firstColor = 'red';
        secondColor = 'red';
    } else if (colorCombination == 6) {
        firstColor = 'red';
        secondColor = 'blue';
    } else if (colorCombination == 7) {
        firstColor = 'red';
        secondColor = '#00FF00';
    } else if (colorCombination == 8) {
        firstColor = 'red';
        secondColor = 'white';
    } else if (colorCombination == 9) {
        firstColor = 'blue';
        secondColor = 'blue';
    } else if (colorCombination == 10) {
        firstColor = 'blue';
        secondColor = '#00FF00';
    } else if (colorCombination == 11) {
        firstColor = 'blue';
        secondColor = 'white';
    } else if (colorCombination == 12) {
        firstColor = '#00FF00';
        secondColor = '#00FF00';
    } else if (colorCombination == 13) {
        firstColor = '#00FF00';
        secondColor = 'white';
    } else if (colorCombination == 14) {
        firstColor = 'white';
        secondColor = 'white';
    }

    // For 20 seconds display the first color for 1 second and the second color for 1 second
    var i = 0;
    document.getElementById("btn_detect_face").disabled = true;
    document.getElementById("btn_detect_face").classList.add("disabled");

    var interval = setInterval(function() {
        if (i % 2 == 0) {
            colorBox.style.backgroundColor = firstColor;
        } else {
            colorBox.style.backgroundColor = secondColor;
        }
        i++;
        if (i == 20) {
            clearInterval(interval);
            document.getElementById("btn_detect_face").disabled = false;
            document.getElementById("btn_detect_face").classList.remove("disabled");
            colorBox.style.backgroundColor = '#f9f9f9';
        }
    }, 1000);
     

}

//------------------------------------------- small quiz -------------------------------------------//
function check_q1() {
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');
    const q4 = document.getElementById('q4');
    const q5 = document.getElementById('q5');
    const result = document.getElementById('result_q1');
    const divs_to_show = document.getElementsByClassName('correct_answer');

    if (q2.checked && q3.checked && q4.checked && !q1.checked && !q5.checked) {
        result.innerHTML = "<div class='correct'>Correct!</div>";
        for (var i = 0; i < divs_to_show.length; i++) {
            divs_to_show[i].style.display = "block";
        }
        correctly_answered = true;

    } else {
        result.innerHTML = "<div class='incorrect'>Fout! probeer opnieuw</div>";
        for (var i = 0; i < divs_to_show.length; i++) {
            divs_to_show[i].style.display = "block";
        }
        correctly_answered = true;
    }
    q1.checked = false;
    q2.checked = false;
    q3.checked = false;
    q4.checked = false;
    q5.checked = false;


}

function check_q2() {
    const q1 = document.getElementById('q1');
    const q2 = document.getElementById('q2');
    const q3 = document.getElementById('q3');

    const result = document.getElementById('result_q2');

    if (q1.checked && q2.checked && !q3.checked) {
        result.innerHTML = "<div class='correct'>Correct!</div>";
        correct_answered_q2 = true;
    } else {
        result.innerHTML = "<div class='incorrect'>Fout! probeer opnieuw</div>";
        correct_answered_q2 = false;
    }
    q1.checked = false;
    q2.checked = false;
    q3.checked = false;
}




//------------------------------------------- Camera -------------------------------------------//
// De camera én de gezichtsherkenning draaien volledig in de browser van de
// student (face-api.js), zodat de server niet per frame moet rekenen. Enkel
// het herkennen van de prof (pagina 13) gebeurt op de server: één frame per
// klik op de knop.
var localStream = null;
var camVideo = null;
var camCanvas = null;
var currentMode = 'none';
var modelsLoaded = false;
var localFaces = [];        // gezichten die de studenten zelf toevoegen: {name, descriptor}
var lastResult = null;      // laatste detectieresultaat, getekend door drawLoop

const camSleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const FACE_MATCH_THRESHOLD = 0.6;

function getCamVideo() {
    if (!camVideo) {
        camVideo = document.createElement('video');
        camVideo.setAttribute('playsinline', '');
        camVideo.muted = true;
    }
    return camVideo;
}

function captureFrame() {
    const video = getCamVideo();
    if (!camCanvas) {
        camCanvas = document.createElement('canvas');
    }
    camCanvas.width = video.videoWidth || 640;
    camCanvas.height = video.videoHeight || 480;
    camCanvas.getContext('2d').drawImage(video, 0, 0, camCanvas.width, camCanvas.height);
    return camCanvas;
}

function captureFrameBlob() {
    return new Promise(resolve => captureFrame().toBlob(resolve, 'image/jpeg', 0.8));
}

async function ensureModels() {
    if (modelsLoaded) {
        return;
    }
    const url = 'static/models';
    await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(url),
        faceapi.nets.faceLandmark68Net.loadFromUri(url),
        faceapi.nets.faceRecognitionNet.loadFromUri(url),
    ]);
    modelsLoaded = true;
}

function detectorOptions() {
    return new faceapi.TinyFaceDetectorOptions({inputSize: 320, scoreThreshold: 0.4});
}

// Zelfde formule als in FaceRecognition.py zodat de getoonde percentages
// overeenkomen met de oude (server-)versie.
function faceConfidence(distance) {
    const range = 1.0 - FACE_MATCH_THRESHOLD;
    const linearVal = (1.0 - distance) / (range * 2.0);
    if (distance > FACE_MATCH_THRESHOLD) {
        return (linearVal * 100).toFixed(2) + '%';
    }
    const value = (linearVal + ((1.0 - linearVal) * Math.pow((linearVal - 0.5) * 2, 0.2))) * 100;
    return value.toFixed(2) + '%';
}

async function detectLoop() {
    while (caemra_on) {
        if (currentMode === 'none') {
            lastResult = null;
            await camSleep(100);
            continue;
        }
        try {
            if (currentMode === 'face_recognition') {
                lastResult = await faceapi.detectAllFaces(camVideo, detectorOptions()).withFaceLandmarks().withFaceDescriptors();
            } else {
                lastResult = await faceapi.detectAllFaces(camVideo, detectorOptions()).withFaceLandmarks();
            }
        } catch (error) {
            console.log(error);
            lastResult = null;
            await camSleep(300);
        }
        await camSleep(30);
    }
}

function drawLoop() {
    if (!caemra_on) {
        return;
    }
    const canvas = document.getElementById('video_feed');
    if (!canvas) {
        stop_camera();
        return;
    }
    const video = getCamVideo();
    if (video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (lastResult && currentMode !== 'none') {
            drawOverlays(ctx, lastResult, currentMode);
        }
    }
    requestAnimationFrame(drawLoop);
}

// Indeling van de 68 gezichtspunten (zelfde als dlib)
const LANDMARK_GROUPS = [
    {from: 0, to: 16, closed: false},   // kaaklijn
    {from: 17, to: 21, closed: false},  // linkerwenkbrauw
    {from: 22, to: 26, closed: false},  // rechterwenkbrauw
    {from: 27, to: 30, closed: false},  // neusbrug
    {from: 31, to: 35, closed: false},  // onderkant neus
    {from: 36, to: 41, closed: true},   // linkeroog
    {from: 42, to: 47, closed: true},   // rechteroog
    {from: 48, to: 59, closed: true},   // buitenrand lippen
    {from: 60, to: 67, closed: true},   // binnenrand lippen
];

function tracePoints(ctx, points, closed) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    if (closed) {
        ctx.closePath();
    }
}

function strokePoints(ctx, points, closed, color, width) {
    if (points.length < 2) {
        return;
    }
    tracePoints(ctx, points, closed);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

function fillPoints(ctx, points, color) {
    if (points.length < 3) {
        return;
    }
    tracePoints(ctx, points, true);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawOverlays(ctx, results, mode) {
    for (const result of results) {
        const landmarks = result.landmarks ? result.landmarks.positions : null;
        if (mode === 'face_landmarks' && landmarks) {
            for (const group of LANDMARK_GROUPS) {
                strokePoints(ctx, landmarks.slice(group.from, group.to + 1), group.closed, '#00ff00', 4);
            }
        } else if (mode === 'makeup' && landmarks) {
            drawMakeup(ctx, landmarks);
        } else if (mode === 'face_recognition') {
            drawRecognition(ctx, result);
        }
    }
}

function drawMakeup(ctx, pts) {
    // Zelfde punt-indeling voor de lippen als de face_recognition library
    const topLip = [48, 49, 50, 51, 52, 53, 54, 64, 63, 62, 61, 60].map(i => pts[i]);
    const bottomLip = [54, 55, 56, 57, 58, 59, 48, 60, 67, 66, 65, 64].map(i => pts[i]);
    const leftBrow = pts.slice(17, 22);
    const rightBrow = pts.slice(22, 27);
    const leftEye = pts.slice(36, 42);
    const rightEye = pts.slice(42, 48);

    // Wenkbrauwen
    fillPoints(ctx, leftBrow, 'rgb(68, 54, 39)');
    fillPoints(ctx, rightBrow, 'rgb(68, 54, 39)');
    strokePoints(ctx, leftBrow, true, 'rgb(68, 54, 39)', 5);
    strokePoints(ctx, rightBrow, true, 'rgb(68, 54, 39)', 5);

    // Lippen
    fillPoints(ctx, topLip, 'rgb(150, 0, 0)');
    fillPoints(ctx, bottomLip, 'rgb(150, 0, 0)');
    strokePoints(ctx, topLip, true, 'rgb(150, 0, 0)', 8);
    strokePoints(ctx, bottomLip, true, 'rgb(150, 0, 0)', 8);

    // Ogen wit met eyeliner
    fillPoints(ctx, leftEye, '#ffffff');
    fillPoints(ctx, rightEye, '#ffffff');
    strokePoints(ctx, leftEye, true, '#000000', 6);
    strokePoints(ctx, rightEye, true, '#000000', 6);
}

function drawRecognition(ctx, result) {
    const box = result.detection.box;
    let name = 'Unknown';
    let confidence = '100.0';
    if (localFaces.length > 0 && result.descriptor) {
        let best = null;
        for (const face of localFaces) {
            const distance = faceapi.euclideanDistance(face.descriptor, result.descriptor);
            if (best === null || distance < best.distance) {
                best = {name: face.name, distance: distance};
            }
        }
        name = best.name;
        confidence = faceConfidence(best.distance);
    }
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(box.x, box.y + box.height - 35, box.width, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText(name + ' (' + confidence + ')', box.x + 6, box.y + box.height - 10);
}

function showCameraOffImage() {
    const canvas = document.getElementById('video_feed');
    if (!canvas) {
        return;
    }
    const image = new Image();
    image.src = 'static/images/camera_uit.jpg';
    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0);
    }
}

async function start_camera(){
    const start_camera_button = document.getElementById('start_camera_btn');
    if (caemra_on) {
        return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("De camera werkt enkel via een beveiligde (https) verbinding. Vraag een begeleider om hulp.");
        return;
    }
    start_camera_button.classList.add("disabled");
    start_camera_button.disabled = true;
    try {
        await ensureModels();
        localStream = await navigator.mediaDevices.getUserMedia({
            video: {width: {ideal: 640}, height: {ideal: 480}},
            audio: false
        });
        const video = getCamVideo();
        video.srcObject = localStream;
        await video.play();
        caemra_on = true;
        currentMode = 'none';
        detectLoop();
        drawLoop();
    } catch (error) {
        console.log(error);
        alert("De camera kon niet gestart worden. Geef je browser toestemming om de camera te gebruiken en probeer opnieuw.");
    }
    start_camera_button.classList.remove("disabled");
    start_camera_button.disabled = false;
}

function stop_camera(){
    caemra_on = false;
    currentMode = 'none';
    lastResult = null;
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    if (camVideo) {
        camVideo.srcObject = null;
    }
    showCameraOffImage();
}

function toggle_mode(mode){
    if (!caemra_on) {
        alert("Start eerst de camera!");
        return;
    }
    currentMode = (currentMode === mode) ? 'none' : mode;
}

function toggle_face_landmarks(){
    toggle_mode('face_landmarks');
}

function toggle_face_recognition(){
    toggle_mode('face_recognition');
}

function toggle_makeup(){
    toggle_mode('makeup');
}

async function add_face(){
    const name = document.getElementById('add_face_name').value;
    if (!caemra_on) {
        alert("Start eerst de camera!");
        return;
    }
    const detection = await faceapi.detectSingleFace(camVideo, detectorOptions()).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
        alert("Er werd geen gezicht gevonden. Kijk recht in de camera en probeer opnieuw!");
        return;
    }
    localFaces.push({name: name, descriptor: detection.descriptor});
    console.log(localFaces.map(face => face.name));
}

async function detect_face(){
    const detected_prof = document.getElementById('detected_prof');
    if (caemra_on==false) {
        alert("Please start the camera first");
        return;
    }
    const blob = await captureFrameBlob();
    fetch('detect_face', {
        method: 'POST',
        headers: {'Content-Type': 'image/jpeg'},
        body: blob
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (profs.includes(data.result)) {
            result = data.result;
            if (data.result == "prof. Geraedts") {
                result = "Dr. Geraedts";
            }
            const index = profs.indexOf(data.result);
            const color = savedOptions[index*3+2];
            detected_prof.innerHTML = `${result}`;

            runColorBox(parseInt(color));
            // const option = options[preferences_profs[data.result][0]];
            // const colorIndex = savedColors.indexOf(option);
            // const color = colors[colorIndex];
            // detected_color_box.style.backgroundColor = color;
            // detected_song.innerHTML = `${preferences_profs[data.result][1]}`;
            // detected_option.innerHTML = `${options[preferences_profs[data.result][0]]}`;
            // if (audio != false) {
            //     audio.pause();
            // }
            // audio = new Audio("/static/music/"+preferences_profs[data.result][1]);
            // audio.play();
        } else {
            detected_prof.innerHTML = `Geen professor gedetecteerd, probeer opnieuw`;
            detected_color_box.style.backgroundColor = "#AAAAAA";
            detected_song.innerHTML = `None`;
            detected_option.innerHTML = `None`;
        }
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
            } else if (state == 4) {
                convert_to_grey();
            } else if (state == 6) {
                initializeAlgorithm();
            }
            
            else if (state == 12 && savedOptions.length > 0) {
                loadOptions();
            } 
            // Hook for tutorial 12: attach quad-click autofill on first image
            if (state == 12) {
                attachTutorial12Autofill();
            }
            // Camera-pagina's: toon de "camera uit"-afbeelding op het canvas
            if (state == 11 || state == 13) {
                showCameraOffImage();
            }
            // else if (state == 11 && savedColors.length > 0) {
            //     loadColors();
            // }

        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}

function loadContent() {
    fetch('get_data').then(response => response.json()).then(data => {
        
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

//------------------------------------------- Tutorial-12 helpers -------------------------------------------//
function attachTutorial12Autofill() {
    const trigger = document.getElementById('prof-beernaert-img');
    if (!trigger) return; // not on page yet

    // Prevent duplicate listeners if navigating back to step 12
    if (trigger.__autofillBound) return;
    trigger.__autofillBound = true;

    let clicks = 0;
    let resetTimer = null;
    const resetAfterMs = 500;

    function resetCounter() {
        clicks = 0;
        if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
    }

    function scheduleReset() {
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(resetCounter, resetAfterMs);
    }

    function fillCombos() {
        const combos = ['0','1','2','3','5','6','7','8','9','11','12','13','14'];
        const selects = document.querySelectorAll('#profs_div select#sequention-0-color-combination');
        selects.forEach(function(sel, i) {
            sel.value = combos[i % combos.length];
            sel.dispatchEvent(new Event('change'));
        });
    }

    trigger.addEventListener('click', function() {
        clicks += 1;
        if (clicks >= 4) {
            fillCombos();
            resetCounter();
            return;
        }
        scheduleReset();
    });
}
