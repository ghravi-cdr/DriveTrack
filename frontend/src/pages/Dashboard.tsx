import { useEffect, useMemo, useState } from 'react'
import KpiCard from '../components/KpiCard'
import { DriversAPI } from '../api'

export default function Dashboard(){
  const [kpis, setKpis] = useState<any>({ total:0, on_duty:0, on_leave:0, expiring:0 })
  useEffect(()=>{
    DriversAPI.list({ limit: 1 }).then(res => setKpis(res.kpis)).catch(()=>{})
  },[])
  const chartA = useMemo(()=>{
    const total = Math.max(1, Number(kpis.total||0))
    const onDuty = Number(kpis.on_duty||0)
    const offDuty = total - onDuty - Number(kpis.on_leave||0)
    return [
      { label: 'On duty', value: onDuty, color: '#10b981' },
      { label: 'On leave', value: Number(kpis.on_leave||0), color: '#f59e0b' },
      { label: 'Off duty', value: Math.max(0, offDuty), color: '#94a3b8' },
    ]
  }, [kpis])
  const chartB = useMemo(()=>{
    return [
      { label: 'Expiring in 30d', value: Number(kpis.expiring||0), color: '#ef4444' },
      { label: 'Valid', value: Math.max(0, Number(kpis.total||0) - Number(kpis.expiring||0)), color: '#22c55e' },
    ]
  }, [kpis])
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard title="Total Drivers" value={kpis.total} />
        <KpiCard title="On Duty" value={kpis.on_duty} />
        <KpiCard title="On Leave" value={kpis.on_leave} />
        <KpiCard title="Expiring Licenses" value={kpis.expiring} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4 h-80">
          <div className="text-sm font-bold text-gray-500 mb-2">Driver Status</div>
          <Donut data={chartA} />
          <Legend data={chartA} />
        </div>
        <div className="card p-4 h-80">
          <div className="text-sm font-bold text-gray-500 mb-2">License Expiry</div>
          <Donut data={chartB} />
          <Legend data={chartB} />
        </div>
      </div>
    </div>
  )
}

function Donut({ data }:{ data: { label:string; value:number; color:string }[] }){
  const total = data.reduce((s,d)=>s + (d.value||0), 0) || 1
  let cumulative = 0
  const radius = 60
  const stroke = 24
  const center = 80
  return (
    <svg width={160} height={160} viewBox={`0 0 ${center*2} ${center*2}`} className="mx-auto">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      {data.map((d, i)=>{
        const start = cumulative / total
        cumulative += d.value
        const end = cumulative / total
        const a1 = 2*Math.PI*start
        const a2 = 2*Math.PI*end
        const x1 = center + radius * Math.sin(a1)
        const y1 = center - radius * Math.cos(a1)
        const x2 = center + radius * Math.sin(a2)
        const y2 = center - radius * Math.cos(a2)
        const largeArc = end - start > 0.5 ? 1 : 0
        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
        return <path key={i} d={path} stroke={d.color} strokeWidth={stroke} fill="none" strokeLinecap="butt" />
      })}
      <circle cx={center} cy={center} r={radius - stroke/2} fill="white" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="font-extrabold text-xl">{total}</text>
    </svg>
  )
}

function Legend({ data }:{ data: { label:string; value:number; color:string }[] }){
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
      {data.map((d)=> (
        <div key={d.label} className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: d.color }}></span>
          <span className="text-gray-600">{d.label}</span>
          <span className="ml-auto font-semibold">{d.value}</span>
        </div>
      ))}
    </div>
  )
}