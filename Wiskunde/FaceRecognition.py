## Herkenning van de proffen op basis van dlib / face_recognition.
## Wordt enkel gebruikt voor recognize_prof() (één frame per klik vanuit de
## browser); de live camera-effecten draaien client-side met face-api.js.
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
    known_names = ['prof. Geraedts', 'prof. Van-Hamme', 'prof. Vandepitte', 'prof. Houssa', 'prof. Blanpain', 'prof. Beernaert', 'prof. Van-Puyvelde',   'prof. Dehaene', 'prof. Moelans', 'prof. Anton', 'prof. Baelmans', 'prof. De-Laet', 'prof. Van-De-Walle', 'prof. Rijmen', 'prof. Smets', 'prof. Holvoet', 'prof. Vander-Sloten', 'prof. Braem', 'prof. Vansteenwegen', 'prof. Everaerts', 'prof. Swolfs']

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

    def recognize_prof(self, frame):
        """Zoekt een gekende prof in het frame. Geeft (frame, prof) terug,
        waarbij prof 'None' is als er geen prof gevonden werd."""
        # Op volledige resolutie en met upsampling, zodat ook kleinere
        # gezichten (laptop-webcam op normale afstand) gevonden worden.
        # Dit draait maar één keer per klik, dus de extra rekentijd mag.
        height, width = frame.shape[:2]
        if width > 1000:
            frame = cv2.resize(frame, (0, 0), fx=1000.0 / width, fy=1000.0 / width)
        rgb_frame = np.ascontiguousarray(frame[:, :, ::-1])

        face_locations = face_recognition.face_locations(rgb_frame, number_of_times_to_upsample=1)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        prof_found = 'None'
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.face_match_threshold)
            name = "Unknown"

            face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
            average_faces = self.calculate_average_face_distance(face_distances, matches)
            if (len(average_faces) > 0):
                name = min(average_faces, key=average_faces.get)

            if name in self.known_names:
                prof_found = name

        return frame, prof_found
