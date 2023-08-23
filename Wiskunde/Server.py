import threading
from flask import Flask, render_template, jsonify, Response, request
import serial 
from serial.tools import list_ports
import time 
import sys

################################# Global Variables ######################################
current_state = 0
current_page = 'home' 

arduino_connected = False

nb_steps = 7

retries = 0 







################################# Flask Server #############################################

app = Flask(__name__)    # Create Flask app


def run_server():
    app.run(host='0.0.0.0', port=80)

# Flask route to display device data

#########Pages############

@app.route('/')
def index():
    return render_template('index.html', data= {'current_state': current_state})

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/tutorial-1')
def tutorial_1():
    return render_template('tutorial-1.html')

@app.route('/tutorial-2')
def tutorial_2():
    return render_template('tutorial-2.html')

@app.route('/tutorial-3')
def tutorial_3():
    return render_template('tutorial-3.html')

@app.route('/tutorial-4')
def tutorial_4():
    return render_template('tutorial-4.html')

@app.route('/tutorial-5')
def tutorial_5():
    return render_template('tutorial-5.html')

@app.route('/tutorial-6')
def tutorial_6():
    return render_template('tutorial-6.html')

@app.route('/tutorial-7')
def tutorial_7():
    return render_template('tutorial-7.html')

@app.route('/tutorial-8')
def tutorial_8():
    return render_template('tutorial-8.html')

@app.route('/tutorial-9')
def tutorial_9():
    return render_template('tutorial-9.html')

@app.route('/tutorial-10')
def tutorial_10():
    return render_template('tutorial-10.html')

@app.route('/tutorial-11')
def tutorial_11():
    return render_template('tutorial-11.html')



#########Data############

@app.route('/get_data')
def get_data():
    return jsonify({'page': current_page, 'state': current_state,  'nb_steps': str(nb_steps)})


@app.route('/next')
def next():
    global current_state
    global current_page

    current_state += 1
    if  current_state > nb_steps:
        current_state = nb_steps
    else:
        current_page = 'tutorial-' + str(current_state)

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




################################# Main #############################################

if __name__ == '__main__':
    print("Starting...")
    # Create and start the thread to sample data
    # data_thread = threading.Thread(target=sample_data)
    # data_thread.start()

    print("Starting server...")

    # Create and start the thread to run Flask web server
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
