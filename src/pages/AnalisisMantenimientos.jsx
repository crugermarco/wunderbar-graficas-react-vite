import React, { useMemo } from 'react'
import { useDashboard } from '../context/DashboardContext'
import ChartCard from '../components/ChartCard'
import TopList from '../components/TopList'
import Tabs from '../components/Tabs'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Wrench, Clock, UserCheck } from 'lucide-react'

const AnalisisMantenimientos = () => {
  const { solicitudes, loading } = useDashboard()

  const analytics = useMemo(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    // Top máquinas del mes
    const maquinasMes = {}
    // Top máquinas del año
    const maquinasAnio = {}
    // Top usuarios
    const usuarios = {}
    
    let tiempoPromedio = 0
    let totalConRespuesta = 0

    solicitudes.forEach(row => {
      if (!row.fecha_solicitud) return
      
      const date = new Date(row.fecha_solicitud)
      const year = date.getFullYear()
      const month = date.getMonth()
      
      // Contar por máquina (usando accion_realizada como proxy)
      const maquina = row.accion_realizada || 'No especificada'
      
      if (year === currentYear && month === currentMonth) {
        maquinasMes[maquina] = (maquinasMes[maquina] || 0) + 1
      }
      
      if (year === currentYear) {
        maquinasAnio[maquina] = (maquinasAnio[maquina] || 0) + 1
      }
      
      // Contar por usuario
      if (row.aceptado_por) {
        usuarios[row.aceptado_por] = (usuarios[row.aceptado_por] || 0) + 1
      }
      
      // Calcular tiempo promedio de respuesta
      if (row.tiempo_respuesta_minutos) {
        tiempoPromedio += row.tiempo_respuesta_minutos
        totalConRespuesta++
      }
    })

    const formatData = (obj, limit) => {
      return Object.entries(obj)
        .map(([nombre, count]) => ({ nombre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    }

    return {
      topMaquinasMes: formatData(maquinasMes, 5),
      topMaquinasAnio: formatData(maquinasAnio, 10),
      topUsuarios: formatData(usuarios, 5),
      tiempoPromedio: totalConRespuesta > 0 ? Math.round(tiempoPromedio / totalConRespuesta) : 0,
      totalSolicitudes: solicitudes.length,
      solicitudesPendientes: solicitudes.filter(s => !s.fecha_respuesta).length
    }
  }, [solicitudes])

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
          title="Total Solicitudes"
          value={analytics.totalSolicitudes}
          subtitle="Todos los tiempos"
          icon={Wrench}
          color="#f97316"
        />
        <StatCard 
          title="Tiempo Promedio"
          value={`${analytics.tiempoPromedio} min`}
          subtitle="Respuesta"
          icon={Clock}
          color="#3b82f6"
        />
        <StatCard 
          title="Pendientes"
          value={analytics.solicitudesPendientes}
          subtitle="Sin respuesta"
          icon={UserCheck}
          color="#ef4444"
        />
      </div>

      <Tabs 
        tabs={[
          { label: 'TOP 5 ACCIONES MES' },
          { label: 'TOP 10 ACCIONES AÑO' },
          { label: 'TOP USUARIOS' }
        ]}
      >
        <div className="charts-grid">
          <ChartCard 
            title="ACCIONES MÁS FRECUENTES ESTE MES"
            data={createChartData(analytics.topMaquinasMes, 'Frecuencia', '#ef4444')}
            type="bar"
          />
          <TopList 
            title="LISTADO DETALLADO"
            data={analytics.topMaquinasMes}
            valueLabel="solicitudes"
          />
        </div>

        <div className="charts-grid">
          <ChartCard 
            title="ACCIONES MÁS FRECUENTES ESTE AÑO"
            data={createChartData(analytics.topMaquinasAnio, 'Frecuencia', '#ef4444')}
            type="bar"
          />
          <TopList 
            title="LISTADO DETALLADO"
            data={analytics.topMaquinasAnio}
            valueLabel="solicitudes"
          />
        </div>

        <div className="charts-grid">
          <ChartCard 
            title="USUARIOS QUE MÁS SOLICITUDES ATIENDEN"
            data={createChartData(analytics.topUsuarios, 'Solicitudes', '#8b5cf6')}
            type="bar"
          />
          <TopList 
            title="TOP USUARIOS"
            data={analytics.topUsuarios}
            valueLabel="solicitudes"
          />
        </div>
      </Tabs>
    </div>
  )
}

export default AnalisisMantenimientos