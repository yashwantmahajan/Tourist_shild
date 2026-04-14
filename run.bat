@echo off
echo ========================================
echo   Tourist Shield Application Launcher
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if database exists
if not exist "instance\tourist_shield.db" (
    echo Database not found. Initializing...
    python init_db.py
    echo.
)

REM Start the application
echo Starting Tourist Shield Application...
echo.
echo Once started, open your browser and go to:
echo http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.
python app.py

REM Keep the window open after the application exits
pause
