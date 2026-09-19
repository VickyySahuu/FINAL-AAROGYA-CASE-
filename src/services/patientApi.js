// Centralized API client for Patient module connecting to Express/PostgreSQL backend
import { AuthApi } from './authApi'

const API_BASE = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' && window.__API_URL__)
  || (import.meta.env.PROD ? 'https://final-aarogya-case-backend.onrender.com' : '')

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('aarogya_session_token') || localStorage.getItem('aarogya_patient_session_token') || sessionStorage.getItem('aarogya_patient_session_token'))
    : null

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  const currentHost = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : 'localhost'
  const urls = isLocal
    ? [
        endpoint,
        `http://${currentHost}:5000${endpoint}`,
        `http://localhost:5000${endpoint}`,
        ...(API_BASE ? [`${API_BASE}${endpoint}`] : [])
      ]
    : [
        ...(API_BASE ? [`${API_BASE}${endpoint}`] : []),
        endpoint,
        `http://localhost:5000${endpoint}`
      ]

  let lastError = null

  for (const url of urls) {
    try {
      const res = await fetch(url, { ...options, headers })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        return { ok: true, status: res.status, data }
      } else if (res.status === 404 && urls.indexOf(url) < urls.length - 1) {
        // Try next candidate URL in fallback list
        continue
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
      // Continue to next URL attempt if network failed
    }
  }

  return {
    ok: false,
    status: 0,
    message: 'Backend service unavailable. Please ensure the backend server is running.',
    error: lastError
  }
}

export const PatientApi = {
  // POST /api/patients/register
  async register(patientData) {
    // Clear any previous patient session/cache to prevent cross-account contamination
    AuthApi.clearToken()

    const res = await request('/api/patients/register', {
      method: 'POST',
      body: JSON.stringify(patientData)
    })

    if (res.ok && res.data?.patient) {
      if (res.data.token) {
        AuthApi.setToken(res.data.token)
      }
      if (res.data.session) {
        try {
          localStorage.setItem('aarogya_session_data', JSON.stringify(res.data.session))
        } catch (e) {}
      }
      AuthApi.setStoredPatient(res.data.patient)

      return {
        success: true,
        token: res.data.token,
        session: res.data.session,
        patient: res.data.patient,
        isExisting: res.data.isExisting || false,
        message: res.data.message
      }
    }

    return {
      success: false,
      message: res.message || 'Failed to complete patient registration',
      status: res.status
    }
  },

  // GET /api/patients/:id
  async getById(id) {
    const res = await request(`/api/patients/${encodeURIComponent(id)}`)
    if (res.ok && res.data?.patient) {
      return { success: true, patient: res.data.patient }
    }
    return { success: false, message: res.message || 'Patient not found' }
  },

  // GET /api/patients/code/:code
  async getByUniqueCode(code) {
    const res = await request(`/api/patients/code/${encodeURIComponent(code)}`)
    if (res.ok && res.data?.patient) {
      return { success: true, patient: res.data.patient }
    }
    return { success: false, message: res.message || 'Patient not found' }
  },

  // GET /api/patients/:id/timeline (or /api/patients/timeline/me)
  async getTimeline(patientId = 'me') {
    const target = patientId || 'me'
    const res = await request(`/api/patients/${encodeURIComponent(target)}/timeline`)
    if (res.ok && res.data) {
      return {
        success: true,
        patient: res.data.patient,
        events: res.data.events || [],
        totalEvents: res.data.totalEvents || 0
      }
    }
    return {
      success: false,
      events: [],
      totalEvents: 0,
      message: res.message || 'Failed to load medical timeline'
    }
  },

  // GET /api/patients/:id/history
  async getHistory(patientId = 'me') {
    const target = patientId || 'me'
    const res = await request(`/api/patients/${encodeURIComponent(target)}/history`)
    if (res.ok && res.data) {
      return {
        success: true,
        patient: res.data.patient,
        data: res.data.data || {},
        timeline: res.data.data?.timeline || []
      }
    }
    return {
      success: false,
      data: {},
      timeline: [],
      message: res.message || 'Failed to load patient history'
    }
  },

  // GET /api/patients/me/medical-summary?lang=...
  async getMedicalSummary(lang = 'en') {
    const res = await request(`/api/patients/me/medical-summary?lang=${encodeURIComponent(lang || 'en')}`)
    if (res.ok && res.data) {
      return {
        success: true,
        summary: res.data.summary
      }
    }
    return {
      success: false,
      summary: null,
      message: res.message || 'Failed to generate medical summary'
    }
  }
}

