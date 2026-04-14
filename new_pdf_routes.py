# Add these new routes after the existing tourist_pdf_safety_report route (around line 574)

@app.route('/tourist/pdf/alert-history')
@login_required
def tourist_pdf_alert_history():
    """Generate Alert History PDF for current tourist"""
    if current_user.role != 'TOURIST':
        return "Unauthorized", 403
    
    tourist_profile = TouristProfile.query.filter_by(user_id=current_user.id).first()
    alerts = Alert.query.filter_by(tourist_id=tourist_profile.id).order_by(Alert.created_at.desc()).all()
    
    pdf_path = f'temp/alert_history_{tourist_profile.digital_id}.pdf'
    pdf_gen.generate_alert_history_pdf(tourist_profile, alerts, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Alert_History_{tourist_profile.digital_id}.pdf')

@app.route('/tourist/pdf/digital-id')
@login_required
def tourist_pdf_digital_id():
    """Generate Digital ID Card PDF for current tourist"""
    if current_user.role != 'TOURIST':
        return "Unauthorized", 403
    
    tourist_profile = TouristProfile.query.filter_by(user_id=current_user.id).first()
    
    pdf_path = f'temp/digital_id_{tourist_profile.digital_id}.pdf'
    pdf_gen.generate_digital_id_card_pdf(tourist_profile, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Digital_ID_{tourist_profile.digital_id}.pdf')

# Cross-role PDF downloads - Admin can download any tourist's safety report
@app.route('/admin/tourist/<int:tourist_id>/safety-report')
@login_required
def admin_download_tourist_safety_report(tourist_id):
    """Admin downloads safety report for specific tourist"""
    if current_user.role != 'ADMIN':
        return "Unauthorized", 403
    
    tourist_profile = TouristProfile.query.get_or_404(tourist_id)
    alerts = Alert.query.filter_by(tourist_id=tourist_profile.id).order_by(Alert.created_at.desc()).limit(20).all()
    
    pdf_path = f'temp/safety_report_{tourist_profile.digital_id}_admin.pdf'
    pdf_gen.generate_tourist_safety_report(tourist_profile, alerts, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Safety_Report_{tourist_profile.digital_id}.pdf')

# Cross-role PDF downloads - Police can download any tourist's safety report
@app.route('/police/tourist/<int:tourist_id>/safety-report')
@login_required
def police_download_tourist_safety_report(tourist_id):
    """Police downloads safety report for specific tourist"""
    if current_user.role != 'POLICE':
        return "Unauthorized", 403
    
    tourist_profile = TouristProfile.query.get_or_404(tourist_id)
    alerts = Alert.query.filter_by(tourist_id=tourist_profile.id).order_by(Alert.created_at.desc()).limit(20).all()
    
    pdf_path = f'temp/safety_report_{tourist_profile.digital_id}_police.pdf'
    pdf_gen.generate_tourist_safety_report(tourist_profile, alerts, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Safety_Report_{tourist_profile.digital_id}.pdf')

# Admin dashboard comprehensive downloads
@app.route('/admin/pdf/daily-summary')
@login_required
def admin_pdf_daily_summary():
    """Generate Daily Summary Report for Admin"""
    if current_user.role != 'ADMIN':
        return "Unauthorized", 403
    
    tourists = TouristProfile.query.all()
    sos_requests = SOSRequest.query.filter_by(status='pending').all()
    alerts = Alert.query.filter(Alert.severity.in_(['high', 'critical'])).order_by(Alert.created_at.desc()).limit(50).all()
    
    pdf_path = f'temp/daily_summary_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_daily_summary_pdf(tourists, sos_requests, alerts, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Daily_Summary_{datetime.now().strftime("%Y%m%d")}.pdf')

@app.route('/admin/pdf/sos-report')
@login_required
def admin_pdf_sos_report():
    """Generate SOS Report for Admin"""
    if current_user.role != 'ADMIN':
        return "Unauthorized", 403
    
    sos_requests = SOSRequest.query.order_by(SOSRequest.created_at.desc()).all()
    hospital_requests = HospitalRequest.query.order_by(HospitalRequest.created_at.desc()).all()
    
    pdf_path = f'temp/sos_report_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_sos_report_pdf(sos_requests, hospital_requests, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'SOS_Report_{datetime.now().strftime("%Y%m%d")}.pdf')

@app.route('/admin/pdf/evidence-logs')
@login_required
def admin_pdf_evidence_logs():
    """Generate Evidence Logs for Admin"""
    if current_user.role != 'ADMIN':
        return "Unauthorized", 403
    
    evidence = EvidenceLog.query.order_by(EvidenceLog.timestamp.desc()).all()
    
    pdf_path = f'temp/evidence_logs_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_evidence_logs_pdf(evidence, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Evidence_Logs_{datetime.now().strftime("%Y%m%d")}.pdf')

@app.route('/admin/pdf/efir-archive')
@login_required
def admin_pdf_efir_archive():
    """Generate E-FIR Archive for Admin"""
    if current_user.role != 'ADMIN':
        return "Unauthorized", 403
    
    sos_requests = SOSRequest.query.filter_by(status='dispatched').order_by(SOSRequest.created_at.desc()).all()
    
    pdf_path = f'temp/efir_archive_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_efir_archive_pdf(sos_requests, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'EFIR_Archive_{datetime.now().strftime("%Y%m%d")}.pdf')

# Police dashboard comprehensive downloads (same reports accessible to police)
@app.route('/police/pdf/daily-summary')
@login_required
def police_pdf_daily_summary():
    """Generate Daily Summary Report for Police"""
    if current_user.role != 'POLICE':
        return "Unauthorized", 403
    
    tourists = TouristProfile.query.all()
    sos_requests = SOSRequest.query.filter_by(status='pending').all()
    alerts = Alert.query.filter(Alert.severity.in_(['high', 'critical'])).order_by(Alert.created_at.desc()).limit(50).all()
    
    pdf_path = f'temp/daily_summary_police_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_daily_summary_pdf(tourists, sos_requests, alerts, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Daily_Summary_{datetime.now().strftime("%Y%m%d")}.pdf')

@app.route('/police/pdf/sos-report')
@login_required
def police_pdf_sos_report():
    """Generate SOS Report for Police"""
    if current_user.role != 'POLICE':
        return "Unauthorized", 403
    
    sos_requests = SOSRequest.query.order_by(SOSRequest.created_at.desc()).all()
    hospital_requests = HospitalRequest.query.order_by(HospitalRequest.created_at.desc()).all()
    
    pdf_path = f'temp/sos_report_police_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_sos_report_pdf(sos_requests, hospital_requests, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'SOS_Report_{datetime.now().strftime("%Y%m%d")}.pdf')

@app.route('/police/pdf/evidence-logs')
@login_required
def police_pdf_evidence_logs():
    """Generate Evidence Logs for Police"""
    if current_user.role != 'POLICE':
        return "Unauthorized", 403
    
    evidence = EvidenceLog.query.order_by(EvidenceLog.timestamp.desc()).all()
    
    pdf_path = f'temp/evidence_logs_police_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_evidence_logs_pdf(evidence, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'Evidence_Logs_{datetime.now().strftime("%Y%m%d")}.pdf')

@app.route('/police/pdf/efir-archive')
@login_required
def police_pdf_efir_archive():
    """Generate E-FIR Archive for Police"""
    if current_user.role != 'POLICE':
        return "Unauthorized", 403
    
    sos_requests = SOSRequest.query.filter_by(status='dispatched').order_by(SOSRequest.created_at.desc()).all()
    
    pdf_path = f'temp/efir_archive_police_{datetime.now().strftime("%Y%m%d")}.pdf'
    pdf_gen.generate_efir_archive_pdf(sos_requests, pdf_path)
    
    return send_file(pdf_path, as_attachment=True, download_name=f'EFIR_Archive_{datetime.now().strftime("%Y%m%d")}.pdf')
