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

    saved_encodings_file = "saved_encodings.npy"
    saved_encodings_names_file = "saved_encodings_names.npy"

    clf = None

    def __init__(self):
        #if the encoded faces aren't saved, encode them and save them
        if not os.path.isfile(self.saved_encodings_file):
            for directory in os.listdir("faces/"):
                if os.path.isdir("faces/"+directory):
                    self.encode_faces("faces/"+directory+"/")
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
        self.known_face_encodings = np.load(self.saved_encodings_file)
        self.known_face_names = np.load(self.saved_encodings_names_file)
    
        


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
            faces[name] = sum(faces[name])/len(faces[name])
        return faces

    def process_frame(self, frame):
        if self.process_current_frame:
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_small_frame = small_frame[:, :, ::-1]
        
            self.face_locations = face_recognition.face_locations(rgb_small_frame)
            self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

            self.face_names = []
            for face_encoding in self.face_encodings:
                matches = face_recognition.compare_faces(self.known_face_encodings, face_encoding, tolerance=self.face_match_threshold)
                name = "Unknown"
                confidance = 100.0


                face_distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)
                average_faces = self.calculate_average_face_distance(face_distances, matches)
                if (len(average_faces) > 0):
                    name = min(average_faces, key=average_faces.get)
                    confidance = face_confidence(average_faces[name])


                


                # if matches[best_match_index]:
                #     name = self.known_face_names[best_match_index]
                #     confidance = face_confidence(face_distances[best_match_index])
                
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
        
        return frame


    
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
                    average_faces = self.calculate_average_face_distance(face_distances, matches)
                    if (len(average_faces) > 0):
                        name = min(average_faces, key=average_faces.get)
                        confidance = face_confidence(average_faces[name])


                    


                    # if matches[best_match_index]:
                    #     name = self.known_face_names[best_match_index]
                    #     confidance = face_confidence(face_distances[best_match_index])
                    
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






        



