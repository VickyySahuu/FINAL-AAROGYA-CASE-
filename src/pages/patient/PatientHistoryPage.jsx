import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PatientLayout from '../../components/layout/PatientLayout'
import UnifiedMedicalTimeline from '../../components/timeline/UnifiedMedicalTimeline'
import { PatientApi } from '../../services/patientApi'
import { usePatientLanguage } from '../../context/PatientLanguageContext'

export default function PatientHistoryPage() {
  const { t } = usePatientLanguage()
  const [timelineEvents, setTimelineEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    let mounted = true
    async function loadTimeline() {
      try {
        setLoading(true)
        const res = await PatientApi.getTimeline('me')
        if (mounted && res.success && Array.isArray(res.events)) {
          setTimelineEvents(res.events)
          setTotalCount(res.totalEvents || res.events.length)
        }
      } catch (e) {
        console.warn('Failed loading timeline from API:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadTimeline()
    return () => { mounted = false }
  }, [])

  return (
    <PatientLayout
      activeNav="PATIENT SERVICES"
      breadcrumbs={[
        { label: t('portal_badge', 'Patient Portal'), to: '/patient/home' },
        { label: t('history', 'Unified Medical Timeline') }
      ]}
      backTo="/patient/home"
      backLabel="Home"
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 to-[#0A2540] text-white p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">timeline</span>
              <span>{t('clinical_timeline', 'CHRONOLOGICAL HEALTH RECORD')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'Lexend, sans-serif' }}>
              {t('history', 'Unified Medical Timeline')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consolidated chronological clinical record linking AI intake consultations, uploaded diagnostic reports, doctor prescriptions, and hospital pharmacy dispensings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Quick Action to Medical Summary */}
            <Link
              to="/patient/medical-summary"
              id="btn-timeline-medical-summary"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#166534] hover:bg-emerald-50 text-xs font-bold transition-all uppercase tracking-wider shadow-sm"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className="material-symbols-outlined text-base">clinical_notes</span>
              <span>{t('medical_summary', 'Medical Summary')}</span>
            </Link>
            <Link
              to="/patient/new-problem"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all uppercase tracking-wider"
              style={{ fontFamily: 'Lexend, sans-serif' }}
              id="btn-timeline-new-problem"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>{t('new_problem', 'New Problem')}</span>
            </Link>
            <Link
              to="/patient/previous-cases"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className="material-symbols-outlined text-base">folder_shared</span>
              <span>{t('all_cases', 'All Cases')}</span>
            </Link>
          </div>
        </div>

        {/* Timeline Component */}
        <UnifiedMedicalTimeline
          events={timelineEvents}
          loading={loading}
          isDoctorView={false}
          emptyMessage={t('no_records_found', 'No clinical timeline events recorded yet. Consultations, uploaded medical records, prescriptions, and laboratory reports will appear here automatically.')}
        />
      </div>
    </PatientLayout>
  )
}
