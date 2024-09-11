import os
import numpy as np
from PIL import Image
from scipy.linalg import eigh

# Load image files (same as before)
# Load image files
image_dir = './SimpleFRDatabase'  # Provide the path to your image directory
image_files = [file for file in os.listdir(image_dir) if file not in ['.', '..', 'Thumbs.db', '.DS_Store']]
image_names = [file.split('.')[0] for file in image_files]


# Task 1: Load and process images
A = []
for i in range(len(image_files)):
    image_path = os.path.join(image_dir, image_files[i])
    img = Image.open(image_path)
    #img = img.crop((30, 25, 115 + 30, 80 + 25))  # Crop and adjust as needed
    img_resized = img.resize((80, 115))
    A.append(np.array(img_resized))
    
    # Save the processed image as an image
    processed_image = Image.fromarray(np.uint8(A[i]))
    processed_image.save(f'./export/task1_image_{i}.png')

# Task 2: Create gray images and matrix
B = []
C = np.zeros((115 * 80, len(image_files)))
gray_images = []  # List to store gray images
for t in range(len(A)):
    gray_img = np.zeros((115, 80))
    for j in range(80):
        for k in range(115):
            B_value = 0.2989 * A[t][k, j, 0] + 0.587 * A[t][k, j, 1] + 0.114 * A[t][k, j, 2]
            gray_img[k, j] = B_value  # Store gray pixel value
            B.append(B_value)
            C[k + j * 115, t] = B_value
    gray_images.append(gray_img)
    # Save the gray image as an image
    gray_image = Image.fromarray(np.uint8(gray_img))
    gray_image.save(f'./export/task2_gray_image_{t}.png')

# row_sums = C.sum(axis=1)
# C = C / row_sums[:, np.newaxis]
# C = C*255
print(C)

# Save the matrix C as an image
matrix_image = Image.fromarray(np.uint8(C))
matrix_image.save('./export/task2_matrix.png')



# Task 3: Compute average face
D = np.mean(C, axis=1)
average_face = D.reshape(80, 115) 

# Save the average face as an image
average_face_image = Image.fromarray(np.uint8(average_face))
average_face_image.save('./export/task3_average_face.png')

# Task 4: Compute eigenfaces
E = C - np.outer(D, np.ones(len(image_files)))


# save image for each difference from the average face
for i in range(len(image_files)):
    difference = (E[:, i]).reshape(80, 115)
    difference_image = Image.fromarray(np.uint8(difference))
    difference_image.save(f'./export/task4_difference_{i}.png')

covar = np.dot(E, E.T)

V = np.dot(E.T, E)
val, U = eigh(V)
idx = val.argsort()[::-1]   
val = val[idx]
U = U[:,idx]

U = np.dot(E, U)  # Compute U using E, not E.T

# Scale U by lambda^(-0.5)
U = np.dot(U, np.diag(val**(-0.5)))

# Show first eigenface

# U = (U)*255/np.max(U)
#save all eigenfaces as images
for i in range(len(image_files)):
   
    eigenface = (U[:, i]*255/U[:,i].max()).reshape(80, 115)
    
    eigenface_image = Image.fromarray(np.uint8(eigenface))
    eigenface_image.save(f'./export/task4_eigenface{i}.png')

# Task 5: Compute weights
weights = np.dot(U.T, E)
print(weights[:, 0])

# Save the weights matrix as an image
weights_image = Image.fromarray(np.uint8(weights))
weights_image.save('./export/task5_weights.png')


# Load a new image (same as before)
new_image_path = './static/images/mr_bean_cut.png'
new_img = Image.open(new_image_path)


# # Convert the new image to a grayscale column vector
new_B = []
new_C = np.zeros((115 * 80,))
for j in range(80):
    for k in range(115):
        pixel = new_img.getpixel((j, k))
        new_B_value = 0.2989 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]
        new_B.append(new_B_value)
        new_C[k + j * 115] = new_B_value

# # Compute the difference vector from the average face
new_E = new_C - D

# # Compute the weights of the new image in the eigenface space
new_weights = np.dot(U.T, new_E)

#pu new_weights in matrix


#print(new_weights_matrix)


# take the difference between each weight of a face in the database and the new image but exclude the last eigenface
# and take the norm of that difference
# the smallest norm is the closest match
distances = np.zeros((len(image_files), 1))
for i in range(len(image_files)):
    distances[i] = np.linalg.norm(new_weights[:17]-weights[:17, i])
print(distances)



closest_match_index = np.argmin(distances)
print(closest_match_index)
# show the closest match
closest_match = gray_images[closest_match_index]
closest_match_image = Image.fromarray(np.uint8(closest_match))
closest_match_image.save('./export/task5_closest_match.png')

# sort distances and take the first 5 and print their names
sorted_distances = np.sort(distances, axis=0)

for i in range(5):
    index = np.where(distances == sorted_distances[i])
    print('distance: '+ str(sorted_distances[i]) + ' ' + str(image_names[index[0][0]]))




# # Print the closest match index and associated song
print("Closest match index:", closest_match_index)
print("Closest match name:", image_names[closest_match_index])
# print("Favorite song:", namenenliedjes[closest_match_index]['song'])
