import threading
from flask import Flask, render_template, jsonify, Response, request
import serial 
import time 

################################# Global Variables #############################################


################################# Arduino #############################################

arduino = serial.Serial(port='/dev/cu.usbmodem141101',   baudrate=230400, timeout=0.01)


def write_read(x):
    arduino.write(bytes(x,   'utf-8'))
    print("Wrote: " + x)
    time.sleep(0.05)
    data = arduino.readline()
    print("Read: " + data.decode('utf-8'))
    return   data



################################# Flask Server #############################################

app = Flask(__name__)    # Create Flask app


def run_server():
    app.run(host='0.0.0.0', port=3000)

# Flask route to display device data
@app.route('/')
def index():
    global values
    return render_template('index.html')

@app.route('/turn_on')  
def turn_on():
    write_read('0\n')
    return jsonify({'status': 'on'})

@app.route('/turn_off')  
def turn_off():
    write_read('1\n')
    return jsonify({'status': 'off  '})





################################# Main #############################################

if __name__ == '__main__':
    print("Starting...")
    # Create and start the thread to sample data
    # data_thread = threading.Thread(target=sample_data)
    # data_thread.start()
    
    # Create and start the thread to run Flask web server
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
