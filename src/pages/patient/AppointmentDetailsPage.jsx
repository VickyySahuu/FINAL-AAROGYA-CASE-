import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PatientLayout from '../../components/layout/PatientLayout'
import { getPatientProfile } from '../../data/patientMockData'
import { AuthApi } from '../../services/authApi'
import { AppointmentApi } from '../../services/appointmentApi'

export default function AppointmentDetailsPage() {
  const location = useLocation()
  const state = location.state || {}
  const profile = AuthApi.getStoredPatient() || getPatientProfile()
  const [apt, setApt] = useState(state.appointment || null)
  const [loading, setLoading] = useState(!state.appointment)

  const targetId = state.appointmentId || state.appointmentNumber || (typeof window !== 'undefined' ? sessionStorage.getItem('aarogya_last_appointment_id') : null)

  useEffect(() => {
    if (state.appointment) {
      setApt(state.appointment)
      setLoading(false)
      return
    }

    let mounted = true
    async function loadAppointment() {
      if (targetId) {
        try {
          const res = await AppointmentApi.getAppointmentById(targetId)
          if (mounted && res.success && res.appointment) {
            setApt(res.appointment)
            setLoading(false)
            return
          }
        } catch (e) {
          console.warn('Error loading appointment by ID:', e)
        }
      }

      // Try loading latest appointment from my appointments
      try {
        const myRes = await AppointmentApi.getMyAppointments()
        if (mounted && myRes.success && Array.isArray(myRes.appointments) && myRes.appointments.length > 0) {
          const a = myRes.appointments[0]
          setApt({
            id: a.appointmentNumber || a.appointment_number || `APT-${a.id}`,
            hospital: a.hospitalName || a.hospital_name || 'District Civil Hospital',
            hospitalName: a.hospitalName || a.hospital_name || 'District Civil Hospital',
            doctor: a.doctorName || a.doctor_name || 'Dr. Ramanathan Venkatraman',
            doctorName: a.doctorName || a.doctor_name || 'Dr. Ramanathan Venkatraman',
            specialty: a.specialty || a.specialization || 'General Medicine',
            date: a.appointmentDate || a.appointment_date || 'Today',
            time: a.timeSlot || a.time_slot || '09:30 AM',
            token: a.tokenNumber || a.token_number || `#${a.id}`,
            room: a.opdRoom || a.opd_room || 'Room 104',
            fee: a.paymentMethod || 'Universal Public Free OPD',
            status: a.status || 'Confirmed',
            department: 'General Medicine',
            counter: a.counter || 'Counter 02'
          })
          setLoading(false)
          return
        }
      } catch (e) {
        console.warn('Error loading appointments queue:', e)
      }

      if (mounted) setLoading(false)
    }

    loadAppointment()
    return () => { mounted = false }
  }, [targetId, state.appointment])

  if (loading) {
    return (
      <PatientLayout
        activeNav="PATIENT SERVICES"
        breadcrumbs={[
          { label: 'Patient Portal', to: '/patient/home' },
          { label: 'Appointments', to: '/patient/appointments' },
          { label: 'Appointment Details' }
        ]}
        backTo="/patient/appointments"
        backLabel="Back to Appointments"
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl animate-spin text-[#166534]">progress_activity</span>
          <p className="text-sm text-slate-500 font-medium">Loading appointment token details...</p>
        </div>
      </PatientLayout>
    )
  }

  if (!apt) {
    return (
      <PatientLayout
        activeNav="PATIENT SERVICES"
        breadcrumbs={[
          { label: 'Patient Portal', to: '/patient/home' },
          { label: 'Appointments', to: '/patient/appointments' },
          { label: 'Appointment Details' }
        ]}
        backTo="/patient/appointments"
        backLabel="Back to Appointments"
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <span className="material-symbols-outlined text-3xl">event_busy</span>
          </div>
          <h2 className="text-xl font-bold text-[#0A2540]">No Appointment Selected</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Please select an outpatient appointment from your scheduled visits to view the token slip.
          </p>
          <Link
            to="/patient/appointments"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#166534] text-white text-xs font-bold uppercase tracking-wider"
          >
            <span>View Appointments</span>
          </Link>
        </div>
      </PatientLayout>
    )
  }

  return (
    <PatientLayout
      activeNav="PATIENT SERVICES"
      breadcrumbs={[
        { label: 'Patient Portal', to: '/patient/home' },
        { label: 'Appointments', to: '/patient/appointments' },
        { label: 'Appointment Details' }
      ]}
      backTo="/patient/appointments"
      backLabel="Back to Appointments"
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#166534] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {apt.id || '—'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#166534]">
                  {apt.status || 'Confirmed'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0A2540]" style={{ fontFamily: 'Lexend, sans-serif' }}>
                Outpatient Consultation Token Slip
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Booked under Universal Healthcare OPD Scheme</p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
              style={{ fontFamily: 'Lexend, sans-serif' }}
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Token Slip</span>
            </button>
          </div>

          {/* Token Highlight Banner */}
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#166534]" style={{ fontFamily: 'Lexend, sans-serif' }}>
                Assigned Consultation Queue Token
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#166534] font-mono tracking-tight mt-1">
                {apt.token || '—'}
              </div>
              <span className="text-xs text-slate-600 mt-1 block">Expected reporting window: {apt.time || '—'}</span>
            </div>

            <div className="bg-white border border-emerald-200 p-4 rounded-xl text-left text-xs min-w-[220px] shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-400 font-bold">Room</span>
                <span className="font-bold text-slate-900">{apt.room || 'Room 104'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400 font-bold">Check-in Counter</span>
                <span className="font-bold text-slate-900">{apt.counter || 'Counter 02'}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-bold">Fee</span>
                <span className="font-bold text-[#166534]">{apt.fee || 'Universal Public Free OPD'}</span>
              </div>
            </div>
          </div>

          {/* Patient & Hospital Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Citizen</span>
              <span className="font-bold text-slate-800 text-sm">{profile.name || 'Citizen'}</span>
              <span className="text-slate-500 font-mono block">{profile.patientId || profile.patient_id || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Physician</span>
              <span className="font-bold text-slate-800 text-sm">{apt.doctorName || apt.doctor || 'Consulting Physician'}</span>
              <span className="text-slate-500 block">{apt.specialty || 'General Medicine'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Hospital</span>
              <span className="font-bold text-slate-800 text-sm">{apt.hospitalName || apt.hospital || 'District Civil Hospital'}</span>
              <span className="text-slate-500 block">Outpatient Block</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Date & Session</span>
              <span className="font-bold text-slate-800 text-sm">{apt.date || 'Today'}</span>
              <span className="text-[#166534] font-semibold block">{apt.time || '—'}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block" style={{ fontFamily: 'Lexend, sans-serif' }}>
              Arrival Guidelines
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Please reach the hospital OPD registration hall at least 15 minutes before your time slot.</li>
              <li>Present this electronic token slip or SMS notification at Counter 02 for physical queue verification.</li>
              <li>Carry any previous diagnostic slips or physical test films if relevant to your condition.</li>
              <li>For any scheduling changes or queries, dial National Health Helpline 1075.</li>
            </ul>
          </div>
        </div>
      </div>
    </PatientLayout>
  )
}
