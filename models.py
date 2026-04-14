"""
Smart Tourist Shield AI - Database Models
"""
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)  # For email login
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'TOURIST', 'ADMIN', 'POLICE'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    tourist_profile = db.relationship('TouristProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='user', cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class TouristProfile(db.Model):
    __tablename__ = 'tourist_profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Name fields
    first_name = db.Column(db.String(60))
    last_name = db.Column(db.String(60))
    name = db.Column(db.String(100), nullable=False)  # Full name (first + last)
    digital_id = db.Column(db.String(20), unique=True, nullable=False)
    
    # Tourist Type: 'INDIAN' or 'FOREIGN'
    tourist_type = db.Column(db.String(20), default='INDIAN')
    
    # Fields for both types
    nationality = db.Column(db.String(50))
    passport_number = db.Column(db.String(50))
    contact = db.Column(db.String(20))
    emergency_contact = db.Column(db.String(20))
    
    # Indian tourist specific fields
    aadhar_number = db.Column(db.String(12))  # 12-digit Aadhar
    address = db.Column(db.Text)
    
    # Foreign tourist specific fields
    email = db.Column(db.String(100))
    country = db.Column(db.String(100))
    
    # Tour Route Fields
    from_location = db.Column(db.String(200))   # Tour start location
    to_location = db.Column(db.String(200))     # Tour destination
    tour_start_date = db.Column(db.Date)
    tour_end_date = db.Column(db.Date)
    
    # Geo-fence tracking
    zone_status = db.Column(db.String(20), default='safe')  # 'safe' or 'out_of_zone'
    
    # Common fields
    hotel_name = db.Column(db.String(100))
    check_in_date = db.Column(db.Date)
    travel_plan = db.Column(db.Text)  # JSON string
    safety_score = db.Column(db.Integer, default=95)
    current_lat = db.Column(db.Float, default=28.6139)
    current_lng = db.Column(db.Float, default=77.2090)
    last_location = db.Column(db.String(200), default="Hotel Area")
    status = db.Column(db.String(50), default="Safe")
    last_update = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='tourist_profile')
    alerts = db.relationship('Alert', back_populates='tourist', cascade='all, delete-orphan')
    sos_requests = db.relationship('SOSRequest', back_populates='tourist', cascade='all, delete-orphan')
    hospital_requests = db.relationship('HospitalRequest', back_populates='tourist', cascade='all, delete-orphan')
    efirs = db.relationship('EFIR', back_populates='tourist', cascade='all, delete-orphan')

class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    tourist_id = db.Column(db.Integer, db.ForeignKey('tourist_profiles.id'), nullable=True)
    severity = db.Column(db.String(20), nullable=False)  # 'low', 'medium', 'high', 'critical'
    alert_type = db.Column(db.String(50), nullable=False)  # 'info', 'warning', 'danger'
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')  # 'active', 'resolved', 'dismissed'
    assigned_officer = db.Column(db.String(100))
    
    # Relationships
    tourist = db.relationship('TouristProfile', back_populates='alerts')
    evidence_logs = db.relationship('EvidenceLog', back_populates='alert', cascade='all, delete-orphan')

class EvidenceLog(db.Model):
    __tablename__ = 'evidence_logs'
    id = db.Column(db.Integer, primary_key=True)
    alert_id = db.Column(db.Integer, db.ForeignKey('alerts.id', ondelete='SET NULL'), nullable=True)
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    event_type = db.Column(db.String(50))
    event_metadata = db.Column(db.Text)  # JSON string - renamed from 'metadata'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    logged_by = db.Column(db.String(100), default='System')
    
    # Relationships
    alert = db.relationship('Alert', back_populates='evidence_logs')

class SOSRequest(db.Model):
    __tablename__ = 'sos_requests'
    id = db.Column(db.Integer, primary_key=True)
    tourist_id = db.Column(db.Integer, db.ForeignKey('tourist_profiles.id'), nullable=False)
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'dispatched', 'resolved'
    response_time = db.Column(db.Integer)  # in minutes
    assigned_officer = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    # Relationships
    tourist = db.relationship('TouristProfile', back_populates='sos_requests')

class EFIR(db.Model):
    __tablename__ = 'efirs'
    id = db.Column(db.Integer, primary_key=True)
    fir_number = db.Column(db.String(50), unique=True, nullable=False)
    tourist_id = db.Column(db.Integer, db.ForeignKey('tourist_profiles.id'), nullable=False)
    incident_type = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200))
    description = db.Column(db.Text)
    filed_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Under Investigation')
    assigned_officer = db.Column(db.String(100), default='Inspector Singh')
    pdf_path = db.Column(db.String(200))
    
    # Relationships
    tourist = db.relationship('TouristProfile', back_populates='efirs')

class HospitalRequest(db.Model):
    __tablename__ = 'hospital_requests'
    id = db.Column(db.Integer, primary_key=True)
    tourist_id = db.Column(db.Integer, db.ForeignKey('tourist_profiles.id'), nullable=False)
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'dispatched', 'resolved'
    response_time = db.Column(db.Integer)  # in minutes
    assigned_unit = db.Column(db.String(100))  # Ambulance unit ID
    notes = db.Column(db.Text)
    
    # Ambulance Live Tracking Fields
    ambulance_lat = db.Column(db.Float)  # Current ambulance latitude
    ambulance_lng = db.Column(db.Float)  # Current ambulance longitude
    ambulance_status = db.Column(db.String(20), default='assigning')  # 'assigning', 'assigned', 'on_the_way', 'arrived'
    estimated_arrival_time = db.Column(db.Integer)  # ETA in minutes
    distance_remaining = db.Column(db.Float)  # Distance to tourist in kilometers
    last_location_update = db.Column(db.DateTime)  # Timestamp of last location update
    
    # Relationships
    tourist = db.relationship('TouristProfile', back_populates='hospital_requests')

class Criminal(db.Model):
    __tablename__ = 'criminals'
    id = db.Column(db.Integer, primary_key=True)
    criminal_id = db.Column(db.String(50), unique=True, nullable=False)  # Unique criminal ID
    name = db.Column(db.String(100), nullable=False)
    offenses = db.Column(db.Text)  # Comma-separated or JSON list of offenses
    risk_level = db.Column(db.String(20), default='MEDIUM')  # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    photo_path = db.Column(db.String(200))  # Path to criminal photo
    description = db.Column(db.Text)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.String(200))  # Last known location
    is_active = db.Column(db.Boolean, default=True)  # Active in watchlist
    
    # Relationships
    detections = db.relationship('CriminalDetection', back_populates='criminal', cascade='all, delete-orphan')

class CriminalDetection(db.Model):
    __tablename__ = 'criminal_detections'
    id = db.Column(db.Integer, primary_key=True)
    criminal_id = db.Column(db.Integer, db.ForeignKey('criminals.id'), nullable=False)
    location = db.Column(db.String(200))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    detected_at = db.Column(db.DateTime, default=datetime.utcnow)
    detection_method = db.Column(db.String(50), default='ID_MATCH')  # 'ID_MATCH', 'FACIAL_RECOGNITION', 'MANUAL'
    alert_id = db.Column(db.Integer, db.ForeignKey('alerts.id', ondelete='SET NULL'), nullable=True)
    notes = db.Column(db.Text)
    
    # Relationships
    criminal = db.relationship('Criminal', back_populates='detections')


class GeoFence(db.Model):
    """Admin-defined geo-fence zones for tourist area monitoring"""
    __tablename__ = 'geo_fences'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    zone_type = db.Column(db.String(20), default='safe')  # 'safe' or 'restricted'
    center_lat = db.Column(db.Float, nullable=False)
    center_lng = db.Column(db.Float, nullable=False)
    radius_km = db.Column(db.Float, default=1.0)  # Radius in kilometers
    color = db.Column(db.String(20), default='#10b981')  # Display color
    description = db.Column(db.Text)
    created_by = db.Column(db.String(100), default='admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)


class Notification(db.Model):
    """In-app notifications for tourists"""
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tourist_id = db.Column(db.Integer, db.ForeignKey('tourist_profiles.id'), nullable=True)
    message = db.Column(db.Text, nullable=False)
    notif_type = db.Column(db.String(30), default='info')  # 'info', 'warning', 'danger', 'success'
    title = db.Column(db.String(100))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='notifications')
