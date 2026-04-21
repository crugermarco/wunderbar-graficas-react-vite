import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'
import TopList from '../components/TopList'
import { Wrench, Clock, CheckCircle } from 'lucide-react'

const Mantenimientos = () => {
  const { solicitudes, loading } = useDashboard()

  const { data2025, data2026, stats, topMaquinas } = useMemo(() => {
    const processYear = (year) => {
      const yearData = solicitudes.filter(row => {
        if (!row.fecha_solicitud) return false
        const date = new Date(row.fecha_solicitud)
        return date.getFullYear() === year
      })
      
      const monthlyCounts = Array(12).fill(0)
      yearData.forEach(row => {
        const date = new Date(row.fecha_solicitud)
        const month = date.getMonth()
        monthlyCounts[month]++
      })
      
      return monthlyCounts
    }

    // Top máquinas (acciones) del año actual
    const currentYear = new Date().getFullYear()
    const yearData = solicitudes.filter(row => {
      if (!row.fecha_solicitud) return false
      return new Date(row.fecha_solicitud).getFullYear() === currentYear
    })
    
    const accionCount = {}
    yearData.forEach(row => {
      if (row.accion_realizada) {
        accionCount[row.accion_realizada] = (accionCount[row.accion_realizada] || 0) + 1
      }
    })
    
    const topAcciones = Object.entries(accionCount)
      .map(([nombre, count]) => ({ nombre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const data2025Data = processYear(2025)
    const data2026Data = processYear(2026)
    
    const pendientes = solicitudes.filter(s => !s.fecha_respuesta).length
    const tiempoPromedio = solicitudes
      .filter(s => s.tiempo_respuesta_minutos)
      .reduce((acc, s) => acc + s.tiempo_respuesta_minutos, 0) / 
      solicitudes.filter(s => s.tiempo_respuesta_minutos).length || 0

    return {
      data2025: data2025Data,
      data2026: data2026Data,
      topMaquinas: topAcciones,
      stats: {
        total: solicitudes.length,
        pendientes,
        tiempoPromedio: Math.round(tiempoPromedio)
      }
    }
  }, [solicitudes])

  const createChartData = (monthlyCounts) => ({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      label: 'Solicitudes',
      data: monthlyCounts,
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderColor: '#f97316',
      borderWidth: 2,
      borderRadius: 8
    }]
  })

  if (loading) return <LoadingSpinner />

  return (
    <div className="analytics-container fade-in-up">
      {/* Stats */}
      <div className="stats-grid">
        <StatCard 
          title="Total Solicitudes"
          value={stats.total}
          subtitle="Histórico"
          icon={Wrench}
          color="#f97316"
        />
        <StatCard 
          title="Pendientes"
          value={stats.pendientes}
          subtitle="Sin respuesta"
          icon={Clock}
          color="#ef4444"
        />
        <StatCard 
          title="Tiempo Promedio"
          value={`${stats.tiempoPromedio} min`}
          subtitle="Respuesta"
          icon={CheckCircle}
          color="#10b981"
        />
      </div>

      {/* Gráficas lado a lado */}
      <div className="charts-row">
        <ChartCard 
          title="SOLICITUDES 2025 - REGISTROS POR MES"
          data={createChartData(data2025)}
          type="bar"
          height={350}
        />
        <ChartCard 
          title="SOLICITUDES 2026 - REGISTROS POR MES"
          data={createChartData(data2026)}
          type="bar"
          height={350}
        />
      </div>

      {/* Top acciones más frecuentes */}
      <div className="chart-with-sidebar">
        <ChartCard 
          title="TOP 5 ACCIONES MÁS FRECUENTES 2026"
          data={{
            labels: stats.topMaquinas?.map(m => m.nombre) || [],
            datasets: [{
              label: 'Frecuencia',
              data: stats.topMaquinas?.map(m => m.count) || [],
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: '#ef4444',
              borderWidth: 2,
              borderRadius: 8
            }]
          }}
          type="bar"
          height={350}
        />
        <TopList 
          title="ACCIONES FRECUENTES"
          data={stats.topMaquinas || []}
          valueLabel="solicitudes"
          maxHeight={350}
        />
      </div>
    </div>
  )
}

export default Mantenimientos