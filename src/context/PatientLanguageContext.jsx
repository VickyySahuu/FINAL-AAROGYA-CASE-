import React, { createContext, useContext, useState, useEffect } from 'react'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'हिन्दी', native: 'हिन्दी' },
  { code: 'hinglish', label: 'Hinglish', native: 'Hinglish' }
]

const STORAGE_KEY = 'aarogya_patient_language'

const TRANSLATIONS = {
  en: {
    // Top Navigation & Common
    home: 'HOME',
    patient_services: 'PATIENT SERVICES',
    help: 'HELP',
    emergency: 'EMERGENCY',
    accessibility: 'Accessibility',
    language: 'Language',
    back: 'Back',
    back_to_home: 'Back to Home',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    logout: 'Logout',
    print: 'Print',
    download_pdf: 'Download PDF',
    generate_summary: 'Generate Summary',
    refresh_summary: 'Refresh Summary',
    generating: 'Generating Summary...',
    verified: 'Verified',
    patient_id: 'Patient ID',
    unique_code: 'Unique Code',
    copy_id: 'Copy Patient ID',
    copied: 'Copied!',
    welcome: 'Welcome',
    citizen: 'Citizen',
    no_records_found: 'No records found',
    select_option: 'Select an Option',
    portal_badge: 'Patient Portal',
    portal_subtitle: 'Healthcare Digital Platform',
    portal_tagline: 'Digital Health Record Portal • Outpatient Management System',

    // Main Pathway
    primary_pathway: 'Primary Consultation Pathway',
    new_problem: 'NEW PROBLEM',
    start_new_problem: 'START NEW PROBLEM',
    new_problem_desc: 'Describe symptoms or start a new health issue for triage and consultation. Connect directly with verified clinicians and primary care clinics.',

    // Services Grid
    medical_summary: 'MEDICAL SUMMARY',
    medical_summary_desc: 'Doctor Handoff PDF',
    history: 'HISTORY',
    history_desc: 'Medical Records',
    reports: 'REPORTS',
    reports_desc: 'Lab & Scans',
    medicines: 'MEDICINES',
    medicines_desc: 'Prescriptions',
    appointments: 'APPOINTMENTS',
    appointments_desc: 'OPD Visits',
    profile: 'PROFILE',
    profile_desc: 'ABHA Details',

    // Emergency Banner
    emergency_card_title: 'Need Immediate Emergency Ambulance or Hospital Care?',
    emergency_card_desc: 'Access instant dispatch with GPS coordination or dial helpline 108',
    emergency_access: 'EMERGENCY ACCESS',

    // Medical Summary Specific
    handoff_badge: 'PATIENT HANDOFF RECORD',
    summary_heading: 'Medical Summary',
    summary_subheading: 'Your health record summary for sharing with another doctor',
    patient_identity: 'Patient Identity',
    current_concern: 'Current / Recent Concern',
    clinical_timeline: 'Medical History & Timeline',
    medications_prescriptions: 'Prescribed Medications',
    diagnostics_lab: 'Diagnostic Investigations & Reports',
    attached_documents: 'Attached Medical Documents',
    consultations_encounters: 'Consultations & Encounters',
    allergies_conditions: 'Allergies & Existing Conditions',
    clinical_notes_provenance: 'Documented in AAROGYA CASE',
    no_prior_records: 'No prior clinical records documented in AAROGYA CASE.',
    new_patient_notice: 'This account is newly registered. Once you complete clinical consultations, upload lab tests, or receive e-prescriptions, your comprehensive clinical summary will be generated here automatically.',
    disclaimer_text: 'This summary is generated from records available in AAROGYA CASE. It is intended to help another healthcare professional review the patient\'s documented history. It is not a diagnosis or prescription.',
    total_encounters: 'Encounters',
    total_prescriptions: 'Prescriptions',
    total_diagnostics: 'Diagnostics',
    total_documents: 'Documents',
    official_title: 'PATIENT MEDICAL SUMMARY',
    generated_on: 'Generated on',
    summary_id: 'Summary ID',
    all_cases: 'All Cases',
    view_details: 'View Details'
  },

  hi: {
    // Top Navigation & Common
    home: 'होम',
    patient_services: 'मरीज सेवाएं',
    help: 'सहायता',
    emergency: 'आपातकालीन',
    accessibility: 'सुगमता',
    language: 'भाषा',
    back: 'वापस',
    back_to_home: 'होम पर वापस जाएं',
    loading: 'लोड हो रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    logout: 'लॉगआउट',
    print: 'प्रिंट करें',
    download_pdf: 'पीडीएफ डाउनलोड करें',
    generate_summary: 'सारांश तैयार करें',
    refresh_summary: 'सारांश रीफ्रेश करें',
    generating: 'सारांश तैयार हो रहा है...',
    verified: 'सत्यापित',
    patient_id: 'मरीज आईडी',
    unique_code: 'विशिष्ट कोड',
    copy_id: 'मरीज आईडी कॉपी करें',
    copied: 'कॉपी हो गया!',
    welcome: 'स्वागत है',
    citizen: 'नागरिक',
    no_records_found: 'कोई रिकॉर्ड नहीं मिला',
    select_option: 'एक विकल्प चुनें',
    portal_badge: 'मरीज पोर्टल',
    portal_subtitle: 'डिजिटल स्वास्थ्य प्लेटफॉर्म',
    portal_tagline: 'डिजिटल स्वास्थ्य रिकॉर्ड पोर्टल • ओपीडी प्रबंधन प्रणाली',

    // Main Pathway
    primary_pathway: 'प्राथमिक परामर्श मार्ग',
    new_problem: 'नई समस्या दर्ज करें',
    start_new_problem: 'परामर्श शुरू करें',
    new_problem_desc: 'लक्षणों का विवरण दें या परामर्श के लिए नया स्वास्थ्य मुद्दा शुरू करें। सत्यापित डॉक्टरों से तुरंत परामर्श प्राप्त करें।',

    // Services Grid
    medical_summary: 'मेडिकल सारांश',
    medical_summary_desc: 'डॉक्टर ट्रांसफर पीडीएफ',
    history: 'इतिहास',
    history_desc: 'चिकित्सीय रिकॉर्ड',
    reports: 'रिपोर्ट्स',
    reports_desc: 'लैब एवं स्कैन',
    medicines: 'दवाइयां',
    medicines_desc: 'प्रिस्क्रिप्शन',
    appointments: 'अपॉइंटमेंट्स',
    appointments_desc: 'ओपीडी विज़िट',
    profile: 'प्रोफाइल',
    profile_desc: 'आभा विवरण',

    // Emergency Banner
    emergency_card_title: 'तत्काल आपातकालीन एम्बुलेंस या अस्पताल देखभाल की आवश्यकता है?',
    emergency_card_desc: 'जीपीएस समन्वय के साथ त्वरित प्रेषण या हेल्पलाइन 108 डायल करें',
    emergency_access: 'आपातकालीन सेवा',

    // Medical Summary Specific
    handoff_badge: 'मरीज हैंडऑफ रिकॉर्ड',
    summary_heading: 'मेडिकल सारांश',
    summary_subheading: 'दूसरे डॉक्टर के साथ साझा करने के लिए आपका स्वास्थ्य रिकॉर्ड सारांश',
    patient_identity: 'मरीज पहचान',
    current_concern: 'वर्तमान / हालिया समस्या',
    clinical_timeline: 'चिकित्सीय इतिहास एवं टाइमलाइन',
    medications_prescriptions: 'निर्धारित दवाइयां (Prescriptions)',
    diagnostics_lab: 'जांच एवं लैब रिपोर्ट (Lab Reports)',
    attached_documents: 'संलग्न मेडिकल दस्तावेज़ (Documents)',
    consultations_encounters: 'ओपीडी परामर्श एवं विज़िट',
    allergies_conditions: 'एलर्जी एवं पुरानी बीमारियां',
    clinical_notes_provenance: 'आरोग्य केस में दर्ज रिकॉर्ड',
    no_prior_records: 'आरोग्य केस में कोई पूर्व नैदानिक रिकॉर्ड दर्ज नहीं है।',
    new_patient_notice: 'यह खाता हाल ही में पंजीकृत हुआ है। परामर्श पूरा करने, जांच रिपोर्ट अपलोड करने या प्रिस्क्रिप्शन प्राप्त करने के बाद आपका संपूर्ण सारांश यहां स्वतः उपलब्ध होगा।',
    disclaimer_text: 'यह सारांश आरोग्य केस (AAROGYA CASE) में उपलब्ध रिकॉर्ड के आधार पर तैयार किया गया है। इसका उद्देश्य किसी अन्य स्वास्थ्य पेशेवर को मरीज के दस्तावेजी इतिहास की समीक्षा करने में सहायता करना है। यह कोई चिकित्सीय निदान (diagnosis) या दवा का नुस्खा (prescription) नहीं है।',
    total_encounters: 'परामर्श',
    total_prescriptions: 'प्रिस्क्रिप्शन',
    total_diagnostics: 'जांच रिपोर्ट',
    total_documents: 'दस्तावेज़',
    official_title: 'मरीज मेडिकल सारांश',
    generated_on: 'तैयार किया गया',
    summary_id: 'सारांश आईडी',
    all_cases: 'सभी केस',
    view_details: 'विवरण देखें'
  },

  hinglish: {
    // Top Navigation & Common
    home: 'HOME',
    patient_services: 'PATIENT SERVICES',
    help: 'HELP',
    emergency: 'EMERGENCY',
    accessibility: 'Accessibility',
    language: 'Language',
    back: 'Back',
    back_to_home: 'Home wapas jayein',
    loading: 'Loading ho rahi hai...',
    save: 'Save karein',
    cancel: 'Cancel karein',
    confirm: 'Confirm karein',
    logout: 'Logout',
    print: 'Print karein',
    download_pdf: 'PDF Download karein',
    generate_summary: 'Summary Generate karein',
    refresh_summary: 'Summary Refresh karein',
    generating: 'Summary ban rahi hai...',
    verified: 'Verified',
    patient_id: 'Patient ID',
    unique_code: 'Unique Code',
    copy_id: 'Patient ID Copy karein',
    copied: 'Copy ho gaya!',
    welcome: 'Welcome',
    citizen: 'Citizen',
    no_records_found: 'Koi record nahi mila',
    select_option: 'Ek Option Chunein',
    portal_badge: 'Patient Portal',
    portal_subtitle: 'Healthcare Digital Platform',
    portal_tagline: 'Digital Health Record Portal • Outpatient Management System',

    // Main Pathway
    primary_pathway: 'Primary Consultation Pathway',
    new_problem: 'NEW PROBLEM',
    start_new_problem: 'START NEW PROBLEM',
    new_problem_desc: 'Symptoms describe karein ya nayi health problem ke liye consultation start karein. Verified clinicians se direct connect karein.',

    // Services Grid
    medical_summary: 'MEDICAL SUMMARY',
    medical_summary_desc: 'Doctor Handoff PDF',
    history: 'HISTORY',
    history_desc: 'Medical Records',
    reports: 'REPORTS',
    reports_desc: 'Lab & Scans',
    medicines: 'MEDICINES',
    medicines_desc: 'Prescriptions',
    appointments: 'APPOINTMENTS',
    appointments_desc: 'OPD Visits',
    profile: 'PROFILE',
    profile_desc: 'ABHA Details',

    // Emergency Banner
    emergency_card_title: 'Immediate Emergency Ambulance ya Hospital Care chahiye?',
    emergency_card_desc: 'Instant GPS dispatch access karein ya helpline 108 dial karein',
    emergency_access: 'EMERGENCY ACCESS',

    // Medical Summary Specific
    handoff_badge: 'PATIENT HANDOFF RECORD',
    summary_heading: 'Medical Summary',
    summary_subheading: 'Dusre doctor ke saath share karne ke liye health record summary',
    patient_identity: 'Patient Identity',
    current_concern: 'Current / Recent Concern',
    clinical_timeline: 'Medical History & Timeline',
    medications_prescriptions: 'Prescribed Medicines',
    diagnostics_lab: 'Diagnostic Tests & Reports',
    attached_documents: 'Attached Medical Documents',
    consultations_encounters: 'OPD Consultations & Visits',
    allergies_conditions: 'Documented Allergies & Conditions',
    clinical_notes_provenance: 'AAROGYA CASE me Documented Record',
    no_prior_records: 'AAROGYA CASE me koi purana medical record recorded nahi hai.',
    new_patient_notice: 'Yeh account naya registered hai. Consultations complete karne aur prescriptions milne ke baad aapka complete medical summary yahan automatically show hoga.',
    disclaimer_text: 'Yeh summary AAROGYA CASE me available records ke aadhar par banayi gayi hai. Iska uddeshya kisi doosre doctor ko patient ki documented history samajhne me madad karna hai. Yeh koi diagnosis ya prescription nahi hai.',
    total_encounters: 'Visits',
    total_prescriptions: 'Prescriptions',
    total_diagnostics: 'Diagnostics',
    total_documents: 'Documents',
    official_title: 'PATIENT MEDICAL SUMMARY',
    generated_on: 'Generated Date',
    summary_id: 'Summary ID',
    all_cases: 'All Cases',
    view_details: 'Details dekhein'
  }
}

const PatientLanguageContext = createContext(null)

export function PatientLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'en'
    }
    return 'en'
  })

  const setLanguage = (langCode) => {
    if (['en', 'hi', 'hinglish'].includes(langCode)) {
      setLanguageState(langCode)
      try {
        localStorage.setItem(STORAGE_KEY, langCode)
      } catch (e) {
        console.warn('Could not save language to localStorage:', e)
      }
    }
  }

  const t = (key, fallback = null) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en
    if (dict && dict[key] !== undefined) {
      return dict[key]
    }
    const fallbackDict = TRANSLATIONS.en
    if (fallbackDict && fallbackDict[key] !== undefined) {
      return fallbackDict[key]
    }
    return fallback !== null ? fallback : key
  }

  const value = {
    language,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES
  }

  return (
    <PatientLanguageContext.Provider value={value}>
      {children}
    </PatientLanguageContext.Provider>
  )
}

export function usePatientLanguage() {
  const ctx = useContext(PatientLanguageContext)
  if (!ctx) {
    // Safe fallback if used outside Provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key, fallback = null) => fallback !== null ? fallback : key,
      languages: SUPPORTED_LANGUAGES
    }
  }
  return ctx
}
