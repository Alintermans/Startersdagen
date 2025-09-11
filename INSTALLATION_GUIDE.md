# Startersdagen - Installation Guide

This guide explains how to easily install and run the Startersdagen project on multiple Windows computers using the automated installation scripts.

## Prerequisites

Before running the installation script, make sure these are installed on each computer:

### Required Software:
1. **Anaconda or Miniconda** (Python distribution)
   - Download from: https://www.anaconda.com/products/distribution
   - Or Miniconda: https://docs.conda.io/en/latest/miniconda.html

2. **Internet Connection** (for downloading the project files)
   - No additional software needed - the installer uses built-in Windows tools

## Quick Installation (Recommended)

### Step 1: Run the Installer
1. Copy `install_startersdagen.bat` to a shared drive accessible by all computers
2. On each computer, double-click `install_startersdagen.bat`
3. The script will:
   - Check if prerequisites are installed
   - Download the latest version of the project to the user's Desktop
   - Create an Anaconda environment called "startersdagen"
   - Install all required dependencies
   - Create clickable shortcuts to start the servers

### Step 2: Starting the Servers
After installation, you'll find these files on the Desktop:
- **`Start_Informatie.bat`** - Arduino/Electronics tutorials (Port 8080)
- **`Start_Wiskunde.bat`** - Face Recognition tutorials (Port 3000)

Simply double-click the appropriate .bat file to start the server!

## Manual Installation (Alternative)

If you prefer to install manually or the automatic installer doesn't work:

### 1. Clone the Repository
```bash
git clone https://github.com/Alintermans/Startersdagen.git
cd Startersdagen
```

### 2. Create Anaconda Environment
```bash
conda create -n startersdagen python=3.8 -y
conda activate startersdagen
```

### 3. Install Dependencies
```bash
# Basic dependencies
pip install pyserial flask

# Face recognition dependencies (for Wiskunde module)
conda install -c conda-forge dlib=19.22 -y
pip install face_recognition opencv-python numpy
```

### 4. Use the Startup Scripts
Copy `Start_Informatie.bat` and `Start_Wiskunde.bat` to your project directory and double-click to run.

## Usage Instructions

### Informatie Module (Arduino Tutorials)
1. Double-click `Start_Informatie.bat`
2. Connect your Arduino to the computer
3. **Important**: Make sure Arduino IDE is closed!
4. Open browser to: http://localhost:8080
5. Follow the on-screen tutorials

### Wiskunde Module (Face Recognition)
1. Double-click `Start_Wiskunde.bat`
2. Make sure you have a camera connected
3. Open browser to: http://localhost:3000
4. Follow the on-screen tutorials

## Troubleshooting

### "conda is not recognized"
- Anaconda/Miniconda is not installed or not in PATH
- Install Anaconda/Miniconda and restart your computer

### "Failed to download repository"
- Check your internet connection
- Some networks may block downloads - contact IT support if needed
- The installer downloads files automatically using Windows built-in tools

### Arduino not connecting
- Make sure Arduino IDE is completely closed
- Check that Arduino is properly connected via USB
- Try unplugging and reconnecting the Arduino

### Face recognition not working
- Make sure your camera is connected and working
- Check that no other applications are using the camera
- The first run may take longer to initialize

### Server won't start
- Check if the port is already in use
- Make sure the Anaconda environment was created successfully
- Try running the installation script again

## Network Access

Both servers are configured to accept connections from:
- **Local computer**: http://localhost:[port]
- **Network access**: http://[computer-ip]:[port]

Ports used:
- Informatie: 8080
- Wiskunde: 3000

## File Structure

After installation, your project structure should look like:
```
Desktop/Startersdagen/
├── install_startersdagen.bat    # Installation script
├── Start_Informatie.bat         # Arduino server launcher
├── Start_Wiskunde.bat          # Face recognition server launcher
├── Informatie/                 # Arduino tutorials
│   ├── Server.py
│   ├── templates/
│   └── static/
├── Wiskunde/                   # Face recognition tutorials
│   ├── Server.py
│   ├── templates/
│   └── static/
└── [other project files...]
```

## Support

If you encounter issues:
1. Check the error messages in the terminal window
2. Ensure all prerequisites are properly installed
3. Try running the installation script again
4. Contact the project maintainers

## Authors
- Anton Lintermans
- Gilles Belmans