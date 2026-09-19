import React from 'react'
import UtilityBar from './UtilityBar'
import Header from './Header'
import Breadcrumbs from '../common/Breadcrumbs'
import Footer from './Footer'
import { PatientLanguageProvider, usePatientLanguage } from '../../context/PatientLanguageContext'

function PatientLayoutContent({
  children,
  activeNav = 'HOME',
  breadcrumbs = null,
  backTo = null,
  backLabel = 'Back',
  activeService = 'Patient Digital Portal'
}) {
  const { t } = usePatientLanguage()
  const translatedBackLabel = backLabel === 'Back' ? t('back', 'Back') : (backLabel === 'Home' ? t('home', 'Home') : backLabel)

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans">
      {/* 1. Official Institutional Utility Bar */}
      <div className="no-print">
        <UtilityBar activeService={activeService} />
      </div>

      {/* 2. Official Header with Language Switcher */}
      <div className="no-print">
        <Header portalBadge="Patient Portal" subtitle="Healthcare Digital Platform" activeNav={activeNav} />
      </div>

      {/* 3. Optional Breadcrumbs */}
      {breadcrumbs && (
        <div className="no-print">
          <Breadcrumbs items={breadcrumbs} backTo={backTo} backLabel={translatedBackLabel} />
        </div>
      )}

      {/* 4. Main Page Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* 5. Institutional Footer */}
      <div className="no-print">
        <Footer />
      </div>
    </div>
  )
}

export default function PatientLayout(props) {
  return <PatientLayoutContent {...props} />
}

