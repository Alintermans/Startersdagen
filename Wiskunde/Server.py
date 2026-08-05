## Webserver voor het Wiskunde-deel (gezichtsherkenning).
##
## Deze versie is gemaakt om gehost te worden (bv. in een Docker container op
## Coolify) terwijl de studenten hun eigen laptop gebruiken:
##  - De camera én de live gezichtsherkenning draaien volledig in de browser
##    van de student (face-api.js in static/main.js), zodat de server niet
##    per frame moet rekenen en veel groepen tegelijk kunnen werken.
##  - Enkel het herkennen van de prof (pagina 13) gebeurt op de server met
##    dlib: één frame per klik op de knop, via POST /detect_face.
##  - De voortgang in de tutorial is per sessie (per groepje).
##
## Lokaal starten:   python Server.py         (http://localhost:3000)
## In productie:     gunicorn ... wsgi:app    (zie Dockerfile in de root)
import os
import secrets

import cv2
import numpy as np
from flask import Flask, jsonify, render_template, request, session

from FaceRecognition import FaceRecognition

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

nb_steps = 13


################################# Flask Server #############################################

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # max grootte van één frame


def _secret_key():
    # De sessies zitten in een cookie die ondertekend wordt met deze key. Alle
    # gunicorn workers moeten dezelfde key gebruiken, dus zet SECRET_KEY als
    # environment variabele of laat het hier eenmalig genereren in een bestand.
    key = os.environ.get('SECRET_KEY')
    if key:
        return key
    key_file = os.path.join(BASE_DIR, '.secret_key')
    try:
        with open(key_file) as f:
            key = f.read().strip()
            if key:
                return key
    except OSError:
        pass
    key = secrets.token_hex(32)
    try:
        with open(key_file, 'w') as f:
            f.write(key)
    except OSError:
        pass
    return key


app.secret_key = _secret_key()

print("Starting face recognition engine...")
fr = FaceRecognition()


################################# Sessie helpers ############################################

def get_state():
    return session.get('state', 0)


def set_state(state):
    session['state'] = state


def page_for(state):
    if state == 0:
        return 'home'
    return 'tutorial-' + str(state)


def _read_frame():
    data = request.get_data()
    if not data:
        return None
    frame = cv2.imdecode(np.frombuffer(data, dtype=np.uint8), cv2.IMREAD_COLOR)
    return frame


#########Pages############

@app.route('/')
def index():
    return render_template('index.html', data={'current_state': get_state()})

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


#########Data############

@app.route('/get_data')
def get_data():
    state = get_state()
    return jsonify({'page': page_for(state), 'state': state, 'nb_steps': str(nb_steps)})


@app.route('/next')
def next_step():
    state = min(get_state() + 1, nb_steps)
    set_state(state)
    return jsonify({'status': 'next'})


@app.route('/back')
def back():
    state = max(get_state() - 1, 0)
    set_state(state)
    return jsonify({'status': 'previous'})


@app.route('/reset')
def reset():
    set_state(0)
    return jsonify({'status': 'reset'})


@app.route('/rgb-led')
def rgb_led():
    # Op de oude opstelling stuurde dit een RGB-led aan via de Arduino. In de
    # gehoste versie is er geen Arduino, maar de slider op pagina 3 roept dit
    # nog aan, dus antwoord gewoon met ok.
    return jsonify({'status': 'ok'})


#########Camera############
# De live camera-effecten draaien in de browser; de server doet enkel de
# prof-herkenning met dlib, één frame per klik op de knop.

@app.route('/detect_face', methods=['POST'])
def detect_face():
    frame = _read_frame()
    if frame is None:
        return jsonify({'status': 'bad_frame'}), 400

    frame, prof = fr.recognize_prof(frame)
    return jsonify({'status': 'detect_face', 'result': str(prof)})


################################# Main #############################################

if __name__ == '__main__':
    print("Starting server...")
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3000)), debug=os.environ.get('FLASK_DEBUG') == '1')
