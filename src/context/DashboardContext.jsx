import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabaseRotaciones, supabaseAsistencias, supabaseMantenimiento } from '../lib/supabase'

const DashboardContext = createContext()

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) throw new Error('useDashboard must be used within DashboardProvider')
  return context
}

export const DashboardProvider = ({ children }) => {
  const [rotaciones, setRotaciones] = useState([])
  const [asistencias, setAsistencias] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllData()
    
    // Suscripciones en tiempo real para cada base de datos
    const channels = [
      supabaseRotaciones.channel('rotaciones-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'rotaciones' }, 
          () => loadRotaciones()
        ).subscribe(),
      
      supabaseMantenimiento.channel('solicitudes-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'solicitudes' },
          () => loadSolicitudes()
        ).subscribe(),
      
      supabaseAsistencias.channel('asistencias-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'asistencias' },
          () => loadAsistencias()
        ).subscribe()
    ]

    return () => {
      channels.forEach(channel => {
        if (channel) channel.unsubscribe()
      })
    }
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    await Promise.all([
      loadRotaciones(),
      loadSolicitudes(),
      loadAsistencias()
    ])
    setLoading(false)
  }

  const loadRotaciones = async () => {
    try {
      const { data, error } = await supabaseRotaciones
        .from('rotaciones')
        .select('*')
        .order('fecha_hora', { ascending: false })
      
      if (!error) setRotaciones(data || [])
    } catch (error) {
      console.error('Error cargando rotaciones:', error)
    }
  }

  const loadSolicitudes = async () => {
    try {
      const { data, error } = await supabaseMantenimiento
        .from('solicitudes')
        .select('*')
        .order('fecha_solicitud', { ascending: false })
      
      if (!error) setSolicitudes(data || [])
    } catch (error) {
      console.error('Error cargando solicitudes:', error)
    }
  }

  const loadAsistencias = async () => {
    try {
      const { data, error } = await supabaseAsistencias
        .from('asistencias')
        .select('*')
        .order('FECHA', { ascending: false })
      
      if (!error) setAsistencias(data || [])
    } catch (error) {
      console.error('Error cargando asistencias:', error)
    }
  }

  const value = {
    rotaciones,
    asistencias,
    solicitudes,
    loading,
    refreshData: loadAllData
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}