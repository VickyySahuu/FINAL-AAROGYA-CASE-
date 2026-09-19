import React from 'react'
import AppRouter from './router'
import { PatientLanguageProvider } from './context/PatientLanguageContext'

export default function App() {
  return (
    <PatientLanguageProvider>
      <AppRouter />
    </PatientLanguageProvider>
  )
}
