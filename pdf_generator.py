"""
PDF Generation Utilities using ReportLab
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import os

class PDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        
    def generate_tourist_safety_report(self, tourist_profile, alerts, output_path):
        """Generate Tourist Safety Report PDF with Modern Design"""
        doc = SimpleDocTemplate(output_path, pagesize=letter,
                                leftMargin=0.75*inch, rightMargin=0.75*inch,
                                topMargin=0.75*inch, bottomMargin=0.75*inch)
        story = []
        
        # Modern Title with Gradient Color Theme
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#667eea'),
            spaceAfter=10,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#6b7280'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        story.append(Paragraph("🛡️ Tourist Safety Report", title_style))
        story.append(Paragraph("Smart Tourist Shield AI - Safety Monitoring System", subtitle_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Profile Information with Enhanced Details
        profile_data = [
            [Paragraph("<b>Tourist Information</b>", self.styles['Heading2']), ""],
            ["Name:", tourist_profile.name],
            ["Digital ID:", tourist_profile.digital_id],
            ["Tourist Type:", f"{tourist_profile.tourist_type} Tourist" if tourist_profile.tourist_type else "N/A"],
            ["Nationality:", tourist_profile.nationality or "N/A"],
        ]
        
        # Add type-specific fields
        if tourist_profile.tourist_type == 'INDIAN':
            profile_data.extend([
                ["Aadhar Number:", tourist_profile.aadhar_number or "N/A"],
                ["Address:", tourist_profile.address or "N/A"],
                ["Mobile:", tourist_profile.contact or "N/A"]
            ])
        else:
            profile_data.extend([
                ["Passport Number:", tourist_profile.passport_number or "N/A"],
                ["Email:", tourist_profile.email or "N/A"],
                ["Country:", tourist_profile.country or "N/A"],
                ["Contact:", tourist_profile.contact or "N/A"]
            ])
        
        profile_data.extend([
            ["Emergency Contact:", tourist_profile.emergency_contact or "N/A"],
            ["", ""],
            [Paragraph("<b>Safety Status</b>", self.styles['Heading3']), ""],
            ["Safety Score:", f"⭐ {tourist_profile.safety_score}/100"],
            ["Status:", tourist_profile.status],
            ["Last Location:", tourist_profile.last_location],
            ["Last Update:", tourist_profile.last_update.strftime("%Y-%m-%d %H:%M:%S") if tourist_profile.last_update else "N/A"],
            ["Report Generated:", datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        ])
        
        profile_table = Table(profile_data, colWidths=[2.5*inch, 4*inch])
        profile_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#e0e7ff')),
            ('BACKGROUND', (0, 11), (-1, 11), colors.HexColor('#667eea')),
            ('TEXTCOLOR', (0, 11), (-1, 11), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(profile_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Alerts Section with Modern Design
        alert_title_style = ParagraphStyle(
            'AlertTitle',
            parent=self.styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#667eea'),
            spaceAfter=15,
            spaceBefore=10,
            fontName='Helvetica-Bold'
        )
        story.append(Paragraph("📊 Recent Alerts & Notifications", alert_title_style))
        
        if alerts:
            alert_data = [[Paragraph("<b>Severity</b>", self.styles['Normal']), 
                          Paragraph("<b>Type</b>", self.styles['Normal']), 
                          Paragraph("<b>Message</b>", self.styles['Normal']),  
                          Paragraph("<b>Time</b>", self.styles['Normal'])]]
            
            for alert in alerts:
                # Color-code severity
                severity_color = {
                    'low': '#3b82f6',
                    'medium': '#f59e0b',
                    'high': '#ef4444',
                    'critical': '#dc2626'
                }.get(alert.severity, '#6b7280')
                
                severity_para = Paragraph(f"<font color='{severity_color}'><b>{alert.severity.upper()}</b></font>", 
                                        self.styles['Normal'])
                type_para = Paragraph(alert.alert_type.upper(), self.styles['Normal'])
                msg_para = Paragraph(alert.message, self.styles['Normal'])
                time_para = Paragraph(alert.created_at.strftime("%H:%M<br/>%m-%d"), self.styles['Normal'])
                
                alert_data.append([severity_para, type_para, msg_para, time_para])
            
            alert_table = Table(alert_data, colWidths=[1*inch, 1*inch, 3.5*inch, 1*inch])
            alert_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')])
            ]))
            story.append(alert_table)
        else:
            story.append(Paragraph("✅ No alerts recorded - All clear!", self.styles['Normal']))
        
        story.append(Spacer(1, 0.4*inch))
        
        # Professional Footer
        footer_style = ParagraphStyle(
            'Footer',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            spaceBefore=20
        )
        
        footer_text = """
        <para alignment='center'>
        <b>Smart Tourist Shield AI</b><br/>
        AI-Powered Safety Monitoring & Emergency Response System<br/>
        This report is generated automatically and contains real-time safety information.<br/>
        For emergencies, please use the SOS panic button or contact local authorities.
        </para>
        """
        story.append(Paragraph(footer_text, footer_style))
        
        # Build PDF
        doc.build(story)
        return output_path
    
    def generate_efir_pdf(self, efir, tourist_profile, output_path):
        """Generate E-FIR PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=A4)
        story = []
        
        # Header
        title_style = ParagraphStyle(
            'FIRTitle',
            parent=self.styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#ef4444'),
            spaceAfter=20,
            alignment=TA_CENTER
        )
        story.append(Paragraph(f"E-FIR: {efir.fir_number}", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        # E-FIR Details
        fir_data = [
            ["FIR Number:", efir.fir_number],
            ["Incident Type:", efir.incident_type],
            ["Tourist Name:", tourist_profile.name],
            ["Digital ID:", tourist_profile.digital_id],
            ["Location:", efir.location or "Unknown"],
            ["Filed At:", efir.filed_at.strftime("%Y-%m-%d %H:%M:%S")],
            ["Status:", efir.status],
            ["Assigned Officer:", efir.assigned_officer],
        ]
        
        fir_table = Table(fir_data, colWidths=[2*inch, 4*inch])
        fir_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#fee2e2')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('PADDING', (0, 0), (-1, -1), 12)
        ]))
        story.append(fir_table)
        story.append(Spacer(1, 0.3*inch))
        
        # Description
        if efir.description:
            story.append(Paragraph("<b>Description:</b>", self.styles['Heading3']))
            story.append(Paragraph(efir.description, self.styles['Normal']))
        
        doc.build(story)
        return output_path
    
    def generate_admin_summary_pdf(self, stats, top_alerts, output_path):
        """Generate Admin Daily Summary PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'AdminTitle',
            parent=self.styles['Heading1'],
            fontSize=22,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        story.append(Paragraph("🎯 Daily Tourist Safety Summary", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Stats
        stats_data = [
            ["Metric", "Value"],
            ["Total Tourists Monitored", str(stats.get('total_tourists', 0))],
            ["Active Tourists", str(stats.get('active_tourists', 0))],
            ["Total Alerts Today", str(stats.get('total_alerts', 0))],
            ["Critical Alerts", str(stats.get('critical_alerts', 0))],
            ["SOS Requests", str(stats.get('sos_count', 0))],
            ["E-FIRs Filed", str(stats.get('efir_count', 0))],
        ]
        
        stats_table = Table(stats_data, colWidths=[3*inch, 2*inch])
        stats_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
            ('PADDING', (0, 0), (-1, -1), 10)
        ]))
        story.append(stats_table)
        story.append(Spacer(1, 0.4*inch))
        
        # Top Alerts
        story.append(Paragraph("Top Critical Alerts", self.styles['Heading2']))
        story.append(Spacer(1, 0.2*inch))
        
        if top_alerts:
            alert_data = [["Time", "Tourist ID", "Message"]]
            for alert in top_alerts:
                tourist_id = alert.tourist.digital_id if alert.tourist else "SYSTEM"
                alert_data.append([
                    alert.created_at.strftime("%H:%M"),
                    tourist_id,
                    alert.message[:50] + "..." if len(alert.message) > 50 else alert.message
                ])
            
            alert_table = Table(alert_data, colWidths=[1.2*inch, 1.3*inch, 4*inch])
            alert_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ef4444')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')])
            ]))
            story.append(alert_table)
        
        doc.build(story)
        return output_path
    
    def generate_alert_history_pdf(self, tourist_profile, alerts, output_path):
        """Generate comprehensive alert history PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        title_style = ParagraphStyle('Title', parent=self.styles['Heading1'], fontSize=24, textColor=colors.HexColor('#667eea'), alignment=TA_CENTER, spaceAfter=20)
        story.append(Paragraph("📋 Alert History Report", title_style))
        story.append(Paragraph(f"Tourist: {tourist_profile.name} ({tourist_profile.digital_id})", self.styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        if alerts:
            alert_data = [[Paragraph("<b>Time</b>", self.styles['Normal']), Paragraph("<b>Severity</b>", self.styles['Normal']), Paragraph("<b>Message</b>", self.styles['Normal'])]]
            
            for alert in alerts:
                severity_colors = {'low': '#3b82f6', 'medium': '#f59e0b', 'high': '#ef4444', 'critical': '#dc2626'}
                color = severity_colors.get(alert.severity, '#6b7280')
                
                alert_data.append([
                    alert.created_at.strftime('%Y-%m-%d %H:%M'),
                    Paragraph(f'<font color="{color}"><b>{alert.severity.upper()}</b></font>', self.styles['Normal']),
                    Paragraph(alert.message, self.styles['Normal'])
                ])
            
            table = Table(alert_data, colWidths=[1.5*inch, 1.2*inch, 4*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#667eea')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ]))
            story.append(table)
        else:
            story.append(Paragraph("No alerts found.", self.styles['Normal']))
        
        doc.build(story)
    
    def generate_digital_id_card_pdf(self, tourist_profile, output_path):
        """Generate digital ID card PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        title_style = ParagraphStyle('Title', parent=self.styles['Heading1'], fontSize=28, textColor=colors.HexColor('#667eea'), alignment=TA_CENTER, spaceAfter=30)
        story.append(Paragraph("🪪 Digital Tourist ID Card", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        id_data = [
            ["Digital ID:", tourist_profile.digital_id],
            ["Name:", tourist_profile.name],
            ["Type:", f"{tourist_profile.tourist_type} Tourist" if tourist_profile.tourist_type else "N/A"],
            ["Nationality:", tourist_profile.nationality or "N/A"],
        ]
        
        if tourist_profile.tourist_type == 'INDIAN':
            id_data.extend([["Aadhar:", tourist_profile.aadhar_number or "N/A"], ["Mobile:", tourist_profile.contact or "N/A"]])
        else:
            id_data.extend([["Passport:", tourist_profile.passport_number or "N/A"], ["Email:", tourist_profile.email or "N/A"]])
        
        id_data.append(["Emergency Contact:", tourist_profile.emergency_contact or "N/A"])
        id_data.append(["Issued:", datetime.now().strftime('%Y-%m-%d')])
        
        table = Table(id_data, colWidths=[2*inch, 4*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(table)
        
        story.append(Spacer(1, 0.5*inch))
        footer_style = ParagraphStyle('Footer', parent=self.styles['Normal'], fontSize=9, textColor=colors.HexColor('#6b7280'), alignment=TA_CENTER)
        story.append(Paragraph("This is an official digital ID card issued by Smart Tourist Shield AI", footer_style))
        
        doc.build(story)
    
    def generate_daily_summary_pdf(self, tourists, sos_requests, alerts, output_path):
        """Generate daily summary PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        title_style = ParagraphStyle('Title', parent=self.styles['Heading1'], fontSize=24, textColor=colors.HexColor('#667eea'), alignment=TA_CENTER, spaceAfter=20)
        story.append(Paragraph(f"📊 Daily Summary Report - {datetime.now().strftime('%Y-%m-%d')}", title_style))
        story.append(Spacer(1, 0.3*inch))
        
        stats_data = [
            ["Total Tourists:", str(len(tourists))],
            ["Active SOS Requests:", str(len(sos_requests))],
            ["Critical Alerts:", str(len([a for a in alerts if a.severity == 'critical']))],
            ["High Priority Alerts:", str(len([a for a in alerts if a.severity == 'high']))],
        ]
        
        table = Table(stats_data, colWidths=[3*inch, 2*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f9fafb')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 14),
        ]))
        story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        story.append(Paragraph("<b>Recent Critical Alerts:</b>", self.styles['Heading2']))
        if alerts:
            for alert in alerts[:10]:
                story.append(Paragraph(f"• {alert.message} ({alert.created_at.strftime('%H:%M')})", self.styles['Normal']))
        else:
            story.append(Paragraph("No critical alerts today.", self.styles['Normal']))
        
        doc.build(story)
    
    def generate_sos_report_pdf(self, sos_requests, hospital_requests, output_path):
        """Generate SOS report PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        title_style = ParagraphStyle('Title', parent=self.styles['Heading1'], fontSize=24, textColor=colors.HexColor('#ef4444'), alignment=TA_CENTER, spaceAfter=20)
        story.append(Paragraph("🚨 SOS & Emergency Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        story.append(Paragraph(f"<b>Police SOS Requests: {len(sos_requests)}</b>", self.styles['Heading2']))
        if sos_requests:
            sos_data = [["Time", "Tourist", "Location", "Status"]]
            for sos in sos_requests[:20]:
                sos_data.append([
                    sos.created_at.strftime('%Y-%m-%d %H:%M'),
                    sos.tourist.name if sos.tourist else "N/A",
                    sos.location or "Unknown",
                    sos.status
                ])
            table = Table(sos_data, colWidths=[1.5*inch, 2*inch, 2.5*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ef4444')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ]))
            story.append(table)
        story.append(Spacer(1, 0.3*inch))
        
        story.append(Paragraph(f"<b>Medical/Ambulance Requests: {len(hospital_requests)}</b>", self.styles['Heading2']))
        if hospital_requests:
            hosp_data = [["Time", "Tourist", "Location", "Status"]]
            for req in hospital_requests[:20]:
                hosp_data.append([
                    req.created_at.strftime('%Y-%m-%d %H:%M'),
                    req.tourist.name if req.tourist else "N/A",
                    req.location or "Unknown",
                    req.status
                ])
            table = Table(hosp_data, colWidths=[1.5*inch, 2*inch, 2.5*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ]))
            story.append(table)
        
        doc.build(story)
    
    def generate_evidence_logs_pdf(self, evidence_list, output_path):
        """Generate evidence logs PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        title_style = ParagraphStyle('Title', parent=self.styles['Heading1'], fontSize=24, textColor=colors.HexColor('#8b5cf6'), alignment=TA_CENTER, spaceAfter=20)
        story.append(Paragraph("📸 Evidence Logs Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        if evidence_list:
            ev_data = [["Timestamp", "Location", "Event Type", "Details"]]
            for ev in evidence_list[:50]:
                ev_data.append([
                    ev.timestamp.strftime('%Y-%m-%d %H:%M'),
                    ev.location or "Unknown",
                    ev.event_type or "N/A",
                    ev.event_metadata[:50] if ev.event_metadata else "N/A"
                ])
            
            table = Table(ev_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
            ]))
            story.append(table)
        else:
            story.append(Paragraph("No evidence logs available.", self.styles['Normal']))
        
        doc.build(story)
    
    def generate_efir_archive_pdf(self, sos_requests, output_path):
        """Generate E-FIR archive PDF"""
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        story = []
        
        title_style = ParagraphStyle('Title', parent=self.styles['Heading1'], fontSize=24, textColor=colors.HexColor('#dc2626'), alignment=TA_CENTER, spaceAfter=20)
        story.append(Paragraph("📝 E-FIR Archive Report", title_style))
        story.append(Paragraph("Electronic First Information Reports", self.styles['Normal']))
        story.append(Spacer(1, 0.3*inch))
        
        if sos_requests:
            fir_data = [["FIR #", "Date/Time", "Tourist", "Location", "Status"]]
            for idx, sos in enumerate(sos_requests[:30], 1):
                fir_data.append([
                    f"FIR-{datetime.now().year}-{idx:04d}",
                    sos.created_at.strftime('%Y-%m-%d %H:%M'),
                    sos.tourist.name if sos.tourist else "N/A",
                    sos.location or "Unknown",
                    sos.status.upper()
                ])
            
            table = Table(fir_data, colWidths=[1.2*inch, 1.5*inch, 2*inch, 2*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ]))
            story.append(table)
        else:
            story.append(Paragraph("No E-FIR records available.", self.styles['Normal']))
        
        doc.build(story)
