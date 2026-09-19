import { Router } from 'express'
import { PatientController } from '../controllers/patientController.js'
import { requirePatientAuth } from '../middleware/authMiddleware.js'

const router = Router()

// Register a new patient or return existing matching record
router.post('/register', PatientController.register)

// Patient Prescriptions (Process 7)
router.get('/prescriptions', requirePatientAuth, PatientController.getPrescriptions)
router.get('/prescriptions/:id', requirePatientAuth, PatientController.getPrescriptionById)

// Lookup by permanent Patient Unique Code (e.g. AC-7F42K9)
router.get('/code/:code', PatientController.getByUniqueCode)

// Lookup patient history
router.get('/me/history', requirePatientAuth, (req, res, next) => {
  req.params.patientId = 'me'
  return PatientController.getPatientHistory(req, res, next)
})
router.get('/history/me', requirePatientAuth, (req, res, next) => {
  req.params.patientId = 'me'
  return PatientController.getPatientHistory(req, res, next)
})
router.get('/:patientId/history', PatientController.getPatientHistory)

// Unified Medical Timeline (Process 16 - Chronological Clinical Timeline)
router.get('/me/timeline', requirePatientAuth, (req, res, next) => {
  req.params.patientId = 'me'
  return PatientController.getPatientTimeline(req, res, next)
})
router.get('/timeline/me', requirePatientAuth, (req, res, next) => {
  req.params.patientId = 'me'
  return PatientController.getPatientTimeline(req, res, next)
})
router.get('/:patientId/timeline', PatientController.getPatientTimeline)

// Patient Medical Handoff Summary (AI Generated + Source Traceable)
router.get('/me/medical-summary', requirePatientAuth, (req, res, next) => {
  req.params.patientId = 'me'
  return PatientController.getMedicalSummary(req, res, next)
})
router.get('/medical-summary/me', requirePatientAuth, (req, res, next) => {
  req.params.patientId = 'me'
  return PatientController.getMedicalSummary(req, res, next)
})
router.get('/:patientId/medical-summary', requirePatientAuth, PatientController.getMedicalSummary)

// Lookup by ID or Unique Code
router.get('/:id', PatientController.getById)

export default router

