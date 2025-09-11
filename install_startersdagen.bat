@echo off

REM Check if we're already running in an Anaconda environment
if defined CONDA_DEFAULT_ENV (
    goto :main
)

REM If not in Anaconda environment, find and restart in Anaconda Prompt
echo ============================================
echo    Startersdagen Installation Script
echo ============================================
echo.
echo Detecting Anaconda installation...

REM Try to find Anaconda installation and restart in Anaconda environment
if exist "C:\Program Files\Anaconda3\Scripts\activate.bat" (
    echo Found Anaconda at C:\Program Files\Anaconda3
    echo Restarting in Anaconda environment...
    call "C:\Program Files\Anaconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else if exist "%USERPROFILE%\Anaconda3\Scripts\activate.bat" (
    echo Found Anaconda at %USERPROFILE%\Anaconda3
    echo Restarting in Anaconda environment...
    call "%USERPROFILE%\Anaconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else if exist "%USERPROFILE%\Miniconda3\Scripts\activate.bat" (
    echo Found Miniconda at %USERPROFILE%\Miniconda3
    echo Restarting in Anaconda environment...
    call "%USERPROFILE%\Miniconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else if exist "C:\Anaconda3\Scripts\activate.bat" (
    echo Found Anaconda at C:\Anaconda3
    echo Restarting in Anaconda environment...
    call "C:\Anaconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else if exist "C:\Miniconda3\Scripts\activate.bat" (
    echo Found Miniconda at C:\Miniconda3
    echo Restarting in Anaconda environment...
    call "C:\Miniconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else if exist "%LOCALAPPDATA%\Continuum\anaconda3\Scripts\activate.bat" (
    echo Found Anaconda at %LOCALAPPDATA%\Continuum\anaconda3
    echo Restarting in Anaconda environment...
    call "%LOCALAPPDATA%\Continuum\anaconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else if exist "C:\ProgramData\Anaconda3\Scripts\activate.bat" (
    echo Found Anaconda at C:\ProgramData\Anaconda3
    echo Restarting in Anaconda environment...
    call "C:\ProgramData\Anaconda3\Scripts\activate.bat" && "%~f0" anaconda_mode
    exit /b
) else (
    echo ERROR: Anaconda or Miniconda installation not found
    echo.
    echo Please install Anaconda or Miniconda first from:
    echo https://www.anaconda.com/products/distribution
    echo.
    echo Installation locations checked:
    echo - C:\Program Files\Anaconda3\
    echo - %USERPROFILE%\Anaconda3\
    echo - %USERPROFILE%\Miniconda3\
    echo - C:\Anaconda3\
    echo - C:\Miniconda3\
    echo - %LOCALAPPDATA%\Continuum\anaconda3\
    echo - C:\ProgramData\Anaconda3\
    echo.
    pause
    exit /b 1
)

:main
echo ============================================
echo    Startersdagen Installation Script
echo ============================================
echo.
echo ✓ Running in Anaconda environment
echo.

REM Set variables
set PROJECT_DIR=%USERPROFILE%\Desktop\Startersdagen
set REPO_ZIP_URL=https://github.com/Alintermans/Startersdagen/archive/refs/heads/main.zip
set TEMP_ZIP=%TEMP%\Startersdagen-main.zip

echo Installing Startersdagen to: %PROJECT_DIR%
echo.

echo Checking for existing installation...
if exist "%PROJECT_DIR%" (
    echo Found existing installation at %PROJECT_DIR%
    set /p "choice=Do you want to remove it and reinstall? (y/n): "
    if /i "!choice!"=="y" (
        echo Removing existing installation...
        rmdir /s /q "%PROJECT_DIR%"
        echo Existing installation removed.
    ) else (
        echo Installation cancelled.
        pause
        exit /b 0
    )
)

echo.
echo Downloading repository...
echo This may take a moment depending on your internet connection...

REM Download using PowerShell (available on all modern Windows)
powershell -Command "& {[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%REPO_ZIP_URL%' -OutFile '%TEMP_ZIP%'}"
if %errorlevel% neq 0 (
    echo ERROR: Failed to download repository
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo Download complete! Extracting files...

REM Extract using PowerShell
powershell -Command "& {Expand-Archive -Path '%TEMP_ZIP%' -DestinationPath '%TEMP%' -Force}"
if %errorlevel% neq 0 (
    echo ERROR: Failed to extract repository
    pause
    exit /b 1
)

REM Create destination directory if it doesn't exist
if not exist "%USERPROFILE%\Desktop" (
    mkdir "%USERPROFILE%\Desktop"
)

REM Debug: Show what we're working with
echo.
echo DEBUG INFO:
echo Source folder: %TEMP%\Startersdagen-main
echo Destination: %PROJECT_DIR%
echo Checking if source exists...
if exist "%TEMP%\Startersdagen-main" (
    echo ✓ Source folder exists
    dir "%TEMP%\Startersdagen-main" /b | findstr . >nul
    if %errorlevel% equ 0 (
        echo ✓ Source folder contains files
    ) else (
        echo ⚠ Source folder is empty
    )
) else (
    echo ✗ Source folder does not exist
)
echo.

REM Move from extracted folder to final location
echo Moving files to %PROJECT_DIR%...
move "%TEMP%\Startersdagen-main" "%PROJECT_DIR%"
if %errorlevel% neq 0 (
    echo ERROR: Failed to move files to final location
    echo Trying alternative method...
    
    REM Alternative: copy then delete
    xcopy "%TEMP%\Startersdagen-main" "%PROJECT_DIR%" /E /I /H /Y
    if %errorlevel% equ 0 (
        echo Files copied successfully, cleaning up...
        rmdir /s /q "%TEMP%\Startersdagen-main" >nul 2>nul
        echo Files moved successfully using alternative method!
    ) else (
        echo ERROR: Both move and copy methods failed
        echo Source: %TEMP%\Startersdagen-main
        echo Destination: %PROJECT_DIR%
        echo Please check permissions and try again
        pause
        exit /b 1
    )
)

REM Clean up temp file
del "%TEMP_ZIP%" >nul 2>nul

echo Repository downloaded and extracted successfully!
echo.

REM Check if startersdagen environment exists
echo Checking for Anaconda environment...
conda info --envs | findstr "startersdagen" >nul 2>nul
if %errorlevel% equ 0 (
    echo Startersdagen environment already exists. Using existing environment.
) else (
    echo Creating new Anaconda environment 'startersdagen'...
    conda create -n startersdagen python=3.8 -y
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create Anaconda environment
        pause
        exit /b 1
    )
)

echo.
echo Activating environment and installing dependencies...
call conda activate startersdagen

REM Install basic dependencies
echo Installing basic dependencies...
pip install pyserial flask
if %errorlevel% neq 0 (
    echo ERROR: Failed to install basic dependencies
    pause
    exit /b 1
)

REM Install face recognition dependencies (for Wiskunde module)
echo Installing face recognition dependencies...
echo This may take several minutes...
conda install -c conda-forge dlib=19.22 -y
pip install face_recognition opencv-python numpy
if %errorlevel% neq 0 (
    echo WARNING: Face recognition dependencies installation failed
    echo The Informatie module will work, but Wiskunde module may not function properly
)

echo.
echo Creating desktop shortcuts...

REM Create Informatie startup script with proper Anaconda initialization
echo @echo off > "%PROJECT_DIR%\Start_Informatie.bat"
echo title Startersdagen - Informatie Server >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo ======================================= >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo    Startersdagen - Informatie Server >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo ======================================= >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo. >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo Initializing Anaconda environment... >> "%PROJECT_DIR%\Start_Informatie.bat"
echo REM Try common Anaconda installation paths >> "%PROJECT_DIR%\Start_Informatie.bat"
echo if exist "C:\Program Files\Anaconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     call "C:\Program Files\Anaconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Informatie.bat"
echo ^) else if exist "%%USERPROFILE%%\Anaconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     call "%%USERPROFILE%%\Anaconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Informatie.bat"
echo ^) else if exist "%%USERPROFILE%%\Miniconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     call "%%USERPROFILE%%\Miniconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Informatie.bat"
echo ^) else if exist "C:\Anaconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     call "C:\Anaconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Informatie.bat"
echo ^) else if exist "C:\Miniconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     call "C:\Miniconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Informatie.bat"
echo ^) else ^( >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     echo ERROR: Could not find Anaconda installation >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     pause >> "%PROJECT_DIR%\Start_Informatie.bat"
echo     exit /b 1 >> "%PROJECT_DIR%\Start_Informatie.bat"
echo ^) >> "%PROJECT_DIR%\Start_Informatie.bat"
echo call conda activate startersdagen >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo Starting Informatie server... >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo Server will be available at: http://localhost:8080 >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo. >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo Press Ctrl+C to stop the server >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo. >> "%PROJECT_DIR%\Start_Informatie.bat"
echo cd /d "%%~dp0\Informatie" >> "%PROJECT_DIR%\Start_Informatie.bat"
echo python Server.py >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo. >> "%PROJECT_DIR%\Start_Informatie.bat"
echo echo Server stopped. Press any key to close... >> "%PROJECT_DIR%\Start_Informatie.bat"
echo pause >> "%PROJECT_DIR%\Start_Informatie.bat"

REM Create Wiskunde startup script with proper Anaconda initialization
echo @echo off > "%PROJECT_DIR%\Start_Wiskunde.bat"
echo title Startersdagen - Wiskunde Server >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo ==================================== >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo    Startersdagen - Wiskunde Server >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo ==================================== >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo. >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo Initializing Anaconda environment... >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo REM Try common Anaconda installation paths >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo if exist "C:\Program Files\Anaconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     call "C:\Program Files\Anaconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo ^) else if exist "%%USERPROFILE%%\Anaconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     call "%%USERPROFILE%%\Anaconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo ^) else if exist "%%USERPROFILE%%\Miniconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     call "%%USERPROFILE%%\Miniconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo ^) else if exist "C:\Anaconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     call "C:\Anaconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo ^) else if exist "C:\Miniconda3\Scripts\activate.bat" ^( >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     call "C:\Miniconda3\Scripts\activate.bat" >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo ^) else ^( >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     echo ERROR: Could not find Anaconda installation >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     pause >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo     exit /b 1 >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo ^) >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo call conda activate startersdagen >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo Starting Wiskunde server... >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo Server will be available at: http://localhost:3000 >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo. >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo Press Ctrl+C to stop the server >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo. >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo cd /d "%%~dp0\Wiskunde" >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo python Server.py >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo. >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo echo Server stopped. Press any key to close... >> "%PROJECT_DIR%\Start_Wiskunde.bat"
echo pause >> "%PROJECT_DIR%\Start_Wiskunde.bat"

echo.
echo ============================================
echo         Installation Complete!
echo ============================================
echo.
echo Project installed to: %PROJECT_DIR%
echo.
echo To start the servers, double-click on:
echo - Start_Informatie.bat (Arduino tutorials - Port 8080)
echo - Start_Wiskunde.bat (Face recognition - Port 3000)
echo.
echo The batch files are located in: %PROJECT_DIR%
echo.
echo You can copy these .bat files to your desktop for easier access.
echo.

REM Ask if user wants to copy shortcuts to desktop
set /p "copy_choice=Copy startup shortcuts to Desktop? (y/n): "
if /i "%copy_choice%"=="y" (
    copy "%PROJECT_DIR%\Start_Informatie.bat" "%USERPROFILE%\Desktop\"
    copy "%PROJECT_DIR%\Start_Wiskunde.bat" "%USERPROFILE%\Desktop\"
    echo Shortcuts copied to Desktop!
)

echo.
pause