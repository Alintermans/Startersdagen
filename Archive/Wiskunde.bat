@echo off
title Run Setup Wiskunde - Anaconda PowerShell
echo ==============================================
echo    Running Setup Wiskunde in Anaconda PowerShell
echo ==============================================
echo.

REM Get the current directory where this batch file is located
set SCRIPT_DIR=%~dp0

echo PowerShell script embedded in batch file
echo.

REM Try to find Anaconda PowerShell in common locations
if exist "C:\Program Files\Anaconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=C:\Program Files\Anaconda3
) else if exist "%USERPROFILE%\Anaconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=%USERPROFILE%\Anaconda3
) else if exist "%USERPROFILE%\Miniconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=%USERPROFILE%\Miniconda3
) else if exist "C:\Anaconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=C:\Anaconda3
) else if exist "C:\Miniconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=C:\Miniconda3
) else if exist "%LOCALAPPDATA%\Continuum\anaconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=%LOCALAPPDATA%\Continuum\anaconda3
) else if exist "C:\ProgramData\Anaconda3\Scripts\activate.bat" (
    set ANACONDA_PATH=C:\ProgramData\Anaconda3
) else (
    echo ERROR: Could not find Anaconda installation
    echo Please make sure Anaconda or Miniconda is properly installed.
    echo.
    pause
    exit /b 1
)

echo Found Anaconda at: %ANACONDA_PATH%
echo Starting Anaconda PowerShell and running setup_wiskunde.ps1...
echo.

REM Create a temporary PowerShell script that initializes conda and runs the PS1 file
set TEMP_PS1=%TEMP%\run_setup_wiskunde_temp.ps1

echo # Initialize Conda for PowerShell > "%TEMP_PS1%"
echo $env:CONDA_EXE = '%ANACONDA_PATH%\Scripts\conda.exe' >> "%TEMP_PS1%"
echo $env:_CE_M = '' >> "%TEMP_PS1%"
echo $env:_CE_CONDA = '' >> "%TEMP_PS1%"
echo $env:_CONDA_ROOT = '%ANACONDA_PATH%' >> "%TEMP_PS1%"
echo $env:_CONDA_EXE = '%ANACONDA_PATH%\Scripts\conda.exe' >> "%TEMP_PS1%"
echo $CondaModuleArgs = @{ChangePs1 = $False} >> "%TEMP_PS1%"
echo Import-Module '%ANACONDA_PATH%\shell\condabin\Conda.psm1' -ArgumentList $CondaModuleArgs >> "%TEMP_PS1%"
echo. >> "%TEMP_PS1%"
echo # Change to script directory >> "%TEMP_PS1%"
echo Set-Location '%SCRIPT_DIR%' >> "%TEMP_PS1%"
echo. >> "%TEMP_PS1%"
echo # Embedded setup_wiskunde.ps1 content >> "%TEMP_PS1%"
echo $envs = conda info --envs >> "%TEMP_PS1%"
echo if ($envs -like "*startersdagen*") { >> "%TEMP_PS1%"
echo     conda activate startersdagen >> "%TEMP_PS1%"
echo     Write-Host "Startersdagen environment already exists" >> "%TEMP_PS1%"
echo } else { >> "%TEMP_PS1%"
echo     Write-Host "Creating startersdagen environment" >> "%TEMP_PS1%"
echo     conda create -n startersdagen python=3.7 -y >> "%TEMP_PS1%"
echo     conda activate startersdagen >> "%TEMP_PS1%"
echo     conda install -c conda-forge dlib=19.22 -y >> "%TEMP_PS1%"
echo     pip install pyserial >> "%TEMP_PS1%"
echo     pip install flask >> "%TEMP_PS1%"
echo     pip install face_recognition >> "%TEMP_PS1%"
echo     pip install opencv-python >> "%TEMP_PS1%"
echo     pip install numpy >> "%TEMP_PS1%"
echo } >> "%TEMP_PS1%"
echo. >> "%TEMP_PS1%"
echo Write-Host "cd H:\Startersdagen\Wiskunde" >> "%TEMP_PS1%"
echo Set-Location "H:\Startersdagen\Wiskunde" >> "%TEMP_PS1%"
echo Write-Host "python H:\Startersdagen\Wiskunde\Server.py" >> "%TEMP_PS1%"
echo python Server.py >> "%TEMP_PS1%"

REM Launch PowerShell with the temporary script
powershell.exe -ExecutionPolicy Bypass -NoExit -File "%TEMP_PS1%"

REM Clean up temporary file
del "%TEMP_PS1%" >nul 2>nul