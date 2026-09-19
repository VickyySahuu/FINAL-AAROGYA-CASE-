// Client Service for Patient Cases connecting to Express/PostgreSQL backend
import { AuthApi } from './authApi'

const API_BASE = import.meta.env.VITE_API_URL
  || (typeof window !== 'undefined' && window.__API_URL__)
  || (import.meta.env.PROD ? 'https://final-aarogya-case-backend.onrender.com' : '')

async function request(endpoint, options = {}) {
  const token = AuthApi.getToken()
    || (typeof window !== 'undefined' ? (localStorage.getItem('aarogya_session_token') || localStorage.getItem('aarogya_patient_session_token') || sessionStorage.getItem('aarogya_patient_session_token')) : null)

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
      } else if ((res.status === 401 || res.status === 404 || res.status >= 500) && urls.indexOf(url) < urls.length - 1) {
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
    }
  }

  return {
    ok: false,
    status: 0,
    message: 'Backend service unavailable. Please ensure the backend server is running.',
    error: lastError
  }
}

export const CaseApi = {
  // POST /api/patient-cases
  async createCase(caseData) {
    const res = await request('/api/patient-cases', {
      method: 'POST',
      body: JSON.stringify(caseData)
    })

    if (res.ok && res.data?.case) {
      return {
        success: true,
        case: res.data.case,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to create patient case'
    }
  },

  // GET /api/patient-cases
  async getCases() {
    const res = await request('/api/patient-cases')
    if (res.ok && Array.isArray(res.data?.cases)) {
      return { success: true, cases: res.data.cases }
    }
    return { success: false, cases: [], message: res.message }
  },

  // GET /api/patient-cases/:id
  async getCaseById(id) {
    const res = await request(`/api/patient-cases/${encodeURIComponent(id)}`)
    if (res.ok && res.data?.case) {
      return { success: true, case: res.data.case }
    }
    return { success: false, message: res.message || 'Case not found' }
  },

  // PATCH /api/patient-cases/:id
  async updateCase(id, updateData) {
    const res = await request(`/api/patient-cases/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })

    if (res.ok && res.data?.case) {
      return { success: true, case: res.data.case, message: res.data.message }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to update patient case'
    }
  },

  // POST /api/patient-cases/interview/init
  async initOrResumeInterview() {
    const res = await request('/api/patient-cases/interview/init', {
      method: 'POST',
      body: JSON.stringify({})
    })

    if (res.ok && res.data?.case) {
      return {
        success: true,
        case: res.data.case,
        isResumed: res.data.isResumed,
        conversationHistory: res.data.conversationHistory || [],
        initialQuestion: res.data.initialQuestion,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to initialize AI case interview'
    }
  },

  // POST /api/patient-cases/:id/interview/reset or POST /api/patient-cases/interview/reset
  async resetInterview(caseId = null) {
    const endpoint = caseId
      ? `/api/patient-cases/${encodeURIComponent(caseId)}/interview/reset`
      : '/api/patient-cases/interview/reset'
    const res = await request(endpoint, {
      method: 'POST',
      body: JSON.stringify({})
    })

    if (res.ok && res.data?.case) {
      return {
        success: true,
        case: res.data.case,
        conversationHistory: res.data.conversationHistory || [],
        initialQuestion: res.data.initialQuestion,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to reset clinical interview'
    }
  },

  // POST /api/patient-cases/:id/interview
  async sendInterviewTurn(caseId, message, conversationHistory = [], options = {}) {
    const inputMode = options.inputMode || 'text'
    const res = await request(`/api/patient-cases/${encodeURIComponent(caseId)}/interview`, {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory, inputMode })
    })

    if (res.ok && res.data?.turnResult) {
      return {
        success: true,
        turnResult: res.data.turnResult,
        case: res.data.case,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to process clinical interview response'
    }
  },

  // POST /api/patient-cases/:id/confirm
  async confirmCase(caseId, structuredHistory = null) {
    const res = await request(`/api/patient-cases/${encodeURIComponent(caseId)}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ structuredHistory })
    })

    if (res.ok && res.data?.case) {
      return {
        success: true,
        case: res.data.case,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to confirm patient case'
    }
  },

  // POST /api/patient-cases/:id/documents
  async uploadCaseDocument(caseId, { file, fileData, fileName, fileType, languageStyle = 'english' }) {
    let payload = {
      fileData,
      fileName,
      fileType,
      languageStyle
    }

    // If a browser File object is passed without pre-converted base64, convert it
    if (file && !fileData && typeof FileReader !== 'undefined') {
      fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      payload.fileData = fileData
      payload.fileName = fileName || file.name
      payload.fileType = fileType || file.type || 'application/pdf'
    }

    const res = await request(`/api/patient-cases/${encodeURIComponent(caseId)}/documents`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    if (res.ok && res.data?.success) {
      return {
        success: true,
        document: res.data.document,
        findings: res.data.findings,
        turnResult: res.data.turnResult,
        case: res.data.case,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || res.data?.message || 'Failed to upload and analyze document'
    }
  },

  // DELETE /api/patient-cases/:id/documents/:docId
  async deleteCaseDocument(caseId, docId) {
    const res = await request(`/api/patient-cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(docId)}`, {
      method: 'DELETE'
    })

    if (res.ok && res.data?.case) {
      return {
        success: true,
        case: res.data.case,
        message: res.data.message
      }
    }

    return {
      success: false,
      status: res.status,
      message: res.message || 'Failed to remove document from case'
    }
  },

  // Get file URL for document preview
  getDocumentFileUrl(caseId, docId) {
    const token = AuthApi.getToken()
    const query = token ? `?token=${encodeURIComponent(token)}` : ''
    return `${API_BASE}/api/patient-cases/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(docId)}/file${query}`
  },

  // GET /api/patient-cases/:id/summary
  async getAiSummary(caseId) {
    const res = await request(`/api/patient-cases/${encodeURIComponent(caseId)}/summary`)
    if (res.ok && res.data?.summary) {
      return { success: true, summary: res.data.summary }
    }
    return { success: false, summary: null, message: res.message || 'Failed to fetch AI clinical summary' }
  }
}


