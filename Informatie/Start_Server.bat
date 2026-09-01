@echo off
setlocal
title Informatie - Startdagen

REM Werk altijd vanuit de map waar dit bestand staat, zodat het script
REM blijft werken waar de map ook naartoe gekopieerd wordt.
cd /d "%~dp0"

if not exist "Server.py" (
    echo FOUT: Server.py niet gevonden naast dit bestand.
    pause
    exit /b 1
)

REM ---- Zoek een werkende Python ----
set "PYTHON="

py -3 --version >nul 2>&1
if not errorlevel 1 set "PYTHON=py -3"

if not defined PYTHON (
    python --version >nul 2>&1
    if not errorlevel 1 set "PYTHON=python"
)

if not defined PYTHON (
    for %%P in (
        "%USERPROFILE%\Anaconda3\python.exe"
        "%USERPROFILE%\Miniconda3\python.exe"
        "%LOCALAPPDATA%\Continuum\anaconda3\python.exe"
        "C:\ProgramData\Anaconda3\python.exe"
        "C:\Program Files\Anaconda3\python.exe"
        "C:\Anaconda3\python.exe"
        "C:\Miniconda3\python.exe"
    ) do (
        if not defined PYTHON if exist %%P set PYTHON="%%~P"
    )
)

if not defined PYTHON (
    echo FOUT: geen Python gevonden. Installeer Python via python.org
    echo of Anaconda, en start dit bestand daarna opnieuw.
    pause
    exit /b 1
)

echo Python gevonden: %PYTHON%

REM ---- Controleer de vereiste pakketten, installeer ze indien nodig ----
%PYTHON% -c "import flask, serial" >nul 2>&1
if errorlevel 1 (
    echo Flask en/of PySerial ontbreken, installeren...
    %PYTHON% -m pip install flask pyserial
    if errorlevel 1 %PYTHON% -m pip install --user flask pyserial
)

echo.
echo De server start nu. Open http://localhost:8090 in de browser.
echo Sluit dit venster om de server te stoppen.
echo.

%PYTHON% Server.py

echo.
echo De server is gestopt.
pause
