import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'
import { TrendingUp, Target, AlertCircle } from 'lucide-react'

const Rotaciones = () => {
  const { rotaciones, loading } = useDashboard()

  const META_MENSUAL = 6500
  const META_ANUAL = META_MENSUAL * 12

  const { data2025, data2026, stats } = useMemo(() => {
    const processYear = (year) => {
      const yearData = rotaciones.filter(row => {
        if (!row.fecha_hora) return false
        const date = new Date(row.fecha_hora)
        return date.getFullYear() === year
      })
      
      const monthlyCounts = Array(12).fill(0)
      yearData.forEach(row => {
        const date = new Date(row.fecha_hora)
        const month = date.getMonth()
        monthlyCounts[month]++
      })
      
      return monthlyCounts
    }

    const data2025Data = processYear(2025)
    const data2026Data = processYear(2026)
    
    const total2025 = data2025Data.reduce((a, b) => a + b, 0)
    const total2026 = data2026Data.reduce((a, b) => a + b, 0)
    
    return {
      data2025: data2025Data,
      data2026: data2026Data,
      stats: {
        total2025,
        total2026,
        metaMensual: META_MENSUAL,
        metaAnual: META_ANUAL,
        faltante2026: Math.max(0, META_ANUAL - total2026)
      }
    }
  }, [rotaciones])

  const createChartData = (monthlyCounts) => {
    const registros = monthlyCounts
    const faltantes = registros.map(count => Math.max(0, META_MENSUAL - count))
    
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: `Meta (${META_MENSUAL.toLocaleString()})`,
          data: Array(12).fill(META_MENSUAL),
          backgroundColor: 'rgba(59, 130, 246, 0.4)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderDash: [5, 5]
        },
        {
          label: 'Registros',
          data: registros,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 8
        },
        {
          label: 'Faltantes',
          data: faltantes,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="analytics-container fade-in-up">
      <div className="stats-grid">
        <StatCard 
          title="Total 2025"
          value={stats.total2025.toLocaleString()}
          subtitle="Rotaciones"
          icon={TrendingUp}
          color="#3b82f6"
        />
        <StatCard 
          title="Total 2026"
          value={stats.total2026.toLocaleString()}
          subtitle="Rotaciones"
          icon={TrendingUp}
          color="#10b981"
        />
        <StatCard 
          title="Meta mensual"
          value={stats.metaMensual.toLocaleString()}
          subtitle="Por mes"
          icon={Target}
          color="#8b5cf6"
        />
        <StatCard 
          title="Meta anual"
          value={stats.metaAnual.toLocaleString()}
          subtitle="Objetivo 2026"
          icon={Target}
          color="#f59e0b"
        />
        <StatCard 
          title="Faltante anual"
          value={stats.faltante2026.toLocaleString()}
          subtitle="Para llegar a la meta"
          icon={AlertCircle}
          color={stats.faltante2026 > 0 ? '#ef4444' : '#10b981'}
        />
      </div>

      <div className="charts-row">
        <ChartCard 
          title="ROTACIONES 2025 - REGISTROS POR MES"
          data={createChartData(data2025)}
          type="bar"
          height={380}
        />
        <ChartCard 
          title="ROTACIONES 2026 - REGISTROS POR MES"
          subtitle="Año actual"
          data={createChartData(data2026)}
          type="bar"
          height={380}
        />
      </div>
    </div>
  )
}

export default Rotaciones