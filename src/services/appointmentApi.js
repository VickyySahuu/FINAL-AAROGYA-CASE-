// Client Service for Appointments connecting to Express/PostgreSQL backend
import { AuthApi } from './authApi'

const API_BASE = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' && window.__API_URL__)
  || (import.meta.env.PROD ? 'https://final-aarogya-case-backend.onrender.com' : '')

async function request(endpoint, options = {}) {
  const token = AuthApi.getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const currentHost = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : 'localhost'
  const urls = [
    `${API_BASE}${endpoint}`,
    `http://${currentHost}:5000${endpoint}`,
    `http://localhost:5000${endpoint}`
  ]

  let lastError = null

  for (const url of urls) {
    try {
      const res = await fetch(url, { ...options, headers })
      const data = await res.json().catch(() => null)

      if (res.ok) {
        return { ok: true, status: res.status, data }
      } else {
        return {
          ok: false,
          status: res.status,
          message: data?.message || `Server responded with status ${res.status}`,
          data
        }
      }
    } catch (err) {
      lastError = err
    }
  }

  return {
    ok: false,
    status: 0,
    message: 'Backend service unavailable. Please ensure the backend server is running.',
    error: lastError
  }
}

export const AppointmentApi = {
  // GET /api/hospitals
  async getHospitals() {
    const res = await request('/api/hospitals')
    if (res.ok && Array.isArray(res.data?.hospitals)) {
      return { success: true, hospitals: res.data.hospitals }
    }
    return {
      success: false,
      hospitals: [],
      message: res.message || 'Failed to fetch hospitals'
    }
  },

  // GET /api/doctors
  async getDoctors() {
    const res = await request('/api/doctors')
    if (res.ok && Array.isArray(res.data?.doctors)) {
      return { success: true, doctors: res.data.doctors }
    }
    return {
      success: false,
      doctors: [],
      message: res.message || 'Failed to fetch doctors'
    }
  },

  // GET /api/appointments/slots?doctorId=...&date=...
  async getSlots({ doctorId = 1, date = '' } = {}) {
    const params = new URLSearchParams()
    if (doctorId) params.append('doctorId', doctorId)
    if (date) params.append('date', date)

    const res = await request(`/api/appointments/slots?${params.toString()}`)
    if (res.ok && res.data) {
      return {
        success: true,
        morningSlots: res.data.morningSlots || [],
        afternoonSlots: res.data.afternoonSlots || [],
        bookedSlots: res.data.bookedSlots || []
      }
    }
    return {
      success: false,
      morningSlots: [],
      afternoonSlots: [],
      bookedSlots: [],
      message: res.message || 'Failed to fetch slot availability'
    }
  },

  // POST /api/appointments
  async bookAppointment(bookingData) {
    const res = await request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    })

    if (res.ok && res.data?.appointment) {
      return {
        success: true,
        appointment: res.data.appointment,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to book appointment',
      data: res.data
    }
  },

  // GET /api/appointments/:id
  async getAppointmentById(id) {
    const res = await request(`/api/appointments/${encodeURIComponent(id)}`)
    if (res.ok && res.data?.appointment) {
      return {
        success: true,
        appointment: res.data.appointment
      }
    }
    return {
      success: false,
      status: res.status,
      message: res.message || 'Appointment record not found'
    }
  },

  // GET /api/appointments
  async getMyAppointments() {
    const res = await request('/api/appointments')
    if (res.ok && Array.isArray(res.data?.appointments)) {
      return { success: true, appointments: res.data.appointments }
    }
    return {
      success: false,
      appointments: [],
      message: res.message || 'Failed to retrieve appointments'
    }
  }
}
