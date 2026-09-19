import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PatientLayout from '../../components/layout/PatientLayout'
import { getPatientProfile } from '../../data/patientMockData'
import { AuthApi } from '../../services/authApi'
import { usePatientLanguage } from '../../context/PatientLanguageContext'

export default function PatientHomePage() {
  const { t } = usePatientLanguage()
  const [profile, setProfile] = useState(() => AuthApi.getStoredPatient() || getPatientProfile())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadBackendSession() {
      try {
        const res = await AuthApi.getMe()
        if (res.success && res.patient) {
          setProfile(res.patient)
        }
      } catch (err) {
        console.warn('[Session] Backend me query warning:', err.message)
      }
    }
    loadBackendSession()
  }, [])

  const copyPatientId = () => {
    if (profile.patientId) {
      navigator.clipboard.writeText(profile.patientId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <PatientLayout activeNav="HOME" activeService="Patient Dashboard">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* 1. Patient Identity Banner */}
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Verification Badge Indicator */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534] shrink-0 shadow-inner">
              <span className="material-symbols-outlined text-4xl">account_circle</span>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540] tracking-tight" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('welcome', 'Welcome')}, {profile.name || t('citizen', 'Citizen')}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#166534] text-xs font-bold">
                  <span className="material-symbols-outlined text-sm mr-1">verified</span>
                  {t('verified', 'Verified')}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {t('portal_tagline', 'Digital Health Record Portal • Outpatient Management System')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
            {/* Patient ID */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
              <div className="flex flex-col text-left md:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('patient_id', 'Patient ID')}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#166534] tracking-wide font-mono">
                  {profile.patientId || '—'}
                </span>
              </div>
              <button
                type="button"
                onClick={copyPatientId}
                title={t('copy_id', 'Copy Patient ID')}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#166534] hover:border-[#166534] transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'done' : 'content_copy'}
                </span>
              </button>
            </div>

            {/* Permanent Patient Unique Code */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
              <div className="flex flex-col text-left md:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('unique_code', 'Unique Code')}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#0A2540] tracking-wide font-mono">
                  {profile.patientUniqueCode || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Hero Primary Task: NEW PROBLEM */}
        <div className="w-full bg-gradient-to-br from-emerald-50/70 via-white to-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-600/30 shadow-md relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl flex flex-col gap-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[#166534] text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'Lexend, sans-serif' }}>
              <span className="material-symbols-outlined text-xl">medical_services</span>
              <span>{t('primary_pathway', 'Primary Consultation Pathway')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] tracking-tight" style={{ fontFamily: 'Lexend, sans-serif' }}>
              {t('new_problem', 'NEW PROBLEM')}
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              {t('new_problem_desc', 'Describe symptoms or start a new health issue for triage and consultation. Connect directly with verified clinicians and primary care clinics.')}
            </p>
          </div>

          <div className="relative z-10 shrink-0 w-full sm:w-auto">
            <Link
              to="/patient/ai-interview"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#166534] hover:bg-[#14532d] active:scale-[0.99] text-white text-base font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-3 group uppercase tracking-wider"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">stethoscope</span>
              <span>{t('start_new_problem', 'START NEW PROBLEM')}</span>
              <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* 3. Core Patient Services Grid (Including MEDICAL SUMMARY) */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#0A2540]" style={{ fontFamily: 'Lexend, sans-serif' }}>
              {t('patient_services', 'Patient Services')}
            </h3>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400" style={{ fontFamily: 'Lexend, sans-serif' }}>
              {t('select_option', 'Select an Option')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Card 1: MEDICAL SUMMARY (NEW FEATURE 1) */}
            <Link
              to="/patient/medical-summary"
              id="card-service-medical-summary"
              className="group bg-gradient-to-b from-white to-emerald-50/40 rounded-2xl p-4 sm:p-5 border-2 border-emerald-600/40 shadow-sm hover:border-[#166534] hover:shadow-md transition-all flex flex-col items-center text-center justify-between min-h-[9.5rem] sm:min-h-[12rem] btn-press"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 text-[#166534] flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-200 shadow-xs">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">clinical_notes</span>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#166534] transition-colors" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('medical_summary', 'MEDICAL SUMMARY')}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t('medical_summary_desc', 'Doctor Handoff PDF')}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#166534] group-hover:bg-[#166534] group-hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined text-sm sm:text-base">east</span>
              </div>
            </Link>

            {/* Card 2: HISTORY */}
            <Link
              to="/patient/history"
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-[#166534]/50 hover:shadow-md transition-all flex flex-col items-center text-center justify-between min-h-[9.5rem] sm:min-h-[12rem] btn-press"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">folder_open</span>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#166534] transition-colors" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('history', 'HISTORY')}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t('history_desc', 'Medical Records')}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#166534] group-hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined text-sm sm:text-base">east</span>
              </div>
            </Link>

            {/* Card 3: REPORTS */}
            <Link
              to="/patient/reports"
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-[#166534]/50 hover:shadow-md transition-all flex flex-col items-center text-center justify-between min-h-[9.5rem] sm:min-h-[12rem] btn-press"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">biotech</span>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#166534] transition-colors" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('reports', 'REPORTS')}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t('reports_desc', 'Lab & Scans')}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#166534] group-hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined text-sm sm:text-base">east</span>
              </div>
            </Link>

            {/* Card 4: MEDICINES */}
            <Link
              to="/patient/medicines"
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-[#166534]/50 hover:shadow-md transition-all flex flex-col items-center text-center justify-between min-h-[9.5rem] sm:min-h-[12rem] btn-press"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">prescriptions</span>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#166534] transition-colors" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('medicines', 'MEDICINES')}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t('medicines_desc', 'Prescriptions')}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#166534] group-hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined text-sm sm:text-base">east</span>
              </div>
            </Link>

            {/* Card 5: APPOINTMENTS */}
            <Link
              to="/patient/appointments"
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-[#166534]/50 hover:shadow-md transition-all flex flex-col items-center text-center justify-between min-h-[9.5rem] sm:min-h-[12rem] btn-press"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">calendar_clock</span>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#166534] transition-colors" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('appointments', 'APPOINTMENTS')}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t('appointments_desc', 'OPD Visits')}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#166534] group-hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined text-sm sm:text-base">east</span>
              </div>
            </Link>

            {/* Card 6: PROFILE */}
            <Link
              to="/patient/profile"
              className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-[#166534]/50 hover:shadow-md transition-all flex flex-col items-center text-center justify-between min-h-[9.5rem] sm:min-h-[12rem] btn-press"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">badge</span>
              </div>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#166534] transition-colors" style={{ fontFamily: 'Lexend, sans-serif' }}>
                  {t('profile', 'PROFILE')}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {t('profile_desc', 'ABHA Details')}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#166534] group-hover:text-white transition-colors mt-1">
                <span className="material-symbols-outlined text-sm sm:text-base">east</span>
              </div>
            </Link>
          </div>
        </div>

        {/* 4. Emergency Support Strip */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                emergency
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-red-900">{t('emergency_card_title', 'Need Immediate Emergency Ambulance or Hospital Care?')}</p>
              <p className="text-xs text-slate-600">{t('emergency_card_desc', 'Access instant dispatch with GPS coordination or dial helpline 108')}</p>
            </div>
          </div>
          <Link
            to="/emergency"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-all shrink-0"
            style={{ fontFamily: 'Lexend, sans-serif' }}
          >
            <span className="material-symbols-outlined text-lg">emergency_share</span>
            <span>{t('emergency_access', 'EMERGENCY ACCESS')}</span>
          </Link>
        </div>
      </div>
    </PatientLayout>
  )
}
