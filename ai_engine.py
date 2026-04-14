"""
AI Engine for Tourist Safety Monitoring
Simulates real-world AI behavior tracking
"""
import random
import time
from datetime import datetime

class AIEngine:
    def __init__(self):
        self.high_risk_zones = [
            {"lat": 28.6200, "lng": 77.2100, "radius": 0.005, "name": "Sector 4 - High Crime"},
            {"lat": 28.6050, "lng": 77.2000, "radius": 0.003, "name": "Old Market Area"}
        ]
        
    def calculate_safety_score(self, tourist_profile, alerts_count=0):
        """Calculate tourist safety score based on multiple factors"""
        base_score = 100
        
        # Factor 1: Recent alerts
        score_drop = min(alerts_count * 5, 30)
        
        # Factor 2: Check if in high-risk zone
        current_lat = tourist_profile.current_lat
        current_lng = tourist_profile.current_lng
        
        for zone in self.high_risk_zones:
            distance = ((current_lat - zone['lat'])**2 + (current_lng - zone['lng'])**2)**0.5
            if distance < zone['radius']:
                score_drop += 25
                break
        
        # Factor 3: Time-based (night hours are slightly risky)
        current_hour = datetime.now().hour
        if current_hour >= 22 or current_hour <= 5:
            score_drop += 10
        
        # Factor 4: Inactivity
        if tourist_profile.last_update:
            time_diff = (datetime.utcnow() - tourist_profile.last_update).total_seconds()
            if time_diff > 300:  # 5 minutes
                score_drop += 15
        
        final_score = max(0, base_score - score_drop)
        return final_score
    
    def get_risk_badge(self, score):
        """Determine risk badge based on score"""
        if score >= 80:
            return "Safe", "success"
        elif score >= 50:
            return "Moderate Risk", "warning"
        else:
            return "High Risk", "danger"
    
    def detect_zone_entry(self, lat, lng):
        """Check if tourist entered a high-risk zone"""
        for zone in self.high_risk_zones:
            distance = ((lat - zone['lat'])**2 + (lng - zone['lng'])**2)**0.5
            if distance < zone['radius']:
                return True, zone['name']
        return False, None
    
    def generate_random_alert(self):
        """Generate simulated AI alerts"""
        alert_templates = [
            ("info", "low", "AI detected safe route ahead"),
            ("info", "low", "Weather conditions optimal for travel"),
            ("warning", "medium", "Moderate crowd density in your area"),
            ("warning", "medium", "Route deviation detected - verify safety"),
            ("warning", "high", "Entering area with higher crime statistics"),
            ("danger", "high", "Unusual inactivity pattern detected"),
            ("danger", "critical", "Possible distress signal - location drop-off detected"),
        ]
        
        # 20% chance to generate an alert
        if random.random() < 0.2:
            alert_type, severity, message = random.choice(alert_templates)
            return {
                "type": alert_type,
                "severity": severity,
                "message": message
            }
        return None
    
    def check_route_deviation(self, expected_route, current_location):
        """Simulate route deviation check"""
        # Simple simulation: 10% chance of deviation
        if random.random() < 0.1:
            return True, "Tourist deviated from planned route"
        return False, None
    
    def detect_behavioral_flags(self, tourist_profile):
        """Detect concerning behavioral patterns"""
        flags = []
        
        # Inactivity check
        if tourist_profile.last_update:
            inactive_seconds = (datetime.utcnow() - tourist_profile.last_update).total_seconds()
            if inactive_seconds > 300:
                flags.append("Prolonged Inactivity")
        
        # Random simulation of other flags
        if random.random() < 0.05:
            flags.append("Unusual Movement Pattern")
        
        return flags
