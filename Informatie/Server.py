import threading
from flask import Flask, render_template, jsonify, Response, request
import serial 
import time 

################################# Global Variables ######################################
current_state = 0
current_choice = 'None' # 'None', 'beginner', 'advanced'
current_page = 'home' # 'home', 'game', 'settings'

nb_steps_advanced = 7
nb_steps_beginner = 8

retries = 0 

sequentions = [{"name": "Koffie", "angles": ["90"]}, {"name": "Thee", "angles": ["90"]},{"name": "Koffie met suiker", "angles": ["90"]}, {"name": "Thee met suiker", "angles": ["90"]},{"name": "Koffie met melk", "angles": ["90"]}, {"name": "Thee met melk", "angles": ["90"]},{"name": "Koffie met melk en suiker", "angles": ["90"]}, {"name": "Thee met melk en suiker", "angles": ["90"]}]

sequentions_saved = False



################################# Arduino #############################################

arduino = serial.Serial(port='/dev/cu.usbmodem142101',   baudrate=230400, timeout=0.01)
#arduino = ""

def write_read(x):
    global retries
    arduino.flush()
    arduino.write(bytes(x,   'utf-8'))
    print("Wrote: " + x)
    time.sleep(0.05)
    data = arduino.readline()
    if len(data.decode('utf-8').split('/')) >1:
        if retries > 5:
            retries = 0
            return "ERROR"
        time.sleep(0.1)
        return write_read(x)
    print("Read: " + data.decode('utf-8'))
    if(int(data.decode('utf-8')) == len(x)):
        retries = 0
        return "OK"
    else:
        
        retries += 1
        if retries > 5:
            retries = 0
            return "ERROR"
        write_read(x)

def send_detect_color_request():
    global retries
    x = 'DC\n'
    arduino.write(bytes(x,   'utf-8'))
    print("Wrote: " + x)
    time.sleep(0.1)
    data = arduino.readline().decode('utf-8')
    data = data.split('/')
    print(data)
    if(len(data) == 5 or (len(data) > 5 and data[4] == '3\r\n')):
        color = int(data[0])
        red = int(data[1])
        green = int(data[2])
        blue = int(data[3])
        retries = 0
        
        result = (color, red, green, blue)
        return result
    else:
        retries += 1
        if retries > 4:
            retries = 0
            return "ERROR", "ERROR", "ERROR", "ERROR"
        time.sleep(0.1)
        send_detect_color_request()



################################# Flask Server #############################################

app = Flask(__name__)    # Create Flask app


def run_server():
    app.run(host='0.0.0.0', port=3000)

# Flask route to display device data
@app.route('/')
def index():
    return render_template('index.html', data= {'current_state': current_state, 'current_choice': current_choice})

@app.route('/get_data')
def get_data():
    return jsonify({'page': current_page, 'state': current_state, 'choice': current_choice, 'nb_steps_advanced': str(nb_steps_advanced), 'nb_steps_beginner': str(nb_steps_beginner)})


@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/turn_on')  
def turn_on():
    write_read('L1\n')
    return jsonify({'status': 'on'})

@app.route('/turn_off')  
def turn_off():

    write_read('L0\n')
    return jsonify({'status': 'off  '})

@app.route('/next')
def next():
    global current_state
    global current_page

    current_state += 1
    if current_choice == 'beginner' and current_state > nb_steps_beginner:
        current_state = nb_steps_beginner
    else:
        current_page = current_choice + '-' + str(current_state)

    return jsonify({'status': 'next'})

@app.route('/back')
def back():
    global current_state
    global current_choice
    global current_page
    current_state -= 1
    if current_state == 0:
        current_choice = 'None'
        current_page = 'home'
    else:
        current_page = current_choice + '-' + str(current_state)
    return jsonify({'status': 'previous'})


@app.route('/reset')
def reset():
    global current_choice
    global current_page
    global current_state
    current_state = 0
    current_choice = 'None'
    current_page = 'home'
    return jsonify({'status': 'reset'})

@app.route('/beginner')
def beginner():
    global current_choice
    global current_page
    global current_state
    current_choice = 'beginner'
    current_page = 'beginner-1'
    current_state = 1
    return jsonify({'status': '1'})

@app.route('/advanced')
def advanced():
    global current_choice
    global current_page
    global current_state
    current_choice = 'advanced'
    current_page = 'advanced-1'
    current_state = 1
    return jsonify({'status': '1'})

@app.route('/beginner-1')
def beginner_1():
    return render_template('beginner-1.html')

@app.route('/beginner-2')
def beginner_2():
    return render_template('beginner-2.html')

@app.route('/beginner-3')
def beginner_3():
    return render_template('beginner-3.html')

@app.route('/beginner-4')
def beginner_4():
    return render_template('beginner-4.html')

@app.route('/beginner-5')
def beginner_5():
    return render_template('beginner-5.html')

@app.route('/beginner-6')
def beginner_6():
    return render_template('beginner-6.html')

@app.route('/beginner-7')
def beginner_7():
    return render_template('beginner-7.html')

@app.route('/beginner-8')
def beginner_8():
    return render_template('beginner-8.html')

@app.route('/advanced-1')
def advanced_1():
    return render_template('advanced-1.html')

@app.route('/advanced-2')
def advanced_2():
    return render_template('advanced-2.html')

@app.route('/advanced-3')
def advanced_3():
    return render_template('advanced-3.html')

@app.route('/advanced-4')
def advanced_4():
    return render_template('advanced-4.html')

@app.route('/advanced-5')
def advanced_5():
    return render_template('advanced-5.html')

@app.route('/advanced-6')
def advanced_6():
    return render_template('advanced-6.html')

@app.route('/advanced-7')
def advanced_7():
    return render_template('advanced-7.html')

## Servo sequuntions

@app.route('/save-sequentions')
def save_sequentions():
    global sequentions
    sequentions = request.args.get('sequentions')
    sequentions = eval(sequentions)
    global sequentions_saved
    sequentions_saved = True
    return jsonify({'status': 'save-sequentions'})

@app.route('/load-sequentions')
def get_sequentions():
    global sequentions
    return jsonify({'status': 'get-sequentions', 'sequentions': sequentions, 'sequentions_saved': sequentions_saved})


@app.route('/run-sequention')
def run_sequention():
    sequention = request.args.get('sequention')
    run_sequention(sequention)
    return jsonify({'status': 'run-sequention'})

@app.route('/test')
def test():
    global retries
    result = send_detect_color_request()
    while result == None:
        if retries > 5:
            retries = 0
            return jsonify({'status': 'detect-color', 'detected_color': 'ERROR', 'red_value': 'ERROR', 'green_value': 'ERROR', 'blue_value': 'ERROR'})
        time.sleep(0.1)
        retries += 1
        result = send_detect_color_request()
    color = result[0]
    red = result[1]
    green = result[2]
    blue = result[3]
    retries = 0
    run_sequention(color)
    return jsonify({'status': 'detect-color', 'detected_color': int_color_to_string(color), 'red_value': red, 'green_value': green, 'blue_value': blue})
    

##Arduino commands
@app.route('/rgb-led')
def rgb_led():
    red_value = int(request.args.get('red-value'))
    green_value = int(request.args.get('green-value'))
    blue_value = int(request.args.get('blue-value'))
    response = write_read(rgb_int_to_string_of_9_charachters(red_value, green_value, blue_value))
    return jsonify({'status': 'rgb-led'})

@app.route('/led')
def led():
    write_read('OL\n')
    return jsonify({'status': 'led'})


@app.route('/detect-color')
def detect_color():
    global retries
    result = send_detect_color_request()
    while result == None:
        if retries > 5:
            retries = 0
            return jsonify({'status': 'detect-color', 'detected_color': 'ERROR', 'red_value': 'ERROR', 'green_value': 'ERROR', 'blue_value': 'ERROR'})
        time.sleep(0.1)
        retries += 1
        result = send_detect_color_request()
    color = result[0]
    red = result[1]
    green = result[2]
    blue = result[3]
    retries = 0
    return jsonify({'status': 'detect-color', 'detected_color': int_color_to_string(color), 'red_value': red, 'green_value': green, 'blue_value': blue})

@app.route('/change-sensor-color-values')
def change_sensor_color_values():
    color = int(request.args.get('color'))
    red = int(request.args.get('red-value'))
    green = int(request.args.get('green-value'))
    blue = int(request.args.get('blue-value'))
    change_color(color, red, green, blue)
    return jsonify({'status': 'change-sensor-color-values'})

@app.route('/get-sensor-color-values')
def get_sensor_color_values():
    color = int(request.args.get('color'))
    if (color == 0):
        red = zwart[0]
        green = zwart[1]
        blue = zwart[2]
    elif (color == 1):
        red = rood[0]
        green = rood[1]
        blue = rood[2]
    elif (color == 2):
        red = groen[0]
        green = groen[1]
        blue = groen[2]
    elif (color == 3):
        red = blauw[0]
        green = blauw[1]
        blue = blauw[2]
    elif (color == 4):
        red = licht_blauw[0]
        green = licht_blauw[1]
        blue = licht_blauw[2]
    elif (color == 5):
        red = roos[0]
        green = roos[1]
        blue = roos[2]
    elif (color == 6):
        red = geel[0]
        green = geel[1]
        blue = geel[2]
    elif (color == 7):
        red = wit[0]
        green = wit[1]
        blue = wit[2]
    else:
        print("Error: color not found")
    return jsonify({'status': 'get-sensor-color-values', 'red_value': red, 'green_value': green, 'blue_value': blue})

@app.route('/motor')
def motor():
    write_read('M\n')
    return jsonify({'status': 'motor'})

@app.route('/servo')
def servo():
    position = int(request.args.get('position'))
    write_read('S' + position_int_to_3_charachters(position) + '\n')
    return jsonify({'status': 'servo'})


################################# Color Sensor #############################################

# zwart = (4500, 7000, 6500)
# rood = (400, 1800, 1100)
zwart = (20000, 20000,20000)
rood = (20000, 20000, 20000)
groen = (750, 500, 800)
blauw = (3000, 1700, 700)
licht_blauw = (700, 500, 500)
roos = (400, 700, 500)
geel = (400, 500, 450)
wit = (400, 500, 450)

def change_color(color, red, green, blue):
    global zwart
    global rood
    global groen
    global blauw
    global licht_blauw
    global roos
    global geel
    global wit

    if (color == 0):
        zwart = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 1):
        rood = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 2):
        groen = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 3):
        blauw = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 4):
        licht_blauw = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 5):
        roos = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 6):
        geel = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    elif (color == 7):
        wit = (red, green, blue)
        write_read(rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue))
    else:
        print("Error: color not found")
    
    

################################# Servo #############################################
def run_sequention(sequention): 
    sequention = int(sequention)
    time.sleep(1)
    for angle in sequentions[sequention]["angles"]:
        write_read('S' + position_int_to_3_charachters(int(angle)) + '\n')
        time.sleep(1)
    


################################# Helper Functions #############################################
def rgb_int_to_string_of_9_charachters(red, green, blue):
    red = str(red)
    green = str(green)
    blue = str(blue)
    while len(red) < 3:
        red = '0' + red
    while len(green) < 3:
        green = '0' + green
    while len(blue) < 3:
        blue = '0' + blue
    return 'L' + red + green + blue + '\n'

def rgb_int_to_string_of_12_charachters_for_changing_sensor_values(color, red, green, blue):
    red = str(red)
    green = str(green)
    blue = str(blue)
    color = str(color)
    while len(red) < 4:
        red = '0' + red
    while len(green) < 4:
        green = '0' + green
    while len(blue) < 4:
        blue = '0' + blue
    return 'C' + color + red + green + blue + '\n'
    
def int_color_to_string(color):
    if color == 0:
        return 'Zwart'
    elif color == 1:
        return 'Rood'
    elif color == 2:
        return 'Groen'
    elif color == 3:
        return 'Blauw'
    elif color == 4:
        return 'Licht Blauw'
    elif color == 5:
        return 'Roze'
    elif color == 6:
        return 'Geel'
    elif color == 7:
        return 'Wit'
    else:
        return 'Geen idee'

def position_int_to_3_charachters(position):
    position = str(position)
    while len(position) < 3:
        position = '0' + position
    return position

################################# Main #############################################

if __name__ == '__main__':
    print("Starting...")
    # Create and start the thread to sample data
    # data_thread = threading.Thread(target=sample_data)
    # data_thread.start()
    
    # Create and start the thread to run Flask web server
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
