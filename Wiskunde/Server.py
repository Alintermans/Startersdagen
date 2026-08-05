## Webserver voor het Wiskunde-deel (gezichtsherkenning).
##
## Deze versie is gemaakt om gehost te worden (bv. in een Docker container op
## Coolify) terwijl de studenten hun eigen laptop gebruiken:
##  - De camera draait in de browser van de student (getUserMedia). De browser
##    stuurt losse JPEG-frames naar /process_frame, de server verwerkt ze en
##    stuurt het bewerkte frame terug.
##  - De voortgang in de tutorial en de toegevoegde gezichten zijn per sessie
##    (per groepje), zodat meerdere groepen tegelijk kunnen werken zonder
##    elkaars stap of database te veranderen.
##
## Lokaal starten:   python Server.py         (http://localhost:3000)
## In productie:     gunicorn ... Server:app  (zie Dockerfile)
import os
import secrets
import uuid

import cv2
import numpy as np
from flask import Flask, Response, jsonify, render_template, request, session

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

# Encodings van toegevoegde gezichten zijn te groot voor de sessie-cookie en
# moeten gedeeld worden tussen de gunicorn workers, dus die staan per sessie
# in een klein bestand op schijf.
FACE_STORE_DIR = os.environ.get('FACE_STORE_DIR', os.path.join(BASE_DIR, 'face-store'))
os.makedirs(FACE_STORE_DIR, exist_ok=True)

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


def _session_id():
    sid = session.get('sid')
    if sid is None:
        sid = uuid.uuid4().hex
        session['sid'] = sid
    return sid


def _face_file(sid):
    return os.path.join(FACE_STORE_DIR, sid + '.npz')


def load_session_faces():
    path = _face_file(_session_id())
    if not os.path.isfile(path):
        return [], []
    data = np.load(path, allow_pickle=False)
    return list(data['encodings']), list(data['names'])


def save_session_faces(encodings, names):
    path = _face_file(_session_id())
    tmp_path = path + '.tmp'
    with open(tmp_path, 'wb') as f:
        np.savez(f, encodings=np.array(encodings), names=np.array(names))
    os.replace(tmp_path, path)


def _read_frame():
    data = request.get_data()
    if not data:
        return None
    frame = cv2.imdecode(np.frombuffer(data, dtype=np.uint8), cv2.IMREAD_COLOR)
    return frame


def _jpeg_response(frame):
    ret, buffer = cv2.imencode('.jpg', frame)
    return Response(buffer.tobytes(), mimetype='image/jpeg')


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
# De browser van de student stuurt JPEG-frames; de server verwerkt en antwoordt.

@app.route('/process_frame', methods=['POST'])
def process_frame():
    mode = request.args.get('mode', 'none')
    frame = _read_frame()
    if frame is None:
        return jsonify({'status': 'bad_frame'}), 400

    if mode == 'face_landmarks':
        frame = fr.annotate_landmarks(frame)
    elif mode == 'makeup':
        frame = fr.annotate_makeup(frame)
    elif mode == 'face_recognition':
        encodings, names = load_session_faces()
        frame = fr.recognize(frame, encodings, names)

    return _jpeg_response(frame)


@app.route('/add_face', methods=['POST'])
def add_face():
    name = request.args.get('name') or 'Onbekend'
    frame = _read_frame()
    if frame is None:
        return jsonify({'status': 'bad_frame'}), 400

    encoding = fr.encode_face(frame)
    if encoding is None:
        return jsonify({'status': 'no_face'})

    encodings, names = load_session_faces()
    encodings.append(encoding)
    names.append(name)
    save_session_faces(encodings, names)
    print(names)
    return jsonify({'status': 'ok'})


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
