import React from 'react'
import { Link } from 'react-router-dom'
import officialEmblem from '@stitch/aarogya_case_official_emblem.png_1/screen.png'
import { usePatientLanguage } from '../../context/PatientLanguageContext'

export default function Header({ 
  portalBadge = 'Patient Portal', 
  subtitle = 'Healthcare Digital Platform',
  activeNav = 'HOME' 
}) {
  const isPatientPortal = portalBadge === 'Patient Portal' || portalBadge === 'मरीज पोर्टल'
  const { language, setLanguage, t, languages } = usePatientLanguage()

  const displayedBadge = isPatientPortal ? t('portal_badge', portalBadge) : portalBadge
  const displayedSubtitle = isPatientPortal ? t('portal_subtitle', subtitle) : subtitle

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Institutional Title */}
        <Link to="/" className="flex items-center space-x-2.5 sm:space-x-3.5 group focus:outline-none focus:ring-2 focus:ring-[#166534] rounded p-1 min-h-[44px]">
          <img 
            src={officialEmblem} 
            alt="AAROGYA CASE Official Emblem" 
            className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-full shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#0A2540] group-hover:text-[#166534] transition-colors leading-tight">
                AAROGYA CASE
              </span>
              {displayedBadge && (
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-[#166534] border border-emerald-200 rounded-full">
                  {displayedBadge}
                </span>
              )}
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 leading-snug truncate max-w-[190px] sm:max-w-none">
              {displayedSubtitle}
            </span>
          </div>
        </Link>

        {/* Functional Navigation Links & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Patient Portal Language Selector (ONLY IN PATIENT PORTAL) */}
          {isPatientPortal && (
            <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200 shrink-0" title="Select Language / भाषा चुनें">
              <span className="material-symbols-outlined text-[15px] text-slate-500 ml-1.5 mr-1 shrink-0">translate</span>
              <div className="flex items-center gap-0.5">
                {languages.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    id={`btn-lang-${l.code}`}
                    className={`px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold rounded-full transition-all cursor-pointer ${
                      language === l.code
                        ? 'bg-[#166534] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            <Link 
              to="/" 
              className={`px-3 py-1.5 rounded-md transition-colors min-h-[44px] flex items-center ${
                activeNav === 'HOME' 
                  ? 'text-[#166534] font-semibold bg-emerald-50' 
                  : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-50'
              }`}
            >
              {isPatientPortal ? t('home') : 'HOME'}
            </Link>
            <a 
              href="#patient-services" 
              className="px-3 py-1.5 text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 rounded-md transition-colors min-h-[44px] flex items-center"
            >
              {isPatientPortal ? t('patient_services') : 'PATIENT SERVICES'}
            </a>
            <a 
              href="#help" 
              className="px-3 py-1.5 text-slate-600 hover:text-[#0A2540] hover:bg-slate-50 rounded-md transition-colors min-h-[44px] flex items-center"
            >
              {isPatientPortal ? t('help') : 'HELP'}
            </a>
          </div>

          {/* Emergency Highlight Button */}
          <Link 
            to="/emergency" 
            className="py-2 px-3 sm:px-4 font-semibold text-[#dc2626] bg-red-50 border border-red-200 flex items-center gap-1.5 shadow-xs rounded-full hover:bg-red-100 transition-colors text-xs sm:text-sm min-h-[44px] shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span>
            <span className="material-symbols-outlined text-[18px] shrink-0">emergency</span>
            <span>{isPatientPortal ? t('emergency') : 'EMERGENCY'}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

