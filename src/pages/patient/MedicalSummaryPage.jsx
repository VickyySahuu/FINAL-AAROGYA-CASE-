import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PatientLayout from '../../components/layout/PatientLayout'
import { PatientApi } from '../../services/patientApi'
import { usePatientLanguage } from '../../context/PatientLanguageContext'
import officialEmblem from '@stitch/aarogya_case_official_emblem.png_1/screen.png'

export default function MedicalSummaryPage() {
  const { language, t } = usePatientLanguage()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const loadSummary = useCallback(async (selectedLang = language) => {
    try {
      setLoading(true)
      setError(null)
      const res = await PatientApi.getMedicalSummary(selectedLang)
      if (res.success && res.summary) {
        setSummary(res.summary)
        setLastRefreshed(new Date().toLocaleTimeString())
      } else {
        setError(res.message || 'Unable to generate medical summary.')
      }
    } catch (err) {
      console.error('Error fetching medical summary:', err)
      setError(err.message || 'An unexpected error occurred while generating summary.')
    } finally {
      setLoading(false)
    }
  }, [language])

  useEffect(() => {
    loadSummary(language)
  }, [language, loadSummary])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = () => {
    // In modern browsers, window.print() gives users native high-fidelity "Save as PDF" with exact vector fonts
    window.print()
  }

  return (
    <PatientLayout
      activeNav="PATIENT SERVICES"
      breadcrumbs={[
        { label: t('portal_badge', 'Patient Portal'), to: '/patient/home' },
        { label: t('medical_summary', 'Medical Summary') }
      ]}
      backTo="/patient/home"
      backLabel="Home"
      activeService="Medical Summary & Doctor Handoff"
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
        
        {/* Interactive Top Action Bar (Hidden during Print) */}
        <div className="no-print bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#166534] border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-sm">clinical_notes</span>
              <span>{t('handoff_badge', 'PATIENT HANDOFF RECORD')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2540] tracking-tight" style={{ fontFamily: 'Lexend, sans-serif' }}>
              {t('summary_heading', 'Medical Summary')}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              {t('summary_subheading', 'Your health record summary for sharing with another doctor')}
            </p>
            {lastRefreshed && (
              <p className="text-xs text-slate-400">
                {t('generated_on', 'Generated on')}: <span className="font-mono font-medium text-slate-600">{lastRefreshed}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => loadSummary(language)}
              disabled={loading}
              id="btn-generate-summary"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className={`material-symbols-outlined text-base ${loading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>{loading ? t('generating', 'Generating Summary...') : t('refresh_summary', 'Refresh Summary')}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={loading || !summary}
              id="btn-download-pdf"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#166534] hover:bg-[#14532d] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{t('download_pdf', 'Download PDF')}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={loading || !summary}
              id="btn-print-summary"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>{t('print', 'Print')}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !summary && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-slate-700">{t('generating', 'Generating Summary...')}</p>
            <p className="text-xs text-slate-500">Synthesizing clinical consultations, prescriptions, reports, and timeline records...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
            <span className="material-symbols-outlined text-3xl text-red-600">error</span>
            <p className="text-sm font-bold text-red-900">{error}</p>
            <button
              type="button"
              onClick={() => loadSummary(language)}
              className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* PRINTABLE A4 MEDICAL SUMMARY DOCUMENT */}
        {/* ============================================================ */}
        {summary && (
          <div 
            id="medical-summary-document"
            className="printable-document bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 font-sans"
            style={{ colorScheme: 'light' }}
          >
            {/* 1. Official Header & Branding */}
            <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={officialEmblem}
                  alt="AAROGYA CASE Emblem"
                  className="w-14 h-14 object-contain rounded-full border border-slate-200 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-[#0A2540]" style={{ fontFamily: 'Lexend, sans-serif' }}>
                      AAROGYA CASE
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#166534] rounded">
                      GOVERNMENT DIGITAL PLATFORM
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Universal Clinical Handoff & Patient Digital Health Record
                  </p>
                </div>
              </div>

              <div className="flex flex-col text-left sm:text-right text-xs text-slate-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t('summary_id', 'Summary ID')}
                </span>
                <span className="font-mono font-bold text-slate-800 text-sm">{summary.summaryId}</span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {new Date(summary.generatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="text-center border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A2540] uppercase tracking-wide" style={{ fontFamily: 'Lexend, sans-serif' }}>
                {summary.title || t('official_title', 'PATIENT MEDICAL SUMMARY')}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl mx-auto">
                {summary.subtitle}
              </p>
            </div>

            {/* 2. Patient Identity Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 break-inside-avoid">
              <div className="flex items-center gap-2 text-[#166534] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="material-symbols-outlined text-lg">badge</span>
                <span>{t('patient_identity', 'Patient Identity')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Patient Name</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{summary.patient.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Age / Gender</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {summary.patient.age} yrs • {summary.patient.gender}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Unique Code</span>
                  <span className="font-mono font-bold text-[#166534] text-sm mt-0.5 block">
                    {summary.patient.patientUniqueCode}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Mobile</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                    {summary.patient.mobile}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Blood Group</span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">{summary.patient.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Identity Document</span>
                  <span className="font-mono text-slate-700 text-xs mt-0.5 block">
                    {summary.patient.identityType}: {summary.patient.identityNumberMasked}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block font-semibold">Registered Address</span>
                  <span className="text-slate-700 text-xs mt-0.5 block truncate">{summary.patient.address}</span>
                </div>
              </div>
            </div>

            {/* Empty State Banner (If no prior records exist) */}
            {!summary.hasRecords && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3 break-inside-avoid">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">folder_off</span>
                </div>
                <h3 className="text-base font-bold text-amber-950">
                  {summary.emptyMessage || t('no_prior_records', 'No prior clinical records documented in AAROGYA CASE.')}
                </h3>
                <p className="text-xs text-amber-800 max-w-lg mx-auto leading-relaxed">
                  {t('new_patient_notice', 'This account is newly registered. Once you complete clinical consultations, upload lab tests, or receive e-prescriptions, your comprehensive clinical summary will be generated here automatically.')}
                </p>
              </div>
            )}

            {/* 3. Executive AI / Clinical Synthesis Narrative */}
            {summary.hasRecords && summary.executiveNarrative && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 sm:p-6 break-inside-avoid">
                <div className="flex items-center gap-2 text-[#166534] text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  <span>Executive Clinical Synthesis ({summary.language.toUpperCase()})</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {summary.executiveNarrative}
                </p>
                <span className="text-[10px] text-emerald-800 font-semibold mt-2 inline-block">
                  Source: Synthesized strictly from authenticated AAROGYA CASE clinical encounters.
                </span>
              </div>
            )}

            {/* 4. Current / Recent Concern */}
            {summary.hasRecords && summary.currentConcern && (
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 break-inside-avoid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg text-emerald-700">stethoscope</span>
                    <span>{t('current_concern', 'Current / Recent Concern')}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {summary.currentConcern.caseNumber} • {summary.currentConcern.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">{t('chiefComplaint', 'Chief Complaint')}</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">{summary.currentConcern.chiefComplaint}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">{t('duration', 'Duration')}</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{summary.currentConcern.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">{t('severity', 'Severity')}</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{summary.currentConcern.severity}</span>
                  </div>
                </div>

                {summary.currentConcern.verbatimStatement && (
                  <div className="text-xs bg-white border border-slate-200 p-3 rounded-xl text-slate-700 italic">
                    <span className="font-bold not-italic text-slate-900 block mb-0.5">Patient Verbatim Statement:</span>
                    "{summary.currentConcern.verbatimStatement}"
                  </div>
                )}

                {Array.isArray(summary.currentConcern.symptoms) && summary.currentConcern.symptoms.length > 0 && (
                  <div className="text-xs space-y-1">
                    <span className="text-slate-500 font-semibold block">{t('symptoms', 'Reported Symptoms')}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {summary.currentConcern.symptoms.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-400">
                  Provenance: <span className="text-slate-600 font-medium">{summary.currentConcern.source}</span>
                </div>
              </div>
            )}

            {/* 5. Documented Allergies & Existing Conditions */}
            <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 break-inside-avoid">
              <div className="flex items-center gap-2 text-[#0A2540] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-lg text-amber-600">warning</span>
                <span>{t('allergies_conditions', 'Allergies & Existing Conditions')}</span>
              </div>
              <p className="text-xs text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                {summary.allergies.statement}
              </p>
              <span className="text-[10px] text-slate-400 mt-2 block">
                Provenance: {summary.allergies.source}
              </span>
            </div>

            {/* 6. Prescribed Medications */}
            {summary.hasRecords && summary.prescriptions.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 break-inside-avoid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg text-emerald-700">prescriptions</span>
                    <span>{t('medications_prescriptions', 'Prescribed Medications')}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {summary.prescriptions.length} Records
                  </span>
                </div>

                <div className="space-y-3">
                  {summary.prescriptions.map((rx, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#166534]">{rx.rxNumber}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-700 font-semibold">{rx.diagnosis}</span>
                        </div>
                        <span className="text-slate-500">
                          {rx.doctorName} • {rx.date ? new Date(rx.date).toLocaleDateString() : 'On record'}
                        </span>
                      </div>

                      {Array.isArray(rx.items) && rx.items.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {rx.items.map((it, iIdx) => (
                            <div key={iIdx} className="bg-white p-2.5 rounded-lg border border-slate-200">
                              <span className="font-bold text-slate-900 block">{it.medicineName}</span>
                              <span className="text-slate-600 text-[11px] mt-0.5 block">
                                {it.dosage} • {it.frequency} {it.durationDays ? `(${it.durationDays} days)` : ''}
                              </span>
                              {it.instructions && (
                                <span className="text-slate-400 text-[10px] block mt-0.5">{it.instructions}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No specific items listed.</p>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Pharmacy Status: <strong className="text-slate-700">{rx.pharmacyStatus}</strong></span>
                        <span>{rx.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Diagnostic Investigations & Lab Reports */}
            {summary.hasRecords && (summary.diagnosticReports.length > 0 || summary.diagnosticRequests.length > 0) && (
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 break-inside-avoid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg text-blue-700">biotech</span>
                    <span>{t('diagnostics_lab', 'Diagnostic Investigations & Reports')}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {summary.diagnosticReports.length} Reports
                  </span>
                </div>

                {/* Verified Reports */}
                {summary.diagnosticReports.length > 0 && (
                  <div className="space-y-3">
                    {summary.diagnosticReports.map((rep, idx) => (
                      <div key={idx} className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-blue-900">{rep.reportId}</span>
                          <span className="text-slate-500">{rep.date ? new Date(rep.date).toLocaleDateString() : 'On record'}</span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm">{rep.testName}</div>
                        <p className="text-slate-700 bg-white/80 p-2.5 rounded-lg border border-blue-100">
                          {rep.findings}
                        </p>

                        {/* Test Results table if present */}
                        {Array.isArray(rep.results) && rep.results.length > 0 && (
                          <div className="mt-2 overflow-x-auto">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-blue-200 text-blue-900 font-bold">
                                  <th className="py-1">Parameter</th>
                                  <th className="py-1">Result</th>
                                  <th className="py-1">Reference Range</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-blue-100">
                                {rep.results.map((r, rIdx) => (
                                  <tr key={rIdx}>
                                    <td className="py-1 font-medium text-slate-800">{r.parameter || r.test || r.name}</td>
                                    <td className="py-1 font-bold text-slate-900">{r.value || r.result}</td>
                                    <td className="py-1 text-slate-500">{r.referenceRange || r.normalRange || r.range || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 pt-1">
                          Provenance: <span className="text-slate-600 font-medium">{rep.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Diagnostic Requests */}
                {summary.diagnosticRequests.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Ordered Investigations</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {summary.diagnosticRequests.map((req, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex justify-between items-center">
                          <div>
                            <span className="font-mono text-[#166534] font-bold block">{req.requestId}</span>
                            <span className="font-semibold text-slate-800">{req.testName}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 8. Attached Medical Documents */}
            {summary.hasRecords && summary.attachedDocuments.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 break-inside-avoid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg text-purple-700">upload_file</span>
                    <span>{t('attached_documents', 'Attached Medical Documents')}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {summary.attachedDocuments.length} Documents
                  </span>
                </div>

                <div className="space-y-2">
                  {summary.attachedDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{doc.name}</span>
                        <span className="text-slate-400 text-[11px]">{doc.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{doc.keyObservations}</p>
                      <span className="text-[10px] text-slate-400 block">{doc.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. OPD Encounters & Previous History */}
            {summary.hasRecords && summary.appointments.length > 0 && (
              <div className="border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3 break-inside-avoid">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0A2540] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg text-amber-700">calendar_month</span>
                    <span>{t('consultations_encounters', 'Consultations & Encounters')}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {summary.appointments.length} Visits
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {summary.appointments.map((apt, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#166534]">{apt.appointmentNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#166534]">
                          {apt.status}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                      <div className="text-slate-500 text-[11px]">{apt.department} • Token: {apt.token}</div>
                      <div className="text-slate-400 text-[10px]">Date: {apt.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. Official Mandatory Clinical Disclaimer */}
            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-5 sm:p-6 text-xs text-slate-600 space-y-2 break-inside-avoid">
              <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                <span className="material-symbols-outlined text-base text-slate-500">gavel</span>
                <span>Legal & Clinical Disclaimer</span>
              </div>
              <p className="leading-relaxed font-medium">
                {summary.disclaimer || t('disclaimer_text')}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[10px] text-slate-400">
                <span>AAROGYA CASE — National Healthcare Digital Platform</span>
                <span>Verification Code: <strong className="font-mono text-slate-600">{summary.patient.patientUniqueCode}</strong></span>
              </div>
            </div>

          </div>
        )}

      </div>
    </PatientLayout>
  )
}
