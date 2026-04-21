import React from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import GlassCard from './GlassCard'
import './ChartCard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const ChartCard = ({ title, data, type = 'bar', height = 350, subtitle }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1',
          font: { 
            size: 11,
            family: 'Inter, sans-serif',
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#10b981',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ''
            let value = context.parsed.y || context.parsed
            return `${label}: ${value.toLocaleString()}`
          }
        }
      }
    },
    scales: type === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: { 
          color: '#cbd5e1',
          callback: (value) => value.toLocaleString()
        },
        grid: { 
          color: 'rgba(71, 85, 105, 0.2)',
          lineWidth: 1
        }
      },
      x: {
        ticks: { 
          color: '#cbd5e1', 
          font: { size: 11, weight: '500' },
          maxRotation: 45,
          minRotation: 45
        },
        grid: { 
          display: false
        }
      }
    } : undefined,
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  }

  // Aplicar gradientes a los datasets
  const enhancedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      borderRadius: 8,
      barPercentage: 0.7,
      categoryPercentage: 0.8
    }))
  }

  return (
    <GlassCard shimmer className="chart-card-wrapper">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      </div>
      <div className="chart-container" style={{ height: `${height}px` }}>
        {type === 'bar' && <Bar data={enhancedData} options={chartOptions} />}
        {type === 'pie' && <Pie data={enhancedData} options={chartOptions} />}
      </div>
    </GlassCard>
  )
}

export default ChartCard