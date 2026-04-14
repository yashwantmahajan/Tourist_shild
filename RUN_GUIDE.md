# How to Run Tourist Shield Application

Follow these steps to run the application on your own.

## Prerequisites
- Python installed
- Internet connection (for installing dependencies the first time)

## One-Time Setup
Open your terminal (Command Prompt or PowerShell) and navigate to the project folder:
```powershell
cd "c:\Users\ASUS\OneDrive\Desktop\tourist_shild\tourist_shild"
```

Install the required libraries:
```powershell
python -m pip install -r requirements.txt
```

Initialize the database (only needed once or to reset data):
```powershell
python init_db.py
```

## Running the App
Every time you want to start the application:

1. Open your terminal.
2. Go to the project directory:
   ```powershell
   cd "c:\Users\ASUS\OneDrive\Desktop\tourist_shild\tourist_shild"
   ```
3. Run the application:
   ```powershell
   python app.py
   ```
4. Open your browser and go to the address shown (usually `http://127.0.0.1:5000`).

## Troubleshooting
- If `python` command doesn't work, try using `py`.
- If you see module errors, re-run the `pip install` command.
