import threading
from flask import Flask, render_template, jsonify, Response, request
import serial 
import time 

################################# Global Variables ######################################
current_state = 0
current_choice = 'None' # 'None', 'beginner', 'advanced'
current_page = 'home' # 'home', 'game', 'settings'

nb_steps_advanced = 6
nb_steps_beginner = 5

retries = 0 



################################# Arduino #############################################

arduino = serial.Serial(port='/dev/cu.usbmodem141101',   baudrate=230400, timeout=0.01)


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
    time.sleep(0.05)
    data = arduino.readline().decode('utf-8')
    data = data.split('/')
    if(len(data) == 5):
        color = int(data[0])
        red = int(data[1])
        green = int(data[2])
        blue = int(data[3])
        retries = 0
        print(data)
        result = (color, red, green, blue)
        return result
    else:
        retries += 1
        if retries > 10:
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


################################# Main #############################################

if __name__ == '__main__':
    print("Starting...")
    # Create and start the thread to sample data
    # data_thread = threading.Thread(target=sample_data)
    # data_thread.start()
    
    # Create and start the thread to run Flask web server
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
