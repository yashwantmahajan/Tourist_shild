/**
 * Tourist Shield - Hindi Language Engine
 * Provides EN <-> HI toggle for the entire application.
 * Usage: add data-i18n="key" to any element.
 *        For inputs add data-i18n-placeholder="key".
 *        For titles add data-i18n-title="key".
 */

const TRANSLATIONS = {
    en: {
        /* ── LANDING ── */
        landing_title: "Tourist Shield",
        landing_subtitle: "AI-Powered Smart Tourist Safety Monitoring & Emergency Response System",
        landing_ai: "AI Monitoring",
        landing_tracking: "Live Tracking",
        landing_sos: "Emergency SOS",
        landing_reports: "Digital Reports",
        landing_login_btn: "Login to System",

        /* ── LOGIN ── */
        login_app_title: "Smart Tourist Shield AI",
        login_app_subtitle: "AI-Powered Safety Monitoring & Emergency Response System",
        login_select_role: "Select Your Role to Continue",
        login_tourist: "Tourist",
        login_police: "Police",
        login_admin: "Admin",
        login_username_label: "Username",
        login_username_ph: "Enter your username",
        login_password_label: "Password",
        login_password_ph: "Enter your password",
        login_btn: "Secure Login",
        login_back: "Back to Home",
        login_cred_user: "Username:",
        login_cred_pass: "Password:",

        /* ── COMMON SIDEBAR / HEADER ── */
        menu_overview: "Overview",
        menu_live_tourists: "Live Tourists",
        menu_tourist_id: "Tourist ID Creation",
        menu_map: "Map View",
        menu_alerts: "Alerts Center",
        menu_sos: "SOS Dispatch",
        menu_reports: "Reports",
        menu_dashboard: "Dashboard",
        menu_safety: "Safety Score",
        menu_live_alerts: "Live Alerts",
        menu_route: "Route Tracking",
        menu_panic: "Panic SOS",
        menu_pdf: "PDF Reports",
        menu_sos_dispatch: "SOS Dispatch",
        menu_criminals: "Criminal Alerts",
        menu_critical: "Critical Alerts",
        role_admin: "Administrator",
        role_police: "Police Officer",
        role_tourist: "Tourist Portal",
        portal_admin: "Admin Portal",
        portal_police: "Law Enforcement Portal",
        portal_tourist: "Tourist Portal",
        brand_command: "Command Center",
        brand_police: "Police Command",
        brand_shield: "Shield AI",
        btn_refresh: "Refresh",

        /* ── ADMIN DASHBOARD ── */
        admin_header: "Command Center Dashboard",
        admin_subheader: "Real-time monitoring & incident management",
        admin_ai_online: "AI Engine Online",
        stat_total_tourists: "Total Tourists",
        stat_active_now: "Active Now",
        stat_total_alerts: "Total Alerts",
        stat_critical: "Critical",
        create_tourist_id: "Create New Tourist ID",
        tab_indian: "Indian Tourist",
        tab_foreign: "Foreign Tourist",
        lbl_name: "Name *",
        lbl_aadhar: "Aadhar Number *",
        lbl_aadhar_hint: "(12 digits)",
        lbl_mobile: "Mobile Number *",
        lbl_mobile_ph: "+91-XXXXXXXXXX",
        lbl_address: "Address *",
        btn_create_indian: "Create Indian Tourist ID",
        lbl_passport: "Passport Number *",
        lbl_email: "Email *",
        lbl_country: "Country *",
        btn_create_foreign: "Create Foreign Tourist ID",
        live_tourist_monitoring: "Live Tourist Monitoring",
        auto_refresh_10: "Auto-Refresh (10s)",
        th_id: "ID",
        th_name: "Name",
        th_safety_score: "Safety Score",
        th_status: "Status",
        th_location: "Location",
        th_actions: "Actions",
        live_tracking_map: "Live Tourist Tracking Map",
        active_badge: "Active",
        map_safe: "Safe (80%+)",
        map_moderate: "Moderate (50-80%)",
        map_high_risk: "High Risk (<50%)",
        map_risk_zones: "Risk Zones",
        alerts_command: "Alerts Command Center",
        filter_all: "All",
        filter_low: "Low",
        filter_medium: "Medium",
        filter_high: "High",
        filter_critical: "Critical",
        sos_panel: "SOS Dispatch Panel",
        no_sos: "No active SOS requests",
        dispatch_police: "DISPATCH POLICE UNITS",
        hospital_panel: "Hospital/Ambulance Dispatch Panel",
        no_ambulance: "No active ambulance requests",
        dispatch_ambulance: "DISPATCH AMBULANCE",
        sys_health: "System Health",
        sys_ai_engine: "AI Engine",
        sys_gps: "GPS Tracking",
        sys_alert_sys: "Alert System",
        sys_database: "Database",
        status_running: "✓ Running",
        status_online: "✓ Online",
        status_active: "✓ Active",
        status_connected: "✓ Connected",
        records_summary: "Records Summary",
        rec_sos: "SOS Requests",
        rec_efir: "E-FIRs Filed",
        rec_evidence: "Evidence Logs",
        rec_critical: "Critical Incidents",
        admin_reports: "Administrative Reports & Downloads",
        pdf_daily: "Daily Summary",
        pdf_daily_desc: "Complete tourist safety overview",
        pdf_sos: "SOS Report",
        pdf_sos_desc: "Emergency incidents log",
        pdf_evidence: "Evidence Logs",
        pdf_evidence_desc: "All evidence & timestamps",
        pdf_efir: "E-FIR Archive",
        pdf_efir_desc: "All filed FIRs",
        btn_download: "Download PDF",

        /* ── TOURIST DASHBOARD ── */
        tourist_welcome: "Your AI guardian is watching over you",
        online_badge: "Online",
        live_safety_score: "Live Safety Score",
        score_label: "Score",
        safety_metrics: "Safety Metrics",
        stat_risk_flags: "Risk Flags",
        stat_monitoring: "Monitoring",
        live_ai_alerts: "Live AI Alerts",
        auto_refresh: "Auto-Refresh",
        live_gps: "Live GPS Tracking",
        safe_zones: "Safe Zones",
        high_risk_zones: "High Risk Zones",
        your_location: "Your Location",
        police_emergency: "Police Emergency",
        police_sos_desc: "Instantly alert police units with your exact GPS coordinates",
        btn_police_sos: "POLICE SOS",
        nearest_unit: "Nearest Unit",
        response_time: "Response Time",
        medical_emergency: "Medical Emergency",
        medical_sos_desc: "Request immediate ambulance with your exact GPS coordinates",
        btn_ambulance_sos: "AMBULANCE SOS",
        btn_track: "TRACK",
        nearest_hospital: "Nearest Hospital",
        digital_id_card: "Digital ID Card",
        lbl_passport_id: "Passport",
        lbl_nationality: "Nationality",
        lbl_hotel: "Hotel",
        lbl_emergency: "Emergency",
        emergency_instr: "Emergency Instructions",
        instr_police: "Police SOS: For crime, theft, assault, or immediate danger",
        instr_ambulance: "Ambulance SOS: For medical emergencies, injuries, or health issues",
        instr_both: "Both buttons instantly broadcast your GPS location",
        instr_24_7: "24/7 monitoring by AI and authorities",
        pdf_reports: "PDF Reports & Downloads",
        pdf_safety: "Safety Report",
        pdf_safety_desc: "Your profile, score, and recent alerts",
        pdf_alert_hist: "Alert History",
        pdf_alert_hist_desc: "Complete log of all AI alerts",
        pdf_digital_id: "Digital ID Card",
        pdf_digital_id_desc: "Official tourist ID document",
        modal_emergency: "EMERGENCY ALERT",
        modal_danger_q: "Are you in IMMEDIATE DANGER?",
        modal_danger_desc: "This will broadcast your location to all nearby police units and emergency services.",
        modal_warning: "Only activate if you need urgent help",
        btn_cancel: "Cancel",
        btn_send_sos: "YES, SEND SOS NOW",

        /* ── POLICE DASHBOARD ── */
        police_header: "Police Command Center",
        police_subheader: "Real-time emergency response & monitoring",
        stat_active_sos: "Active SOS",
        stat_critical_alerts: "Critical Alerts",
        stat_active_criminals: "Active Criminals",
        sos_police_panel: "Active SOS Dispatch - Police Units",
        criminal_detections: "Criminal Detections",
        no_criminal: "No recent criminal detections",
        police_critical_alerts: "Critical Alerts",
        no_critical: "No critical alerts",
        live_tourist_tracking: "Live Tourist Tracking",
        tourist_info_modal: "Tourist Information",

        /* ── LANGUAGE BUTTON ── */
        lang_hindi: "🇮🇳 हिंदी",
        lang_english: "🇬🇧 English",

        /* ── ALERT SEVERITY LABELS ── */
        severity_low: "LOW",
        severity_medium: "MEDIUM",
        severity_high: "HIGH",
        severity_critical: "CRITICAL",
        no_alerts_text: "No alerts",

        /* ── ALERT MESSAGES ── */
        alert_msg_safe_route: "AI detected safe route ahead",
        alert_msg_weather_ok: "Weather conditions optimal for travel",
        alert_msg_crowd: "Moderate crowd density in your area",
        alert_msg_route_deviation: "Route deviation detected - verify safety",
        alert_msg_crime_area: "Entering area with higher crime statistics",
        alert_msg_inactivity: "Unusual inactivity pattern detected",
        alert_msg_distress: "Possible distress signal - location drop-off detected",
        alert_msg_zone: "Entered high-risk zone",
        alert_msg_police_sos: "needs immediate police assistance!",
        alert_msg_medical_sos: "needs immediate medical assistance!",
        alert_msg_panic: "in IMMEDIATE DANGER!",
        alert_msg_safe_route_confirmed: "Safe route confirmed ahead",
        alert_msg_crowd_density: "Moderate crowd density detected",

        /* ── AMBULANCE TRACKING MODAL ── */
        amb_tracking_title: "Emergency Ambulance Tracking",
        amb_realtime: "Real-time location updates",
        amb_step_assigned: "Assigned",
        amb_step_on_way: "On the Way",
        amb_step_arrived: "Arrived",
        amb_unit_label: "Ambulance Unit",
        amb_eta_label: "Estimated Arrival",
        amb_distance_label: "Distance",
        amb_live_text: "Live tracking • Updates every 10 seconds",
        amb_arriving_now: "Arriving now",
        amb_mins: "{n} mins",
        amb_last_updated: "Last updated: {time}",
        amb_arrived_title: "Ambulance Has Arrived!",
        amb_arrived_desc: "The ambulance has reached your location. Medical assistance is now available.",

        /* ── LIVE TOURIST TABLE STATUS & TYPES ── */
        tourist_status_safe: "Safe",
        tourist_status_moderate: "Moderate",
        tourist_status_danger: "Danger",
        tourist_status_active: "Active",
        tourist_type_indian: "Indian",
        tourist_type_foreign: "Foreign",

        /* ── ADMIN FUNCTIONS MODAL ── */
        modal_tourist_details: "Tourist Details",
        modal_lbl_name: "Name:",
        modal_lbl_digital_id: "Digital ID:",
        modal_lbl_type: "Tourist Type:",
        modal_lbl_nationality: "Nationality:",
        modal_lbl_contact: "Contact:",
        modal_lbl_safety: "Safety Score:",
        modal_lbl_status: "Status:",
        modal_lbl_last_location: "Last Location:",
        modal_lbl_actions: "Actions:",
        modal_download_report: "Download Full Report",
        modal_close: "Close",
        modal_loading: "Loading...",
        modal_error: "Error: Failed to load tourist details",
        dispatch_confirm_amb: "Dispatch ambulance to this location?",
        dispatch_confirm_police_q: "Dispatch police units to this location?",
    },

    hi: {
        /* ── LANDING ── */
        landing_title: "टूरिस्ट शील्ड",
        landing_subtitle: "AI-संचालित स्मार्ट पर्यटक सुरक्षा निगरानी और आपातकालीन प्रतिक्रिया प्रणाली",
        landing_ai: "AI निगरानी",
        landing_tracking: "लाइव ट्रैकिंग",
        landing_sos: "आपातकालीन SOS",
        landing_reports: "डिजिटल रिपोर्ट",
        landing_login_btn: "सिस्टम में लॉगिन करें",

        /* ── LOGIN ── */
        login_app_title: "स्मार्ट टूरिस्ट शील्ड AI",
        login_app_subtitle: "AI-संचालित सुरक्षा निगरानी और आपातकालीन प्रतिक्रिया प्रणाली",
        login_select_role: "जारी रखने के लिए अपनी भूमिका चुनें",
        login_tourist: "पर्यटक",
        login_police: "पुलिस",
        login_admin: "एडमिन",
        login_username_label: "उपयोगकर्ता नाम",
        login_username_ph: "अपना उपयोगकर्ता नाम दर्ज करें",
        login_password_label: "पासवर्ड",
        login_password_ph: "अपना पासवर्ड दर्ज करें",
        login_btn: "सुरक्षित लॉगिन",
        login_back: "होम पर वापस जाएं",
        login_cred_user: "उपयोगकर्ता नाम:",
        login_cred_pass: "पासवर्ड:",

        /* ── COMMON SIDEBAR / HEADER ── */
        menu_overview: "अवलोकन",
        menu_live_tourists: "लाइव पर्यटक",
        menu_tourist_id: "पर्यटक ID बनाएं",
        menu_map: "नक्शा दृश्य",
        menu_alerts: "अलर्ट केंद्र",
        menu_sos: "SOS प्रेषण",
        menu_reports: "रिपोर्ट",
        menu_dashboard: "डैशबोर्ड",
        menu_safety: "सुरक्षा स्कोर",
        menu_live_alerts: "लाइव अलर्ट",
        menu_route: "रूट ट्रैकिंग",
        menu_panic: "पैनिक SOS",
        menu_pdf: "PDF रिपोर्ट",
        menu_sos_dispatch: "SOS प्रेषण",
        menu_criminals: "आपराधिक अलर्ट",
        menu_critical: "गंभीर अलर्ट",
        role_admin: "प्रशासक",
        role_police: "पुलिस अधिकारी",
        role_tourist: "पर्यटक पोर्टल",
        portal_admin: "एडमिन पोर्टल",
        portal_police: "कानून प्रवर्तन पोर्टल",
        portal_tourist: "पर्यटक पोर्टल",
        brand_command: "कमांड सेंटर",
        brand_police: "पुलिस कमांड",
        brand_shield: "शील्ड AI",
        btn_refresh: "रिफ्रेश",

        /* ── ADMIN DASHBOARD ── */
        admin_header: "कमांड सेंटर डैशबोर्ड",
        admin_subheader: "रियल-टाइम निगरानी और घटना प्रबंधन",
        admin_ai_online: "AI इंजन ऑनलाइन",
        stat_total_tourists: "कुल पर्यटक",
        stat_active_now: "अभी सक्रिय",
        stat_total_alerts: "कुल अलर्ट",
        stat_critical: "गंभीर",
        create_tourist_id: "नई पर्यटक ID बनाएं",
        tab_indian: "भारतीय पर्यटक",
        tab_foreign: "विदेशी पर्यटक",
        lbl_name: "नाम *",
        lbl_aadhar: "आधार नंबर *",
        lbl_aadhar_hint: "(12 अंक)",
        lbl_mobile: "मोबाइल नंबर *",
        lbl_mobile_ph: "+91-XXXXXXXXXX",
        lbl_address: "पता *",
        btn_create_indian: "भारतीय पर्यटक ID बनाएं",
        lbl_passport: "पासपोर्ट नंबर *",
        lbl_email: "ईमेल *",
        lbl_country: "देश *",
        btn_create_foreign: "विदेशी पर्यटक ID बनाएं",
        live_tourist_monitoring: "लाइव पर्यटक निगरानी",
        auto_refresh_10: "ऑटो-रिफ्रेश (10 सेकंड)",
        th_id: "ID",
        th_name: "नाम",
        th_safety_score: "सुरक्षा स्कोर",
        th_status: "स्थिति",
        th_location: "स्थान",
        th_actions: "कार्रवाई",
        live_tracking_map: "लाइव पर्यटक ट्रैकिंग नक्शा",
        active_badge: "सक्रिय",
        map_safe: "सुरक्षित (80%+)",
        map_moderate: "मध्यम (50-80%)",
        map_high_risk: "उच्च जोखिम (<50%)",
        map_risk_zones: "जोखिम क्षेत्र",
        alerts_command: "अलर्ट कमांड सेंटर",
        filter_all: "सभी",
        filter_low: "कम",
        filter_medium: "मध्यम",
        filter_high: "उच्च",
        filter_critical: "गंभीर",
        sos_panel: "SOS प्रेषण पैनल",
        no_sos: "कोई सक्रिय SOS अनुरोध नहीं",
        dispatch_police: "पुलिस इकाइयां भेजें",
        hospital_panel: "अस्पताल/एम्बुलेंस प्रेषण पैनल",
        no_ambulance: "कोई सक्रिय एम्बुलेंस अनुरोध नहीं",
        dispatch_ambulance: "एम्बुलेंस भेजें",
        sys_health: "सिस्टम स्वास्थ्य",
        sys_ai_engine: "AI इंजन",
        sys_gps: "GPS ट्रैकिंग",
        sys_alert_sys: "अलर्ट सिस्टम",
        sys_database: "डेटाबेस",
        status_running: "✓ चल रहा है",
        status_online: "✓ ऑनलाइन",
        status_active: "✓ सक्रिय",
        status_connected: "✓ जुड़ा हुआ",
        records_summary: "रिकॉर्ड सारांश",
        rec_sos: "SOS अनुरोध",
        rec_efir: "दर्ज E-FIR",
        rec_evidence: "साक्ष्य लॉग",
        rec_critical: "गंभीर घटनाएं",
        admin_reports: "प्रशासनिक रिपोर्ट और डाउनलोड",
        pdf_daily: "दैनिक सारांश",
        pdf_daily_desc: "संपूर्ण पर्यटक सुरक्षा अवलोकन",
        pdf_sos: "SOS रिपोर्ट",
        pdf_sos_desc: "आपातकालीन घटनाओं का लॉग",
        pdf_evidence: "साक्ष्य लॉग",
        pdf_evidence_desc: "सभी साक्ष्य और टाइमस्टैम्प",
        pdf_efir: "E-FIR संग्रह",
        pdf_efir_desc: "सभी दर्ज FIR",
        btn_download: "PDF डाउनलोड करें",

        /* ── TOURIST DASHBOARD ── */
        tourist_welcome: "आपका AI संरक्षक आपकी निगरानी कर रहा है",
        online_badge: "ऑनलाइन",
        live_safety_score: "लाइव सुरक्षा स्कोर",
        score_label: "स्कोर",
        safety_metrics: "सुरक्षा मेट्रिक्स",
        stat_risk_flags: "जोखिम संकेत",
        stat_monitoring: "निगरानी",
        live_ai_alerts: "लाइव AI अलर्ट",
        auto_refresh: "ऑटो-रिफ्रेश",
        live_gps: "लाइव GPS ट्रैकिंग",
        safe_zones: "सुरक्षित क्षेत्र",
        high_risk_zones: "उच्च जोखिम क्षेत्र",
        your_location: "आपका स्थान",
        police_emergency: "पुलिस आपातकाल",
        police_sos_desc: "आपके सटीक GPS निर्देशांक के साथ पुलिस को तुरंत सूचित करें",
        btn_police_sos: "पुलिस SOS",
        nearest_unit: "निकटतम इकाई",
        response_time: "प्रतिक्रिया समय",
        medical_emergency: "चिकित्सा आपातकाल",
        medical_sos_desc: "आपके सटीक GPS निर्देशांक के साथ तुरंत एम्बुलेंस मंगाएं",
        btn_ambulance_sos: "एम्बुलेंस SOS",
        btn_track: "ट्रैक करें",
        nearest_hospital: "निकटतम अस्पताल",
        digital_id_card: "डिजिटल ID कार्ड",
        lbl_passport_id: "पासपोर्ट",
        lbl_nationality: "राष्ट्रीयता",
        lbl_hotel: "होटल",
        lbl_emergency: "आपातकाल",
        emergency_instr: "आपातकालीन निर्देश",
        instr_police: "पुलिस SOS: अपराध, चोरी, हमला या तत्काल खतरे के लिए",
        instr_ambulance: "एम्बुलेंस SOS: चिकित्सा आपात, चोट या स्वास्थ्य समस्याओं के लिए",
        instr_both: "दोनों बटन आपका GPS स्थान तुरंत प्रसारित करते हैं",
        instr_24_7: "AI और अधिकारियों द्वारा 24/7 निगरानी",
        pdf_reports: "PDF रिपोर्ट और डाउनलोड",
        pdf_safety: "सुरक्षा रिपोर्ट",
        pdf_safety_desc: "आपकी प्रोफ़ाइल, स्कोर और हालिया अलर्ट",
        pdf_alert_hist: "अलर्ट इतिहास",
        pdf_alert_hist_desc: "सभी AI अलर्ट का पूरा लॉग",
        pdf_digital_id: "डिजिटल ID कार्ड",
        pdf_digital_id_desc: "आधिकारिक पर्यटक ID दस्तावेज़",
        modal_emergency: "आपातकालीन अलर्ट",
        modal_danger_q: "क्या आप तत्काल खतरे में हैं?",
        modal_danger_desc: "यह आपका स्थान सभी नजदीकी पुलिस इकाइयों और आपातकालीन सेवाओं को प्रसारित करेगा।",
        modal_warning: "केवल तभी सक्रिय करें जब आपको तत्काल सहायता की आवश्यकता हो",
        btn_cancel: "रद्द करें",
        btn_send_sos: "हाँ, अभी SOS भेजें",

        /* ── POLICE DASHBOARD ── */
        police_header: "पुलिस कमांड सेंटर",
        police_subheader: "रियल-टाइम आपातकालीन प्रतिक्रिया और निगरानी",
        stat_active_sos: "सक्रिय SOS",
        stat_critical_alerts: "गंभीर अलर्ट",
        stat_active_criminals: "सक्रिय अपराधी",
        sos_police_panel: "सक्रिय SOS प्रेषण - पुलिस इकाइयां",
        criminal_detections: "आपराधिक पहचान",
        no_criminal: "हाल ही में कोई आपराधिक पहचान नहीं",
        police_critical_alerts: "गंभीर अलर्ट",
        no_critical: "कोई गंभीर अलर्ट नहीं",
        live_tourist_tracking: "लाइव पर्यटक ट्रैकिंग",
        tourist_info_modal: "पर्यटक जानकारी",

        /* ── LANGUAGE BUTTON ── */
        lang_hindi: "🇮🇳 हिंदी",
        lang_english: "🇬🇧 English",

        /* ── ALERT SEVERITY LABELS ── */
        severity_low: "कम",
        severity_medium: "मध्यम",
        severity_high: "उच्च",
        severity_critical: "गंभीर",
        no_alerts_text: "कोई अलर्ट नहीं",

        /* ── ALERT MESSAGES ── */
        alert_msg_safe_route: "AI ने आगे सुरक्षित मार्ग का पता लगाया",
        alert_msg_weather_ok: "यात्रा के लिए मौसम की स्थिति अनुकूल है",
        alert_msg_crowd: "आपके क्षेत्र में मध्यम भीड़ का घनत्व",
        alert_msg_route_deviation: "मार्ग विचलन का पता चला - सुरक्षा की जाँच करें",
        alert_msg_crime_area: "उच्च अपराध सांख्यिकी वाले क्षेत्र में प्रवेश",
        alert_msg_inactivity: "असामान्य निष्क्रियता पैटर्न का पता चला",
        alert_msg_distress: "संभावित संकट संकेत - स्थान ड्रॉप-ऑफ का पता चला",
        alert_msg_zone: "उच्च-जोखिम क्षेत्र में प्रवेश किया",
        alert_msg_police_sos: "को तत्काल पुलिस सहायता की आवश्यकता है!",
        alert_msg_medical_sos: "को तत्काल चिकित्सा सहायता की आवश्यकता है!",
        alert_msg_panic: "तत्काल खतरे में है!",
        alert_msg_safe_route_confirmed: "आगे सुरक्षित मार्ग की पुष्टि हुई",
        alert_msg_crowd_density: "मध्यम भीड़ घनत्व का पता चला",

        /* ── AMBULANCE TRACKING MODAL ── */
        amb_tracking_title: "आपातकालीन एम्बुलेंस ट्रैकिंग",
        amb_realtime: "रियल-टाइम स्थान अपडेट",
        amb_step_assigned: "सौंपा गया",
        amb_step_on_way: "रास्ते में",
        amb_step_arrived: "पहुँच गया",
        amb_unit_label: "एम्बुलेंस इकाई",
        amb_eta_label: "अनुमानित आगमन",
        amb_distance_label: "दूरी",
        amb_live_text: "लाइव ट्रैकिंग • हर 10 सेकंड में अपडेट",
        amb_arriving_now: "अभी पहुँच रहा है",
        amb_mins: "{n} मिनट",
        amb_last_updated: "अंतिम अपडेट: {time}",
        amb_arrived_title: "एम्बुलेंस पहुँच गई!",
        amb_arrived_desc: "एम्बुलेंस आपके स्थान पर पहुँच गई है। चिकित्सा सहायता अब उपलब्ध है।",

        /* ── LIVE TOURIST TABLE STATUS & TYPES ── */
        tourist_status_safe: "सुरक्षित",
        tourist_status_moderate: "मध्यम",
        tourist_status_danger: "खतरा",
        tourist_status_active: "सक्रिय",
        tourist_type_indian: "भारतीय",
        tourist_type_foreign: "विदेशी",

        /* ── ADMIN FUNCTIONS MODAL ── */
        modal_tourist_details: "पर्यटक विवरण",
        modal_lbl_name: "नाम:",
        modal_lbl_digital_id: "डिजिटल ID:",
        modal_lbl_type: "पर्यटक प्रकार:",
        modal_lbl_nationality: "राष्ट्रीयता:",
        modal_lbl_contact: "संपर्क:",
        modal_lbl_safety: "सुरक्षा स्कोर:",
        modal_lbl_status: "स्थिति:",
        modal_lbl_last_location: "अंतिम स्थान:",
        modal_lbl_actions: "कार्रवाई:",
        modal_download_report: "पूरी रिपोर्ट डाउनलोड करें",
        modal_close: "बंद करें",
        modal_loading: "लोड हो रहा है...",
        modal_error: "त्रुटि: पर्यटक विवरण लोड नहीं हो सका",
        dispatch_confirm_amb: "इस स्थान पर एम्बुलेंस भेजें?",
        dispatch_confirm_police_q: "इस स्थान पर पुलिस इकाइयां भेजें?",
    }
};

// Expose globally so other JS files (_t() helpers) can access translations
window.TRANSLATIONS = TRANSLATIONS;


let currentLang = localStorage.getItem('ts_lang') || 'en';

function applyLanguage(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.textContent = t[key];
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key] !== undefined) el.title = t[key];
    });

    // Value-based translations: data-i18n-value="prefix"
    // The key = prefix + '_' + element's original data-raw-value (lowercased, spaces→_)
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const prefix = el.getAttribute('data-i18n-value');
        const rawVal = el.getAttribute('data-raw-value') || el.textContent.trim();
        const lookupKey = prefix + '_' + rawVal.toLowerCase().replace(/\s+/g, '_');
        if (t[lookupKey] !== undefined) {
            el.textContent = t[lookupKey];
        } else {
            // restore English if no HI key found
            const enVal = el.getAttribute('data-raw-value') || rawVal;
            if (lang === 'en') el.textContent = enVal;
        }
    });

    // Update toggle button label
    const btn = document.getElementById('langToggleBtn');
    if (btn) {
        btn.textContent = lang === 'hi' ? TRANSLATIONS.hi.lang_english : TRANSLATIONS.hi.lang_hindi;
    }

    currentLang = lang;
    localStorage.setItem('ts_lang', lang);

    // Re-render JS-generated dynamic content (e.g. live alert badges on tourist dashboard)
    if (typeof window.updateAlerts === 'function') {
        try { window.updateAlerts(); } catch (e) { /* ignore */ }
    }
}

function toggleLanguage() {
    applyLanguage(currentLang === 'en' ? 'hi' : 'en');
}

// Auto-apply saved preference on every page load
document.addEventListener('DOMContentLoaded', function () {
    applyLanguage(currentLang);
});
