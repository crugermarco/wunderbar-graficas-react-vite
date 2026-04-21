import React, { useState } from 'react'
import { DashboardProvider } from './context/DashboardContext'
import Sidebar from './components/Sidebar'
import Rotaciones from './pages/Rotaciones'
import Mantenimientos from './pages/Mantenimientos'
import Asistencias from './pages/Asistencias'
import AnalisisRotaciones from './pages/AnalisisRotaciones'
import AnalisisMantenimientos from './pages/AnalisisMantenimientos'
import AnalisisAsistencias from './pages/AnalisisAsistencias'
import BackgroundEffect from './components/BackgroundEffect'
import './styles/globals.css'
import './styles/animations.css'

function App() {
  const [activeSection, setActiveSection] = useState('rotaciones')

  const renderSection = () => {
    switch(activeSection) {
      case 'rotaciones': return <Rotaciones />
      case 'mantenimientos': return <Mantenimientos />
      case 'asistencias': return <Asistencias />
      case 'analisis-rotaciones': return <AnalisisRotaciones />
      case 'analisis-mantenimientos': return <AnalisisMantenimientos />
      case 'analisis-asistencias': return <AnalisisAsistencias />
      default: return <Rotaciones />
    }
  }

  const getPageTitle = () => {
    const titles = {
      'rotaciones': 'Rotaciones',
      'mantenimientos': 'Mantenimientos',
      'asistencias': 'Asistencias',
      'analisis-rotaciones': 'Análisis de Rotaciones',
      'analisis-mantenimientos': 'Análisis de Mantenimientos',
      'analisis-asistencias': 'Análisis de Asistencias'
    }
    return titles[activeSection] || 'Dashboard'
  }

  return (
    <DashboardProvider>
      <BackgroundEffect />
      <div className="dashboard-layout">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="main-content">
          <div className="content-wrapper">
            <div className="content-header fade-in-up">
              <h1 className="page-title">{getPageTitle()}</h1>
              <p className="page-subtitle">Visualización de datos y análisis estadístico</p>
            </div>
            {renderSection()}
          </div>
        </main>
      </div>
    </DashboardProvider>
  )
}

export default App