$envs = conda info --envs

if ($envs -like "*startersdagen*") {
    conda activate startersdagen
    echo "Startersdagen environment already exists"
} else {
    echo "Creating startersdagen environment"
    conda create -n -y startersdagen python=3.7
    conda activate startersdagen
    conda install -c -y conda-forge dlib=19.22
    pip install pyserial
    pip install flask
    pip install face_recognition
    pip install opencv-python
    pip install numpy

}

echo "cd C:\Users\Public\startersdagen\Wiskunde"
cd C:\Users\Public\Desktop\Startersdagen\Wiskunde
echo "python C:\Users\Public\startersdagen\Wiskunde\Server.py"
python Server.py


