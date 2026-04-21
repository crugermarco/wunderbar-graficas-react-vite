import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import ChartCard from '../components/ChartCard'
import TopList from '../components/TopList'
import Tabs from '../components/Tabs'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { AlertCircle, Calendar, Clock } from 'lucide-react'

const AnalisisAsistencias = () => {
  const { asistencias, loading } = useDashboard()

  const analytics = useMemo(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const faltasMes = {}
    const faltasAnio = {}
    const permisosDia = {}
    const permisosHora = {}
    
    let totalFaltas = 0
    let totalPermisos = 0

    asistencias.forEach(row => {
      if (!row.FECHA) return
      
      const date = new Date(row.FECHA)
      const year = date.getFullYear()
      const month = date.getMonth()
      const motivo = (row.MOTIVO || '').toUpperCase()
      const nombre = row.NOMBRE || 'Sin nombre'

      if (motivo.includes('FALTA INJUSTIFICADA')) {
        totalFaltas++
        if (year === currentYear && month === currentMonth) {
          faltasMes[nombre] = (faltasMes[nombre] || 0) + 1
        }
        if (year === currentYear) {
          faltasAnio[nombre] = (faltasAnio[nombre] || 0) + 1
        }
      }

      if (motivo.includes('PERMISO')) {
        totalPermisos++
        if (motivo.includes('DÍA')) {
          permisosDia[nombre] = (permisosDia[nombre] || 0) + 1
        } else if (motivo.includes('HORA')) {
          permisosHora[nombre] = (permisosHora[nombre] || 0) + 1
        }
      }
    })

    const formatData = (obj, limit) => {
      return Object.entries(obj)
        .map(([nombre, count]) => ({ nombre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    }

    return {
      topFaltasMes: formatData(faltasMes, 10),
      topFaltasAnio: formatData(faltasAnio, 10),
      topPermisosDia: formatData(permisosDia, 10),
      topPermisosHora: formatData(permisosHora, 10),
      totalFaltas,
      totalPermisos,
      totalAsistencias: asistencias.length
    }
  }, [asistencias])

  const createChartData = (data, label, color = '#ef4444') => ({
    labels: data.map(item => item.nombre),
    datasets: [{
      label: label,
      data: data.map(item => item.count),
      backgroundColor: color.replace(')', ', 0.7)').replace('rgb', 'rgba'),
      borderColor: color,
      borderWidth: 1
    }]
  })

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up">
      <div className="stats-grid">
        <StatCard 
          title="Total Registros"
          value={analytics.totalAsistencias}
          subtitle="Asistencias"
          icon={Calendar}
          color="#3b82f6"
        />
        <StatCard 
          title="Faltas Injustificadas"
          value={analytics.totalFaltas}
          subtitle="Total"
          icon={AlertCircle}
          color="#ef4444"
        />
        <StatCard 
          title="Permisos"
          value={analytics.totalPermisos}
          subtitle="Total"
          icon={Clock}
          color="#f59e0b"
        />
      </div>

      <Tabs 
        tabs={[
          { label: 'FALTAS MES' },
          { label: 'FALTAS AÑO' },
          { label: 'PERMISOS DÍA' },
          { label: 'PERMISOS HORA' }
        ]}
      >
        <div className="charts-grid">
          <ChartCard 
            title="TOP 10 FALTAS INJUSTIFICADAS ESTE MES"
            data={createChartData(analytics.topFaltasMes, 'Faltas', '#ef4444')}
            type="bar"
          />
          <TopList 
            title="LISTADO DETALLADO"
            data={analytics.topFaltasMes}
            valueLabel="faltas"
          />
        </div>

        <div className="charts-grid">
          <ChartCard 
            title="TOP 10 FALTAS INJUSTIFICADAS ESTE AÑO"
            data={createChartData(analytics.topFaltasAnio, 'Faltas', '#ef4444')}
            type="bar"
          />
          <TopList 
            title="LISTADO DETALLADO"
            data={analytics.topFaltasAnio}
            valueLabel="faltas"
          />
        </div>

        <div className="charts-grid">
          <ChartCard 
            title="TOP 10 PERMISOS POR DÍA"
            data={createChartData(analytics.topPermisosDia, 'Permisos', '#3b82f6')}
            type="bar"
          />
          <TopList 
            title="LISTADO DETALLADO"
            data={analytics.topPermisosDia}
            valueLabel="permisos"
          />
        </div>

        <div className="charts-grid">
          <ChartCard 
            title="TOP 10 PERMISOS POR HORA"
            data={createChartData(analytics.topPermisosHora, 'Permisos', '#06b6d4')}
            type="bar"
          />
          <TopList 
            title="LISTADO DETALLADO"
            data={analytics.topPermisosHora}
            valueLabel="permisos"
          />
        </div>
      </Tabs>
    </div>
  )
}

export default AnalisisAsistencias