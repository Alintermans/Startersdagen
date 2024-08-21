import threading
from flask import Flask, render_template, jsonify, Response, request
import serial 
from serial.tools import list_ports
import time 
import sys
import cv2
from FaceRecognition import FaceRecognition


################################# Global Variables ######################################
current_state = 0
current_page = 'home' 

nb_steps = 12

retries = 0 

camera = None
camera_on = False
fr = None
current_camera_choice = 'None'
add_face_name = None
adding_face = False
recognized_prof = None

camera_ready = False





################################# Flask Server #############################################

app = Flask(__name__)    # Create Flask app


def run_server():
    app.run(host='0.0.0.0', port=3000, debug=True)    # Run Flask web server (HTTP

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

@app.route('/tutorial-12')
def tutorial_12():
    return render_template('tutorial-12.html')

@app.route('/tutorial-13')
def tutorial_13():
    return render_template('tutorial-13.html')

@app.route('/tutorial-14')
def tutorial_14():
    return render_template('tutorial-14.html')





#########Data############

@app.route('/get_data')
def get_data():
    return jsonify({'page': current_page, 'state': current_state,  'nb_steps': str(nb_steps)})


@app.route('/next')
def next():
    global current_state
    global current_page
    global current_camera_choice
    global camera_on
    current_state += 1
    if  current_state > nb_steps:
        current_state = nb_steps
    else:
        current_page = 'tutorial-' + str(current_state)
    if camera_on:
        stop_camera()
        current_camera_choice = 'None'
        camera_on = False

    return jsonify({'status': 'next'})

@app.route('/back')
def back():
    global current_state
    global current_page
    global current_camera_choice
    global camera_on
    current_state -= 1
    if current_state == 0:
        current_choice = 'None'
        current_page = 'home'
    else:
        current_page = 'tutorial-' + str(current_state)
    if camera_on:
        stop_camera()
        current_camera_choice = 'None'
        camera_on = False
    return jsonify({'status': 'previous'})


@app.route('/reset')
def reset():
    global current_page
    global current_state
    current_state = 0
    current_page = 'home'
    return jsonify({'status': 'reset'})

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_camera')
def start_camera_route():
    global camera_ready
    camera_ready = False
    start_camera()
    while not camera_ready:
        time.sleep(0.1)
    return jsonify({'status': 'started'})

@app.route('/stop_camera')
def stop_camera_route():
    stop_camera()
    return jsonify({'status': 'stopped'})

@app.route('/face_landmarks')
def face_landmarks():
    global current_camera_choice
    if current_camera_choice == 'face_landmarks':
        current_camera_choice = 'None'
    else:
        current_camera_choice = 'face_landmarks'
    return jsonify({'status': 'face_landmarks'})

@app.route('/makeup')
def makeup():
    global current_camera_choice
    if current_camera_choice == 'makeup':
        current_camera_choice = 'None'
    else:
        current_camera_choice = 'makeup'
    return jsonify({'status': 'makeup'})

@app.route('/face_recognition')
def face_recognition():
    global current_camera_choice
    if current_camera_choice == 'face_recognition':
        current_camera_choice = 'None'
    else:
        current_camera_choice = 'face_recognition'
    return jsonify({'status': 'face_recognition'})


@app.route('/add_face')
def add_face():
    global adding_face
    global add_face_name
    name = request.args.get('name')
    if not adding_face:
        add_face_name = name
        adding_face = True
        return jsonify({'status': 'started'})
    else:
        return jsonify({'status': 'failed'})

@app.route('/detect_face')
def detect_face():
    global current_camera_choice
    global current_state
    global recognized_prof
    recognized_prof = None
    current_camera_choice = 'recognize_prof'
    while recognized_prof == None:
        time.sleep(0.1)
    result = recognized_prof
    recognized_prof = None
    return jsonify({'status': 'detect_face', 'result': result})

    
    




################################# Camera #############################################
def start_camera():
    global camera
    global camera_on
    if not camera_on:
        camera = cv2.VideoCapture(0)
        #camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        #camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        time.sleep(1.5)
        camera_on = True

def stop_camera():
    global camera
    global camera_on
    if camera_on:
        camera_on = False
        time.sleep(0.5)
        camera.release()
        global current_camera_choice
        current_camera_choice = 'None'

def gen_frames():  
    global adding_face
    global add_face_name
    global recognized_prof
    global current_camera_choice
    global camera_ready
    while current_state == 8 or current_state == 12 or current_state == 11 or current_state == 10 or current_state == 9:
        if camera_on:
            time.sleep(0.02)
            try:
                success, frame = camera.read()  # read the camera frame
            except:
                break
            if not success:
                break
            else:
                try: 
                    camera_ready = True
                    if adding_face:
                        fr.add_face(frame, add_face_name)
                        adding_face = False
                        add_face_name = None
                    if current_camera_choice == 'face_landmarks':
                        frame = fr.process_frame_with_facial_features(frame)
                    elif current_camera_choice == 'makeup':
                        frame = fr.process_frame_with_makeup(frame)
                    elif current_camera_choice == 'face_recognition':
                        frame = fr.process_frame(frame)
                    elif current_camera_choice == 'recognize_prof':
                        frame = fr.process_frame_with_prof(frame)
                        frame = fr.process_frame_with_prof(frame)
                        recognized_prof = fr.prof_found
                        current_camera_choice = 'None'

                    ret, buffer = cv2.imencode('.jpg', frame)
                    frame = buffer.tobytes()
                    yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result
                except:
                    break
        else:
            img = cv2.imread('static/images/camera_uit.jpg')
            ret, buffer = cv2.imencode('.jpg', img)
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
    img = cv2.imread('static/images/camera_uit.jpg')
    ret, buffer = cv2.imencode('.jpg', img)
    frame = buffer.tobytes()
    yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')



################################# Face Recognition - Neuralnet #############################################




################################# Main #############################################

if __name__ == '__main__':
    print("Starting...")
    # Create and start the thread to sample data
    # data_thread = threading.Thread(target=sample_data)
    # data_thread.start()

    print("Starting face recognition engine...")
    fr = FaceRecognition()

    print("Starting server...")

    # Create and start the thread to run Flask web server
    # server_thread = threading.Thread(target=run_server)
    # server_thread.start()
    run_server()



