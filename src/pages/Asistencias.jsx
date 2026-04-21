import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import ChartCard from '../components/ChartCard'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'
import { Calendar, AlertCircle, Clock } from 'lucide-react'

const Asistencias = () => {
  const { asistencias, loading } = useDashboard()

  const { data2025, data2026, stats } = useMemo(() => {
    const processYear = (year) => {
      const motivos = {
        'FALTA INJUSTIFICADA': Array(12).fill(0),
        'PERMISO - POR DÍA': Array(12).fill(0),
        'INCAPACIDAD': Array(12).fill(0),
        'SUSPENSION': Array(12).fill(0),
        'ERROR DE PROCESO': Array(12).fill(0),
        '5HRS': Array(12).fill(0),
        'NO SE ESCANEA O NO CUENTA CON GAFETE': Array(12).fill(0),
        'RETARDO': Array(12).fill(0),
        'PERMISO - POR HORA': Array(12).fill(0)
      }
      
      let totalFaltas = 0
      let totalPermisos = 0
      let totalIncapacidades = 0
      let totalSuspensiones = 0
      let totalRetardos = 0
      
      asistencias.forEach(row => {
        if (!row.FECHA) return
        const date = new Date(row.FECHA)
        if (date.getFullYear() !== year) return
        
        const month = date.getMonth()
        const motivo = (row.MOTIVO || '').toString().toUpperCase().trim()
        
        Object.keys(motivos).forEach(key => {
          if (motivo.includes(key)) {
            motivos[key][month]++
          }
        })
        
        if (motivo.includes('FALTA INJUSTIFICADA')) totalFaltas++
        if (motivo.includes('PERMISO')) totalPermisos++
        if (motivo.includes('INCAPACIDAD')) totalIncapacidades++
        if (motivo.includes('SUSPENSION')) totalSuspensiones++
        if (motivo.includes('RETARDO')) totalRetardos++
      })
      
      return { motivos, totalFaltas, totalPermisos, totalIncapacidades, totalSuspensiones, totalRetardos }
    }

    const data2025Result = processYear(2025)
    const data2026Result = processYear(2026)

    return {
      data2025: data2025Result.motivos,
      data2026: data2026Result.motivos,
      stats: {
        total2025: asistencias.filter(r => r.FECHA && new Date(r.FECHA).getFullYear() === 2025).length,
        total2026: asistencias.filter(r => r.FECHA && new Date(r.FECHA).getFullYear() === 2026).length,
        faltas2026: data2026Result.totalFaltas,
        permisos2026: data2026Result.totalPermisos,
        incapacidades2026: data2026Result.totalIncapacidades,
        suspensiones2026: data2026Result.totalSuspensiones,
        retardos2026: data2026Result.totalRetardos
      }
    }
  }, [asistencias])

  const createChartData = (motivos) => {
    const colors = [
      'rgba(239, 68, 68, 0.7)',
      'rgba(59, 130, 246, 0.7)',
      'rgba(139, 92, 246, 0.7)',
      'rgba(107, 114, 128, 0.7)',
      'rgba(249, 115, 22, 0.7)',
      'rgba(234, 179, 8, 0.7)',
      'rgba(16, 185, 129, 0.7)',
      'rgba(236, 72, 153, 0.7)',
      'rgba(6, 182, 212, 0.7)'
    ]
    
    const datasets = Object.entries(motivos)
      .filter(([_, data]) => data.some(v => v > 0))
      .map(([motivo, data], index) => ({
        label: motivo,
        data: data,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.7', '1'),
        borderWidth: 1,
        borderRadius: 6
      }))

    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="analytics-container fade-in-up">
      <div className="stats-grid">
        <StatCard 
          title="Total 2025"
          value={stats.total2025.toLocaleString()}
          subtitle="Registros"
          icon={Calendar}
          color="#3b82f6"
        />
        <StatCard 
          title="Total 2026"
          value={stats.total2026.toLocaleString()}
          subtitle="Registros"
          icon={Calendar}
          color="#10b981"
        />
        <StatCard 
          title="Faltas 2026"
          value={stats.faltas2026.toLocaleString()}
          subtitle="Injustificadas"
          icon={AlertCircle}
          color="#ef4444"
        />
        <StatCard 
          title="Permisos 2026"
          value={stats.permisos2026.toLocaleString()}
          subtitle="Total"
          icon={Clock}
          color="#f59e0b"
        />
        <StatCard 
          title="Incapacidades 2026"
          value={stats.incapacidades2026.toLocaleString()}
          subtitle="Total"
          icon={AlertCircle}
          color="#8b5cf6"
        />
        <StatCard 
          title="Suspensiones 2026"
          value={stats.suspensiones2026.toLocaleString()}
          subtitle="Total"
          icon={AlertCircle}
          color="#6b7280"
        />
        <StatCard 
          title="Retardos 2026"
          value={stats.retardos2026.toLocaleString()}
          subtitle="Total"
          icon={Clock}
          color="#ea580c"
        />
      </div>

      <div className="charts-row">
        <ChartCard 
          title="ASISTENCIAS 2025 - POR MOTIVO"
          data={createChartData(data2025)}
          type="bar"
          height={400}
        />
        <ChartCard 
          title="ASISTENCIAS 2026 - POR MOTIVO"
          data={createChartData(data2026)}
          type="bar"
          height={400}
        />
      </div>
    </div>
  )
}

export default Asistencias