"""
Database Initialization Script
Run this to create tables and seed demo data
"""
from app import app, db
from models import User, TouristProfile, Alert, EvidenceLog, SOSRequest, EFIR, HospitalRequest, Criminal, CriminalDetection, GeoFence, Notification
from datetime import datetime, timedelta
import random

def init_database():
    with app.app_context():
        # Drop all tables and recreate
        print("Dropping existing tables...")
        db.drop_all()
        
        print("Creating tables...")
        db.create_all()
        
        print("Seeding demo users...")
        
        # Create Tourist User
        tourist_user = User(username='tourist', email='tourist@demo.com', role='TOURIST')
        tourist_user.set_password('tourist@123')
        db.session.add(tourist_user)
        db.session.flush()
        
        # Create Tourist Profile
        tourist_profile = TouristProfile(
            user_id=tourist_user.id,
            first_name='Rahul',
            last_name='Verma',
            name='Rahul Verma',
            digital_id='TID-IND-0001',
            tourist_type='INDIAN',
            nationality='Indian',
            passport_number='J8765432',
            contact='+91-9876543210',
            aadhar_number='123456789012',
            address='123 MG Road, Delhi, India - 110001',
            emergency_contact='+91-9999999999',
            hotel_name='Grand Palace Hotel',
            check_in_date=datetime.now().date(),
            travel_plan='["Red Fort", "India Gate", "Qutub Minar"]',
            safety_score=92,
            current_lat=28.6139,
            current_lng=77.2090,
            last_location='Central Delhi',
            status='Safe',
            from_location='Delhi',
            to_location='Agra',
            tour_start_date=datetime.now().date(),
            tour_end_date=(datetime.now() + timedelta(days=7)).date(),
            zone_status='safe'
        )
        db.session.add(tourist_profile)
        
        # Create Admin User
        admin_user = User(username='admin', email='admin@shield.com', role='ADMIN')
        admin_user.set_password('admin@123')
        db.session.add(admin_user)
        
        # Create Police User
        police_user = User(username='police', email='police@shield.com', role='POLICE')
        police_user.set_password('police@123')
        db.session.add(police_user)
        
        db.session.commit()
        print("✅ Demo users created (tourist/tourist@123, admin/admin@123, police/police@123)")
        
        # Create demo tourists - Mix of Indian and Foreign
        print("Creating demo tourist profiles...")
        # Demo tourist data with route info
        demo_tourists_data = [
            # Indian Tourists
            {'name': 'Priya Sharma', 'id': 'TID-IND-0002', 'type': 'INDIAN', 'aadhar': '234567890123', 'mobile': '+91-9876543211', 'address': '45 Park Street, Mumbai', 'hotel': 'Taj Hotel', 'from': 'Mumbai', 'to': 'Goa', 'fn': 'Priya', 'ln': 'Sharma'},
            {'name': 'Amit Kumar', 'id': 'TID-IND-0003', 'type': 'INDIAN', 'aadhar': '345678901234', 'mobile': '+91-9876543212', 'address': '78 Lake Road, Bangalore', 'hotel': 'Oberoi Hotel', 'from': 'Bangalore', 'to': 'Mysore', 'fn': 'Amit', 'ln': 'Kumar'},
            {'name': 'Anjali Singh', 'id': 'TID-IND-0004', 'type': 'INDIAN', 'aadhar': '456789012345', 'mobile': '+91-9876543213', 'address': '90 Ring Road, Chennai', 'hotel': 'Leela Palace', 'from': 'Chennai', 'to': 'Mahabalipuram', 'fn': 'Anjali', 'ln': 'Singh'},
            
            # Foreign Tourists
            {'name': 'Sarah Johnson', 'id': 'TID-FOR-0001', 'type': 'FOREIGN', 'passport': 'US1234567', 'email': 'sarah.j@email.com', 'country': 'USA', 'hotel': 'ITC Maurya', 'from': 'Delhi', 'to': 'Jaipur', 'fn': 'Sarah', 'ln': 'Johnson'},
            {'name': 'Michael Chen', 'id': 'TID-FOR-0002', 'type': 'FOREIGN', 'passport': 'CN7654321', 'email': 'mchen@email.com', 'country': 'China', 'hotel': 'Hyatt Regency', 'from': 'Delhi', 'to': 'Agra', 'fn': 'Michael', 'ln': 'Chen'},
            {'name': 'Emma Wilson', 'id': 'TID-FOR-0003', 'type': 'FOREIGN', 'passport': 'UK9876543', 'email': 'emma.w@email.com', 'country': 'United Kingdom', 'hotel': 'Shangri-La', 'from': 'Mumbai', 'to': 'Goa', 'fn': 'Emma', 'ln': 'Wilson'},
            {'name': 'Carlos Rodriguez', 'id': 'TID-FOR-0004', 'type': 'FOREIGN', 'passport': 'ES5432167', 'email': 'carlos.r@email.com', 'country': 'Spain', 'hotel': 'Roseate House', 'from': 'Jaipur', 'to': 'Varanasi', 'fn': 'Carlos', 'ln': 'Rodriguez'},
            {'name': 'Yuki Tanaka', 'id': 'TID-FOR-0005', 'type': 'FOREIGN', 'passport': 'JP1928374', 'email': 'yuki.t@email.com', 'country': 'Japan', 'hotel': 'Clarks', 'from': 'Kolkata', 'to': 'Darjeeling', 'fn': 'Yuki', 'ln': 'Tanaka'},
            {'name': 'Sophie Martin', 'id': 'TID-FOR-0006', 'type': 'FOREIGN', 'passport': 'FR6574839', 'email': 'sophie.m@email.com', 'country': 'France', 'hotel': 'Radisson Blu', 'from': 'Delhi', 'to': 'Rishikesh', 'fn': 'Sophie', 'ln': 'Martin'},
            {'name': 'Hans Mueller', 'id': 'TID-FOR-0007', 'type': 'FOREIGN', 'passport': 'DE8529637', 'email': 'hans.m@email.com', 'country': 'Germany', 'hotel': 'Crowne Plaza', 'from': 'Bangalore', 'to': 'Hampi', 'fn': 'Hans', 'ln': 'Mueller'}
        ]
        
        locations = [
            (28.6129, 77.2295, "Connaught Place"),
            (28.6562, 77.2410, "Red Fort Area"),
            (28.5244, 77.1855, "Qutub Minar"),
            (28.5933, 77.2507, "Lotus Temple"),
            (28.6469, 77.2167, "Chandni Chowk")
        ]
        
        for i, demo_data in enumerate(demo_tourists_data):
            # Create user
            demo_user = User(username=f"demo{i+2}", role='TOURIST')
            demo_user.set_password('demo123')
            db.session.add(demo_user)
            db.session.flush()
            
            # Create profile
            lat, lng, loc = random.choice(locations)
            score = random.randint(70, 98)
            status = "Safe" if score >= 80 else ("Moderate Risk" if score >= 60 else "High Risk")
            
            demo_tourist = TouristProfile(
                user_id=demo_user.id,
                first_name=demo_data.get('fn', demo_data['name'].split()[0]),
                last_name=demo_data.get('ln', demo_data['name'].split()[-1]),
                name=demo_data['name'],
                digital_id=demo_data['id'],
                tourist_type=demo_data['type'],
                hotel_name=demo_data['hotel'],
                check_in_date=datetime.now().date() - timedelta(days=random.randint(1, 5)),
                travel_plan='["Taj Mahal", "Agra Fort", "India Gate"]',
                safety_score=score,
                current_lat=lat,
                current_lng=lng,
                last_location=loc,
                status=status,
                from_location=demo_data.get('from', 'Delhi'),
                to_location=demo_data.get('to', 'Agra'),
                tour_start_date=datetime.now().date() - timedelta(days=random.randint(0, 3)),
                tour_end_date=(datetime.now() + timedelta(days=random.randint(3, 10))).date(),
                zone_status='safe'
            )
            
            # Set type-specific fields
            if demo_data['type'] == 'INDIAN':
                demo_tourist.nationality = 'Indian'
                demo_tourist.aadhar_number = demo_data['aadhar']
                demo_tourist.contact = demo_data['mobile']
                demo_tourist.address = demo_data['address']
                demo_tourist.emergency_contact = f"+91-{random.randint(9000000000, 9999999999)}"
            else:  # FOREIGN
                demo_tourist.nationality = demo_data['country']
                demo_tourist.passport_number = demo_data['passport']
                demo_tourist.email = demo_data['email']
                demo_tourist.country = demo_data['country']
                demo_tourist.contact = f"+1-555-{random.randint(1000, 9999)}"
                demo_tourist.emergency_contact = f"+1-555-{random.randint(1000, 9999)}"
            
            db.session.add(demo_tourist)
        
        db.session.commit()
        print(f"✅ Created {len(demo_tourists_data)} demo tourists")
        
        # Create sample alerts
        print("Creating sample alerts...")
        alert_messages = [
            ("info", "low", "Safe route confirmed ahead"),
            ("info", "low", "Weather conditions favorable"),
            ("warning", "medium", "Moderate crowd density detected"),
            ("warning", "high", "Entering area with elevated crime statistics"),
            ("danger", "high", "Route deviation detected"),
            ("danger", "critical", "Prolonged inactivity detected")
        ]
        
        tourist_profile_id = TouristProfile.query.filter_by(digital_id='TID-IND-0001').first().id
        
        for i, (alert_type, severity, message) in enumerate(alert_messages):
            alert = Alert(
                tourist_id=tourist_profile_id if i % 2 == 0 else None,
                severity=severity,
                alert_type=alert_type,
                message=message,
                created_at=datetime.now() - timedelta(minutes=random.randint(5, 120))
            )
            db.session.add(alert)
        
        db.session.commit()
        print(f"✅ Created {len(alert_messages)} sample alerts")
        
        # Create sample geo-fence zones
        print("Creating sample geo-fence zones...")
        sample_fences = [
            GeoFence(
                name='Connaught Place — Tourist Zone',
                zone_type='safe',
                center_lat=28.6315,
                center_lng=77.2167,
                radius_km=1.5,
                color='#10b981',
                description='Main tourist hub in Central Delhi',
                created_by='admin',
                is_active=True
            ),
            GeoFence(
                name='Red Fort Heritage Area',
                zone_type='safe',
                center_lat=28.6562,
                center_lng=77.2410,
                radius_km=1.0,
                color='#10b981',
                description='UNESCO World Heritage Site — guided tours only',
                created_by='admin',
                is_active=True
            ),
            GeoFence(
                name='Chandni Chowk — Caution Zone',
                zone_type='restricted',
                center_lat=28.6505,
                center_lng=77.2303,
                radius_km=0.8,
                color='#ef4444',
                description='High crowd density — pickpocket risk area',
                created_by='admin',
                is_active=True
            ),
        ]
        for fence in sample_fences:
            db.session.add(fence)
        
        db.session.commit()
        print(f"✅ Created {len(sample_fences)} sample geo-fence zones")
        
        # Welcome notification for demo tourist
        main_tourist = TouristProfile.query.filter_by(digital_id='TID-IND-0001').first()
        welcome_notif = Notification(
            user_id=tourist_user.id,
            tourist_id=main_tourist.id,
            title='🛡️ Welcome to Smart Tourist Shield!',
            message='Your tour from Delhi to Agra is registered. Stay inside green zones for maximum safety.',
            notif_type='success',
            is_read=False
        )
        db.session.add(welcome_notif)
        db.session.commit()
        print("✅ Welcome notification created for demo tourist")
        
        # Create sample criminals
        print("Creating criminal database...")
        criminals_data = [
            {'id': 'CRIM-001', 'name': 'Rajesh Verma', 'risk': 'HIGH', 'offenses': 'Theft, Assault', 'desc': 'Known pickpocket targeting tourists'},
            {'id': 'CRIM-002', 'name': 'John Smith', 'risk': 'CRITICAL', 'offenses': 'Robbery, Violence', 'desc': 'Armed robbery suspect'},
            {'id': 'CRIM-003', 'name': 'Mohammed Khan', 'risk': 'MEDIUM', 'offenses': 'Fraud, Scam', 'desc': 'Tourist scam artist'},
            {'id': 'CRIM-004', 'name': 'Li Wei', 'risk': 'HIGH', 'offenses': 'Drug Trafficking', 'desc': 'International drug smuggler'}
        ]
        
        for crim_data in criminals_data:
            criminal = Criminal(
                criminal_id=crim_data['id'],
                name=crim_data['name'],
                risk_level=crim_data['risk'],
                offenses=crim_data['offenses'],
                description=crim_data['desc'],
                is_active=True,
                last_seen=random.choice(['Central Delhi', 'Connaught Place', 'Red Fort Area'])
            )
            db.session.add(criminal)
        
        db.session.commit()
        print(f"✅ Created {len(criminals_data)} criminals in database")
        
        # Create sample SOS and Hospital requests
        print("Creating sample emergency requests...")
        sos_count = 0
        hosp_count = 0
        
        # Create 2 sample SOS requests
        sample_tourists = TouristProfile.query.limit(3).all()
        if len(sample_tourists) >= 2:
            for i in range(2):
                tourist = sample_tourists[i]
                sos = SOSRequest(
                    tourist_id=tourist.id,
                    location=tourist.last_location,
                    latitude=tourist.current_lat,
                    longitude=tourist.current_lng,
                    status='pending' if i == 0 else 'dispatched',
                    created_at=datetime.now() - timedelta(minutes=random.randint(5, 30))
                )
                db.session.add(sos)
                sos_count += 1
                
                # Also create hospital request for same incident
                hosp = HospitalRequest(
                    tourist_id=tourist.id,
                    location=tourist.last_location,
                    latitude=tourist.current_lat,
                    longitude=tourist.current_lng,
                    status='pending' if i == 0 else 'dispatched',
                    assigned_unit=f'AMB-{random.randint(100, 999)}' if i == 1 else None,
                    created_at=datetime.now() - timedelta(minutes=random.randint(5, 30))
                )
                db.session.add(hosp)
                hosp_count += 1
        
        db.session.commit()
        print(f"✅ Created {sos_count} SOS requests and {hosp_count} hospital requests")
        
        # Create sample criminal detection
        print("Creating criminal detection logs...")
        criminals_list = Criminal.query.all()
        if criminals_list:
            detection = CriminalDetection(
                criminal_id=criminals_list[0].id,
                location='Red Fort Area',
                latitude=28.6562,
                longitude=77.2410,
                detection_method='ID_MATCH',
                detected_at=datetime.now() - timedelta(hours=2),
                notes=f'Detected {criminals_list[0].name} entering tourist zone'
            )
            db.session.add(detection)
            db.session.commit()
            print("✅ Created 1 criminal detection log")
        
        print("\n" + "="*60)
        print("✅ DATABASE INITIALIZED SUCCESSFULLY!")
        print("="*60)
        print("\n🔐 Login Credentials:")
        print("  Tourist: tourist / tourist@123")
        print("  Admin  : admin / admin@123")
        print("  Police : police / police@123")
        print("\n✅ Demo Data Summary:")
        print(f"  - 11 Tourists (4 Indian, 7 Foreign)")
        print(f"  - {len(alert_messages)} Alerts")
        print(f"  - {len(criminals_data)} Criminals")
        print(f"  - {sos_count} SOS Requests (Police)")
        print(f"  - {hosp_count} Hospital Requests (Ambulance)")
        print(f"  - 1 Criminal Detection Event")
        print("\n🚀 Ready to run: python app.py")
        print(f"🌐 Then visit: http://localhost:5000")
        print("="*60)

if __name__ == '__main__':
    init_database()
