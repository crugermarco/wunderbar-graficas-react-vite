import React, { useMemo, useState } from 'react'
import { useDashboard } from '../context/DashboardContext'
import ChartCard from '../components/ChartCard'
import TopList from '../components/TopList'
import Tabs from '../components/Tabs'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import GlassCard from '../components/GlassCard'
import { TrendingUp, Users, Building2, UserCheck, Calendar } from 'lucide-react'

const AnalisisRotaciones = () => {
  const { rotaciones, loading } = useDashboard()
  const [selectedLider, setSelectedLider] = useState(null)

  const analytics = useMemo(() => {
    const getTopPersonal = (year, limit = 5) => {
      const yearData = rotaciones.filter(row => {
        if (!row.fecha_hora) return false
        return new Date(row.fecha_hora).getFullYear() === year
      })
      
      const personalCount = {}
      yearData.forEach(row => {
        if (row.nombre_empleado) {
          personalCount[row.nombre_empleado] = (personalCount[row.nombre_empleado] || 0) + 1
        }
      })
      
      return Object.entries(personalCount)
        .map(([nombre, count]) => ({ nombre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    }

    const getTopOperaciones = (year, limit = 5) => {
    const yearData = rotaciones.filter(row => {
      if (!row.fecha_hora) return false
      return new Date(row.fecha_hora).getFullYear() === year
    })
    
    const operacionCount = {}
    yearData.forEach(row => {
      if (row.operacion) {
        // EXCLUIR "servicio" (en mayúsculas o minúsculas)
        const operacion = row.operacion.toLowerCase().trim()
        if (operacion !== 'servicio') {
          operacionCount[row.operacion] = (operacionCount[row.operacion] || 0) + 1
        }
      }
    })
    
    return Object.entries(operacionCount)
      .map(([area, count]) => ({ nombre: area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

    // CORREGIDO: Usar 'lider' en lugar de 'lide'
    const getLideresMensuales = (year) => {
      const yearData = rotaciones.filter(row => {
        if (!row.fecha_hora) return false
        return new Date(row.fecha_hora).getFullYear() === year
      })
      
      const lideresData = {}
      
      yearData.forEach(row => {
        if (!row.lider) return  // ← CORREGIDO: 'lider' no 'lide'
        
        const lider = row.lider  // ← CORREGIDO
        const date = new Date(row.fecha_hora)
        const month = date.getMonth()
        
        if (!lideresData[lider]) {
          lideresData[lider] = {
            nombre: lider,
            total: 0,
            mensual: Array(12).fill(0)
          }
        }
        
        lideresData[lider].total++
        lideresData[lider].mensual[month]++
      })
      
      return Object.values(lideresData)
        .sort((a, b) => b.total - a.total)
    }

    const topLideres = getLideresMensuales(2026).slice(0, 5)
    const todosLideres = getLideresMensuales(2026)
    
    const totalRotaciones = rotaciones.length
    const rotaciones2026 = rotaciones.filter(r => 
      r.fecha_hora && new Date(r.fecha_hora).getFullYear() === 2026
    ).length
    const promedioMensual = Math.round(rotaciones2026 / 12)
    const topLider = todosLideres[0]

    return {
      top2025: getTopPersonal(2025),
      top2026: getTopPersonal(2026),
      topOperaciones: getTopOperaciones(2026),
      topLideres,
      todosLideres,
      totalRotaciones,
      rotaciones2026,
      promedioMensual,
      topLider
    }
  }, [rotaciones])

  const getLiderChartData = (liderNombre) => {
    const lider = analytics.todosLideres.find(l => l.nombre === liderNombre)
    if (!lider) return null
    
    return {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [{
        label: `Rotaciones de ${liderNombre}`,
        data: lider.mensual,
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderRadius: 8
      }]
    }
  }

  const createBarChartData = (data, label, color = '#3b82f6') => ({
    labels: data.map(item => item.nombre),
    datasets: [{
      label: label,
      data: data.map(item => item.count),
      backgroundColor: color.replace(')', ', 0.7)').replace('rgb', 'rgba'),
      borderColor: color,
      borderWidth: 2,
      borderRadius: 8
    }]
  })

  const createPieChartData = (data) => ({
    labels: data.map(item => item.nombre),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: [
        'rgba(139, 92, 246, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderWidth: 2
    }]
  })

  const getLideresComparativaData = () => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444']
    
    return {
      labels: meses,
      datasets: analytics.topLideres.map((lider, index) => ({
        label: lider.nombre,
        data: lider.mensual,
        backgroundColor: colors[index].replace(')', ', 0.6)').replace('rgb', 'rgba'),
        borderColor: colors[index],
        borderWidth: 1,
        borderRadius: 6
      }))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="fade-in-up" style={{ width: '100%', maxWidth: '100%' }}>
      <div className="stats-grid">
        <StatCard 
          title="Total Rotaciones"
          value={analytics.totalRotaciones}
          subtitle="Histórico completo"
          icon={TrendingUp}
          color="#3b82f6"
        />
        <StatCard 
          title="Rotaciones 2026"
          value={analytics.rotaciones2026}
          subtitle="Año actual"
          icon={Users}
          color="#10b981"
        />
        <StatCard 
          title="Promedio Mensual"
          value={analytics.promedioMensual}
          subtitle="Rotaciones/mes"
          icon={Building2}
          color="#8b5cf6"
        />
        {analytics.topLider && (
          <StatCard 
            title="Líder más activo"
            value={analytics.topLider.nombre}
            subtitle={`${analytics.topLider.total} rotaciones`}
            icon={UserCheck}
            color="#f59e0b"
          />
        )}
      </div>

      <Tabs 
        tabs={[
          { label: 'TOP PERSONAL 2025', icon: Users },
          { label: 'TOP PERSONAL 2026', icon: Users },
          { label: 'TOP OPERACIONES', icon: Building2 },
          { label: 'ANÁLISIS DE LÍDERES', icon: UserCheck }
        ]}
      >
        {/* Tab 1: Top Personal 2025 */}
        <div className="charts-grid-full">
          <ChartCard 
            title="TOP 5 PERSONAL CON MÁS ROTACIONES 2025"
            subtitle="Personal más rotado"
            data={createBarChartData(analytics.top2025, 'Rotaciones', '#3b82f6')}
            type="bar"
            height={400}
          />
          <TopList 
            title="LISTADO DETALLADO 2025"
            data={analytics.top2025}
            valueLabel="rotaciones"
            maxHeight={400}
          />
        </div>

        {/* Tab 2: Top Personal 2026 */}
        <div className="charts-grid-full">
          <ChartCard 
            title="TOP 5 PERSONAL CON MÁS ROTACIONES 2026"
            subtitle="Personal más rotado año actual"
            data={createBarChartData(analytics.top2026, 'Rotaciones', '#10b981')}
            type="bar"
            height={400}
          />
          <TopList 
            title="LISTADO DETALLADO 2026"
            data={analytics.top2026}
            valueLabel="rotaciones"
            maxHeight={400}
          />
        </div>

        {/* Tab 3: Top Operaciones */}
        <div className="charts-grid-full">
          <ChartCard 
            title="DISTRIBUCIÓN DE ROTACIONES POR OPERACIÓN"
            subtitle="Operaciones más frecuentes"
            data={createPieChartData(analytics.topOperaciones)}
            type="pie"
            height={400}
          />
          <TopList 
            title="LISTADO DETALLADO POR OPERACIÓN"
            data={analytics.topOperaciones}
            valueLabel="rotaciones"
            maxHeight={400}
          />
        </div>

        {/* Tab 4: Análisis de Líderes */}
        <div className="full-width-container">
          <ChartCard 
            title="COMPARATIVA DE LÍDERES POR MES - 2026"
            subtitle="Rotaciones registradas por cada líder mensualmente"
            data={getLideresComparativaData()}
            type="bar"
            height={450}
          />
          
          <div className="charts-grid-full" style={{ marginTop: '1.5rem' }}>
            <TopList 
              title="TOP 5 LÍDERES CON MÁS ROTACIONES 2026"
              data={analytics.topLideres.map(l => ({ 
                nombre: l.nombre, 
                count: l.total 
              }))}
              valueLabel="rotaciones totales"
              maxHeight={350}
            />
            
            <GlassCard shimmer style={{ padding: '1.5rem' }}>
              <h3 style={{ 
                color: '#fff', 
                marginBottom: '1.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '1.1rem'
              }}>
                <Calendar size={20} color="#f59e0b" />
                DETALLE MENSUAL POR LÍDER
              </h3>
              
              <select 
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem',
                  cursor: 'pointer'
                }}
                onChange={(e) => setSelectedLider(e.target.value)}
                value={selectedLider || ''}
              >
                <option value="">Selecciona un líder para ver su detalle mensual</option>
                {analytics.todosLideres.map(lider => (
                  <option key={lider.nombre} value={lider.nombre}>
                    {lider.nombre} ({lider.total} rotaciones)
                  </option>
                ))}
              </select>
              
              {selectedLider && (
                <>
                  <ChartCard 
                    title={`ROTACIONES MENSUALES - ${selectedLider}`}
                    subtitle="Distribución por mes en 2026"
                    data={getLiderChartData(selectedLider)}
                    type="bar"
                    height={300}
                  />
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <StatCard 
                      title="Total anual"
                      value={analytics.todosLideres.find(l => l.nombre === selectedLider)?.total || 0}
                      subtitle="Rotaciones en 2026"
                      icon={UserCheck}
                      color="#f59e0b"
                    />
                    <StatCard 
                      title="Mes pico"
                      value={(() => {
                        const lider = analytics.todosLideres.find(l => l.nombre === selectedLider)
                        if (!lider) return '-'
                        const maxValue = Math.max(...lider.mensual)
                        const mesIndex = lider.mensual.indexOf(maxValue)
                        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                                     'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                        return meses[mesIndex]
                      })()}
                      subtitle={(() => {
                        const lider = analytics.todosLideres.find(l => l.nombre === selectedLider)
                        if (!lider) return '-'
                        const maxValue = Math.max(...lider.mensual)
                        return `${maxValue} rotaciones`
                      })()}
                      icon={Calendar}
                      color="#3b82f6"
                    />
                  </div>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

export default AnalisisRotaciones