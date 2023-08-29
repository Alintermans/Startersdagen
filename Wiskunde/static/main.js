//------------------------------------------- Settings -------------------------------------------//
var state = 0;
var nb_steps = 1;

var caemra_on = false;

var profs = ['prof. Geraedts', 'prof. Van-Hamme', 'prof. Vandepitte', 'prof. Houssa', 'prof. Blanpain',  'prof. Vanmeensel', 'prof. Beernaert', 'prof. Van-Puyvelde',   'prof. Dehaene', 'prof. Moelans', 'prof. Anton',  'prof. Vandebril', 'prof. Baelmans', 'prof. Jacobs', 'prof. De-Laet', 'prof. Van-De-Walle', 'prof. Rijmen', 'prof. Smets', 'prof. Holvoet', 'prof. Vander-Sloten'];

var colors = ["#000000", "#ff0000", "#00ff00", "#0000ff",   "#00ffff", "#ff00ff", "#ffff00","#ffffff"];
var options = ["Koffie", "Koffie met suiker", "Koffie met melk en suiker", "Koffie met melk", "Thee", "Thee met melk", "Thee met melk en suiker", "Thee met suiker"];
var songs = ["'Riptide' Official Video.mp3", "Canon in D Major.mp3", "De Zji.mp3", "Eye Of The Tiger.mp3", "Feral Roots.mp3", "Hijo de la Luna (Videoclip).mp3", "Louis Neefs.mp3", "No One Knows.mp3", "Sultans Of Swing.mp3", "The Way To Your Heart.mp3", "Vuurwerk - Lyrics.mp3", "Where Is My Mind_.mp3", "yevgueni.mp3", "europe-the-final-countdown-official-video-9jK-NcRmVcw.mp3"];
var preferences_profs = {'prof. Geraedts': [6,"europe-the-final-countdown-official-video-9jK-NcRmVcw.mp3"], 'prof. Van-Hamme': [4, "No One Knows.mp3"], 'prof. Vandepitte': [2, "The Way To Your Heart.mp3"], 'prof. Houssa': [1, "Canon in D Major.mp3"], 'prof. Blanpain': [4, "Louis Neefs.mp3"],  'prof. Vanmeensel': [5, "yevgueni.mp3"], 'prof. Beernaert': [3, "Hijo de la Luna (Videoclip).mp3"], 'prof. Van-Puyvelde': [0, "Where Is My Mind_.mp3"],   'prof. Dehaene': [5, "Sultans Of Swing.mp3"], 'prof. Moelans': [3, "Canon in D Major.mp3"], 'prof. Anton': [0, "'Riptide' Official Video.mp3"],  'prof. Vandebril': [0, "Eye Of The Tiger.mp3"], 'prof. Baelmans': [5, "Hijo de la Luna (Videoclip).mp3"], 'prof. Jacobs': [0, "Vuurwerk - Lyrics.mp3"], 'prof. De-Laet': [5, "Feral Roots.mp3"], 'prof. Van-De-Walle': [3, "De Zji.mp3"], 'prof. Rijmen': [4, "yevgueni.mp3"], 'prof. Smets': [4, "Eye Of The Tiger.mp3"], 'prof. Holvoet': [3, "'Riptide' Official Video.mp3"], 'prof. Vander-Sloten': [3, "The Way To Your Heart.mp3"]};
var audio = false;

var savedOptions = [];
var savedColors = [];

var correctly_answered = false;


//------------------------------------------- Buttons -------------------------------------------//


    



function reset() {
    fetch('/reset')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
        caemra_on = false;
    });}


function next() {
    if ((state == 10) && (correctly_answered == false)) {
        alert("Please answer the questions first");
        return;
    }

    if (state == 12) {
        saveOptions();
    }
    if (state == 13) {
        if (!checkAllDifferent()) {
            return;
        }
        saveColors();
    }


    fetch('/next')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
        caemra_on = false;
    });}

function back() {
    if (state == 12) {
        saveOptions();
    }
    if (state == 13) {
        
        saveColors();
    }
    fetch('/back')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        loadContent();
        caemra_on = false;
        if (audio != false) {
            audio.pause();
        }
    });}

//------------------------------------------- Basic Face Recognition -------------------------------------------//

var fileInput = '';
var outputDiv = '';

function initializeAlgorithm() {
    
    fileInput = document.getElementById('fileInput');
    outputDiv = document.getElementById('output');  
    fileInput.addEventListener('change', handleFileSelect);      
}



function handleFileSelect(event) {
    const selectedFiles = event.target.files;
    outputDiv.innerHTML = ''; // Clear previous results
    console.log("hello")
    // Process each selected file
    for (const file of selectedFiles) {
        processImage(file);
    }
}

function processImage(file) {
    const image = new Image();
    image.onload = function () {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const resizedWidth = 115;
        const resizedHeight = 80;

        canvas.width = resizedWidth;
        canvas.height = resizedHeight;
        context.drawImage(image, 0, 0, resizedWidth, resizedHeight);
        const imageData = context.getImageData(0, 0, resizedWidth, resizedHeight);

        const grayscaleData = convertToGrayscale(imageData);
        const eigenface = calculateEigenface(grayscaleData);

        displayEigenface(eigenface);

        // Add interactivity to the displayed eigenface
        eigenfaceCanvas.addEventListener('click', () => {
            displayOriginalImage(image);
        });
    };

    image.src = URL.createObjectURL(file);
}

function convertToGrayscale(imageData) {
    const grayscaleData = new Uint8ClampedArray(imageData.width * imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const grayValue = 0.2989 * r + 0.587 * g + 0.114 * b;
        grayscaleData[i / 4] = grayValue;
    }

    return grayscaleData;
}

function calculateDeviationMatrix(grayscaleData, averageFace) {
    const deviationMatrix = [];

    for (let i = 0; i < grayscaleData.length; i++) {
        deviationMatrix.push(grayscaleData[i] - averageFace[i]);
    }

    return deviationMatrix;
}

function calculateEigenface(grayscaleData, averageFace) {
    const deviationMatrix = calculateDeviationMatrix(grayscaleData, averageFace);

    const covariance = math.multiply(deviationMatrix, math.transpose(deviationMatrix));
    const V = math.multiply(math.transpose(deviationMatrix), deviationMatrix);
    const { values, vectors } = math.eigs(V, 20); // Eigenvalues and eigenvectors

    const U = math.multiply(deviationMatrix, vectors, math.inv(math.sqrt(values)));

    // For demonstration purposes, we'll return a simple image data array
    // Replace this with your actual eigenface data processing
    const eigenfaceData = new Uint8ClampedArray(grayscaleData.length);

    for (let i = 0; i < grayscaleData.length; i++) {
        eigenfaceData[i] = Math.abs(U[i][0]); // Replace with your eigenface data
    }

    const eigenfaceImageData = new ImageData(eigenfaceData, grayscaleData.length, 1);

    return eigenfaceImageData;
}

function displayEigenface(eigenface) {
    const eigenfaceCanvas = document.createElement('canvas');
    eigenfaceCanvas.width = eigenface.width;
    eigenfaceCanvas.height = eigenface.height;
    const eigenfaceContext = eigenfaceCanvas.getContext('2d');
    eigenfaceContext.putImageData(eigenface, 0, 0);

    outputDiv.appendChild(eigenfaceCanvas);
}

function displayOriginalImage(image) {
    const originalImage = new Image();
    originalImage.src = image.src;

    outputDiv.innerHTML = ''; // Clear previous eigenface
    outputDiv.appendChild(originalImage);
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
            saveOptions();
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
    const divs_to_show = document.getElementsByClassName('correct_answer');

    if (q2.checked && q3.checked && q4.checked && !q1.checked && !q5.checked) {
        result.innerHTML = "<div class='correct'>Correct!</div>";
        for (var i = 0; i < divs_to_show.length; i++) {
            divs_to_show[i].style.display = "block";
        }
        correctly_answered = true;

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
        caemra_on = true;
    });
}

function stop_camera(){
    fetch('/stop_camera')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        caemra_on = false;
    });
}

function toggle_face_landmarks(){
    fetch('/face_landmarks')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

function toggle_face_recognition(){
    fetch('/face_recognition')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

function toggle_makeup(){  
    fetch('/makeup')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

function add_face(){
    const name = document.getElementById('add_face_name').value;
    fetch('/add_face?name=' + name)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

function detect_face(){
    const detected_prof = document.getElementById('detected_prof');
    const detected_color_box = document.getElementById('detected_color_box');
    const detected_song = document.getElementById('detected_song');
    const detected_option = document.getElementById('detected_option');
    if (caemra_on==false) {
        alert("Please start the camera first");
        return; 
    }
    fetch('/detect_face')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (profs.includes(data.result)) {
            console.log(preferences_profs[data.result]);
            detected_prof.innerHTML = `${data.result}`;
            const option = options[preferences_profs[data.result][0]];
            const colorIndex = savedColors.indexOf(option);
            const color = colors[colorIndex];
            detected_color_box.style.backgroundColor = color;
            detected_song.innerHTML = `${preferences_profs[data.result][1]}`;
            detected_option.innerHTML = `${options[preferences_profs[data.result][0]]}`;
            if (audio != false) {
                audio.pause();
            }
            audio = new Audio("/static/music/"+preferences_profs[data.result][1]);
            audio.play();
        } else {
            detected_prof.innerHTML = `Geen profesoor gedetecteerd, probeer opnieuw`;
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
            } else if (state == 13 && savedColors.length > 0) {
                loadColors();
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