# Tourist Shield - Docker & Run Guide

## Option 1: Running with Docker (Recommended for Production)

### Prerequisites
1. **Install Docker Desktop for Windows**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and restart your computer
   - Verify installation: `docker --version`

### Build and Run with Docker

1. **Build the Docker image:**
   ```powershell
   cd "c:\Users\ASUS\OneDrive\Desktop\tourist_shild\tourist_shild"
   docker build -t tourist-shield .
   ```

2. **Run the container:**
   ```powershell
   docker run -d -p 5000:5000 --name tourist-shield-app tourist-shield
   ```

3. **Access the application:**
   - Open your browser and go to: `http://localhost:5000`

### Docker Management Commands

**View running containers:**
```powershell
docker ps
```

**View container logs:**
```powershell
docker logs tourist-shield-app
```

**Stop the container:**
```powershell
docker stop tourist-shield-app
```

**Start the container again:**
```powershell
docker start tourist-shield-app
```

**Remove the container:**
```powershell
docker rm -f tourist-shield-app
```

**Rebuild after code changes:**
```powershell
docker rm -f tourist-shield-app
docker build -t tourist-shield .
docker run -d -p 5000:5000 --name tourist-shield-app tourist-shield
```

---

## Option 2: Running Directly with Python (Quick Start)

### One-Time Setup

1. **Install dependencies:**
   ```powershell
   cd "c:\Users\ASUS\OneDrive\Desktop\tourist_shild\tourist_shild"
   python -m pip install -r requirements.txt
   ```

2. **Initialize database:**
   ```powershell
   python init_db.py
   ```

### Running the Application

```powershell
cd "c:\Users\ASUS\OneDrive\Desktop\tourist_shild\tourist_shild"
python app.py
```

Then open your browser and go to: `http://localhost:5000`

---

## Default Login Credentials

After initialization, you can log in with these default accounts:

**Tourist Account:**
- Username: `tourist1`
- Password: `password123`

**Admin Account:**
- Username: `admin`
- Password: `admin123`

---

## Troubleshooting

### Docker Issues
- **Docker not found:** Install Docker Desktop from the link above
- **Port already in use:** Change the port mapping: `docker run -d -p 8080:5000 --name tourist-shield-app tourist-shield`
- **Container won't start:** Check logs with `docker logs tourist-shield-app`

### Python Issues
- **Module not found:** Run `python -m pip install -r requirements.txt` again
- **Database errors:** Delete `instance/tourist_shield.db` and run `python init_db.py` again
- **Port already in use:** Stop any other application using port 5000

---

## Project Structure

```
tourist_shild/
├── Dockerfile              # Docker configuration
├── .dockerignore          # Docker ignore file
├── requirements.txt       # Python dependencies
├── app.py                 # Main Flask application
├── init_db.py            # Database initialization
├── models.py             # Database models
├── ai_engine.py          # AI/ML logic
├── pdf_generator.py      # PDF generation
├── static/               # CSS, JS, images
├── templates/            # HTML templates
└── instance/             # Database files
```
