## Gezichtsherkenning op basis van dlib / face_recognition.
## Deze klasse is stateless per verzoek: elke methode verwerkt één frame.
## De gezichten die studenten zelf toevoegen worden per sessie bijgehouden in
## Server.py en meegegeven aan recognize().
import math
import os

import cv2
import face_recognition
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def face_confidence(face_distance, face_match_threshold=0.6):
    range = (1.0 - face_match_threshold)
    linear_val = (1.0 - face_distance) / (range * 2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_val * 100, 2)) + "%"

    else:
        value = (linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return str(round(value, 2)) + "%"


class FaceRecognition:
    face_match_threshold = 0.6
    known_names = ['prof. Geraedts', 'prof. Van-Hamme', 'prof. Vandepitte', 'prof. Houssa', 'prof. Blanpain',  'prof. Vanmeensel', 'prof. Beernaert', 'prof. Van-Puyvelde',   'prof. Dehaene', 'prof. Moelans', 'prof. Anton',  'prof. Vandebril', 'prof. Baelmans', 'prof. Jacobs', 'prof. De-Laet', 'prof. Van-De-Walle', 'prof. Rijmen', 'prof. Smets', 'prof. Holvoet', 'prof. Vander-Sloten', 'prof. Braem', 'prof. Vansteenwegen']

    saved_encodings_file = os.path.join(BASE_DIR, "face-recognition", "saved_encodings.npy")
    saved_encodings_names_file = os.path.join(BASE_DIR, "face-recognition", "saved_encodings_names.npy")
    faces_dir = os.path.join(BASE_DIR, "face-recognition", "faces")

    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []

        #if the encoded faces aren't saved, encode them and save them
        if not os.path.isfile(self.saved_encodings_file):
            for directory in os.listdir(self.faces_dir):
                if os.path.isdir(os.path.join(self.faces_dir, directory)):
                    self.encode_faces(os.path.join(self.faces_dir, directory) + "/")
            print(self.known_face_names)

            #save the encoded faces
            self.save_faces()
        else:
            #load the encoded faces
            self.load_faces()

    def save_faces(self):
        np.save(self.saved_encodings_file, self.known_face_encodings)
        np.save(self.saved_encodings_names_file, self.known_face_names)

    def load_faces(self):
        self.known_face_encodings = np.load(self.saved_encodings_file).tolist()
        self.known_face_names = np.load(self.saved_encodings_names_file).tolist()

    def encode_faces(self, path):
        print("Encoding faces in " + path)

        for filename in os.listdir(path):
            if filename.endswith(".jpg") or filename.endswith(".png") or filename.endswith(".jpeg") or filename.endswith(".JPG") or filename.endswith(".PNG") or filename.endswith(".JPEG"):
                image = face_recognition.load_image_file(path + filename)
                if len(face_recognition.face_encodings(image)) == 0:
                    print("No face found in " + filename)
                    continue
                encoding = face_recognition.face_encodings(image)[0]
                self.known_face_encodings.append(encoding)

                self.known_face_names.append('prof. ' + path.split("/")[-2])

    def encode_face(self, frame):
        """Geeft de encoding van het eerste gezicht in het frame, of None."""
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(image)
        if len(encodings) == 0:
            return None
        return encodings[0]

    def calculate_average_face_distance(self, face_distances, matches):
        #calculate the average face distance of each person, one person can have multiple faces
        faces = {}
        for i in range(len(matches)):
            if matches[i]:
                name = self.known_face_names[i]
                if name in faces:
                    faces[name].append(face_distances[i])
                else:
                    faces[name] = [face_distances[i]]
        for name in faces:
            faces[name] = sum(faces[name]) / len(faces[name])
        return faces

    def _detect_faces(self, frame):
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = np.ascontiguousarray(small_frame[:, :, ::-1])

        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        return face_locations, face_encodings

    def _draw_boxes(self, frame, face_locations, face_names):
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)

            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    def annotate_landmarks(self, frame):
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        face_landmarks_list = face_recognition.face_landmarks(small_frame)
        cv_image = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        for face_landmarks in face_landmarks_list:
            for facial_feature in face_landmarks.keys():
                points = np.array(face_landmarks[facial_feature], dtype=np.int32) * 4
                cv2.polylines(cv_image, [points], isClosed=False, color=(0, 255, 0), thickness=5)

        cv_image_rgb = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
        return cv_image_rgb

    def annotate_makeup(self, frame):
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        face_landmarks_list = face_recognition.face_landmarks(small_frame)
        cv_image = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        for face_landmarks in face_landmarks_list:
            # Make the eyebrows into a nightmare
            cv2.fillPoly(cv_image, [np.array(face_landmarks['left_eyebrow']) * 4], (68, 54, 39))
            cv2.fillPoly(cv_image, [np.array(face_landmarks['right_eyebrow']) * 4], (68, 54, 39))
            cv2.polylines(cv_image, [np.array(face_landmarks['left_eyebrow']) * 4], isClosed=True, color=(68, 54, 39), thickness=5)
            cv2.polylines(cv_image, [np.array(face_landmarks['right_eyebrow']) * 4], isClosed=True, color=(68, 54, 39), thickness=5)

            # Gloss the lips
            cv2.fillPoly(cv_image, [np.array(face_landmarks['top_lip']) * 4], (150, 0, 0))
            cv2.fillPoly(cv_image, [np.array(face_landmarks['bottom_lip']) * 4], (150, 0, 0))
            cv2.polylines(cv_image, [np.array(face_landmarks['top_lip']) * 4], isClosed=True, color=(150, 0, 0), thickness=8)
            cv2.polylines(cv_image, [np.array(face_landmarks['bottom_lip']) * 4], isClosed=True, color=(150, 0, 0), thickness=8)

            # Sparkle the eyes
            cv2.fillPoly(cv_image, [np.array(face_landmarks['left_eye']) * 4], (255, 255, 255))
            cv2.fillPoly(cv_image, [np.array(face_landmarks['right_eye']) * 4], (255, 255, 255))

            # Apply some eyeliner
            cv2.polylines(cv_image, [np.array(face_landmarks['left_eye']) * 4], isClosed=True, color=(0, 0, 0), thickness=6)
            cv2.polylines(cv_image, [np.array(face_landmarks['right_eye']) * 4], isClosed=True, color=(0, 0, 0), thickness=6)

        cv_image_rgb = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
        return cv_image_rgb

    def recognize(self, frame, known_encodings, known_names):
        """Herkent de gezichten die de studenten zelf hebben toegevoegd."""
        face_locations, face_encodings = self._detect_faces(frame)

        face_names = []
        for face_encoding in face_encodings:
            name = "Unknown"
            confidance = 100.0
            if len(known_encodings) > 0:
                face_distances = face_recognition.face_distance(known_encodings, face_encoding)
                if len(face_distances) > 0:
                    best_match_index = np.argmin(face_distances)
                    name = known_names[best_match_index]
                    confidance = face_confidence(face_distances[best_match_index])

            face_names.append(f'{name} ({confidance})')

        self._draw_boxes(frame, face_locations, face_names)
        return frame

    def recognize_prof(self, frame):
        """Zoekt een gekende prof in het frame. Geeft (frame, prof) terug,
        waarbij prof 'None' is als er geen prof gevonden werd."""
        face_locations, face_encodings = self._detect_faces(frame)

        prof_found = 'None'
        face_names = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.face_match_threshold)
            name = "Unknown"
            confidance = 100.0

            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            average_faces = self.calculate_average_face_distance(face_distances, matches)
            if (len(average_faces) > 0):
                name = min(average_faces, key=average_faces.get)
                confidance = face_confidence(average_faces[name])

            if name in self.known_names:
                prof_found = name

            face_names.append(f'{name} ({confidance})')

        self._draw_boxes(frame, face_locations, face_names)
        return frame, prof_found
