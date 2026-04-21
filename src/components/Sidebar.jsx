import React from 'react'
import { BarChart3, Wrench, UserCheck, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuSections = [
    {
      title: 'GRÁFICAS',
      items: [
        { id: 'rotaciones', label: 'ROTACIONES', icon: BarChart3, color: '#3b82f6' },
        { id: 'mantenimientos', label: 'MANTENIMIENTOS', icon: Wrench, color: '#f97316' },
        { id: 'asistencias', label: 'ASISTENCIAS', icon: UserCheck, color: '#10b981' }
      ]
    },
    {
      title: 'ANÁLISIS DETALLADO',
      items: [
        { id: 'analisis-rotaciones', label: 'ANÁLISIS DE ROTACIONES', icon: TrendingUp, color: '#8b5cf6' },
        { id: 'analisis-mantenimientos', label: 'ANÁLISIS DE MANTENIMIENTOS', icon: AlertCircle, color: '#ef4444' },
        { id: 'analisis-asistencias', label: 'ANÁLISIS DE ASISTENCIAS', icon: Clock, color: '#475569' }
      ]
    }
  ]

  return (
    <div className="sidebar glass-card" style={{ borderRadius: 0 }}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">GRÁFICAS Y ANÁLISIS</h1>
        <p className="sidebar-subtitle">Sistema de Monitoreo CRUGER v3.0.1</p>
      </div>

      {menuSections.map((section, idx) => (
        <div key={idx} className="nav-section">
          <h3 className="nav-section-title">{section.title}</h3>
          <div className="nav-menu">
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <div className="nav-icon" style={{ background: item.color }}>
                    <Icon size={16} />
                  </div>
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Sidebar
