@echo off
title Startersdagen - Wiskunde Server
echo ====================================
echo    Startersdagen - Wiskunde Server
echo ====================================
echo.

REM Check if we're running from the correct directory
if not exist "Wiskunde\Server.py" (
    echo ERROR: Cannot find Wiskunde\Server.py
    echo Please make sure this script is in the Startersdagen project root directory.
    echo Expected structure:
    echo   Startersdagen\
    echo   ├── Start_Wiskunde.bat (this file)
    echo   └── Wiskunde\
    echo       └── Server.py
    echo.
    pause
    exit /b 1
)

REM Initialize Anaconda for this session
echo Initializing Anaconda environment...

REM Try common Anaconda installation paths
if exist "%USERPROFILE%\Anaconda3\Scripts\activate.bat" (
    call "%USERPROFILE%\Anaconda3\Scripts\activate.bat"
) else if exist "%USERPROFILE%\Miniconda3\Scripts\activate.bat" (
    call "%USERPROFILE%\Miniconda3\Scripts\activate.bat"
) else if exist "C:\Anaconda3\Scripts\activate.bat" (
    call "C:\Anaconda3\Scripts\activate.bat"
) else if exist "C:\Miniconda3\Scripts\activate.bat" (
    call "C:\Miniconda3\Scripts\activate.bat"
) else if exist "%LOCALAPPDATA%\Continuum\anaconda3\Scripts\activate.bat" (
    call "%LOCALAPPDATA%\Continuum\anaconda3\Scripts\activate.bat"
) else if exist "%LOCALAPPDATA%\Continuum\miniconda3\Scripts\activate.bat" (
    call "%LOCALAPPDATA%\Continuum\miniconda3\Scripts\activate.bat"
) else if exist "C:\ProgramData\Anaconda3\Scripts\activate.bat" (
    call "C:\ProgramData\Anaconda3\Scripts\activate.bat"
) else if exist "C:\ProgramData\Miniconda3\Scripts\activate.bat" (
    call "C:\ProgramData\Miniconda3\Scripts\activate.bat"
) else (
    echo ERROR: Could not find Anaconda/Miniconda installation
    echo Please make sure Anaconda or Miniconda is properly installed.
    echo Common installation locations checked:
    echo   - %USERPROFILE%\Anaconda3\
    echo   - %USERPROFILE%\Miniconda3\
    echo   - C:\Anaconda3\
    echo   - C:\Miniconda3\
    echo   - %LOCALAPPDATA%\Continuum\anaconda3\
    echo   - %LOCALAPPDATA%\Continuum\miniconda3\
    echo   - C:\ProgramData\Anaconda3\
    echo   - C:\ProgramData\Miniconda3\
    echo.
    pause
    exit /b 1
)

echo Activating startersdagen environment...
call conda activate startersdagen
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate 'startersdagen' environment
    echo Please make sure you have run the installation script first.
    echo.
    pause
    exit /b 1
)

echo Environment activated successfully!
echo.
echo Starting Wiskunde server...
echo Server will be available at: http://localhost:3000
echo.
echo INSTRUCTIONS:
echo 1. Make sure you have a camera connected to your computer
echo 2. Open your web browser and go to: http://localhost:3000
echo 3. Press Ctrl+C in this window to stop the server
echo.
echo Note: The first time you run this, it may take a moment to
echo initialize the face recognition system.
echo.
echo ====================================

cd /d "%~dp0\Wiskunde"
python Server.py

echo.
echo ====================================
echo Server stopped. Press any key to close this window...
pause