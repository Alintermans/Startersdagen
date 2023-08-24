## We need to install dlib 19.22 and face_recognition 
import face_recognition
import cv2
import numpy as np
import os
import math
from sklearn import svm



def face_confidence(face_distance, face_match_threshold=0.6):
    range = (1.0 - face_match_threshold)
    linear_val = (1.0 - face_distance) / (range*2.0)

    if face_distance > face_match_threshold:
        return str(round(linear_val*100, 2)) + "%"
    
    else:
        value = (linear_val +((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))) * 100
        return str(round(value, 2)) + "%"

class FaceRecognition:
    face_locations = []
    face_encodings = []
    face_names = []
    process_current_frame = True

    known_face_encodings = []
    known_face_names = []
    face_match_threshold = 0.6
    face_distance = 0.0
    face_confidence = 0.0
    face_found = False
    face_found_name = ""
    face_found_confidence = ""
    face_found_distance = 0.0
    face_found_location = []

    def __init__(self):
        for directory in os.listdir("faces/"):
            if os.path.isdir("faces/"+directory):
                self.encode_faces("faces/"+directory+"/")
        print(self.known_face_names)

    def encode_faces(self, path):
        for filename in os.listdir(path):
            if filename.endswith(".jpg") or filename.endswith(".png"):
                image = face_recognition.load_image_file(path + filename)
                if len(face_recognition.face_encodings(image)) == 0:
                    print("No face found in " + filename)
                    continue
                encoding = face_recognition.face_encodings(image)[0]
                self.known_face_encodings.append(encoding)
                self.known_face_names.append(filename.split(".")[0])
    
    def run_recognition(self):
        video_capture = cv2.VideoCapture(1)

        if not video_capture.isOpened():
            print("Unable to open video source")
            exit(1)

        while True:
            ret, frame = video_capture.read()
            if not ret:
                print("Unable to read frame")
                break

            if self.process_current_frame:
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
                rgb_small_frame = small_frame[:, :, ::-1]
            
                self.face_locations = face_recognition.face_locations(rgb_small_frame)
                self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

                self.face_names = []
                for face_encoding in self.face_encodings:
                    matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.face_match_threshold)
                    name = "Unknown"
                    confidance = 0.0


                    face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                    best_match_index = np.argmin(face_distances)
                    if matches[best_match_index]:
                        name = self.known_face_names[best_match_index]
                        confidance = face_confidence(face_distances[best_match_index])

                    self.face_names.append(f'{name} ({confidance})')

            self.process_current_frame = not self.process_current_frame

            for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4

                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)

                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            cv2.imshow('Video', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        video_capture.release()
        cv2.destroyAllWindows()






        


fr = FaceRecognition()

fr.run_recognition()


