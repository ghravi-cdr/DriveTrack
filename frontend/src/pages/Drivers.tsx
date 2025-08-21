import { useEffect, useState } from 'react'
import { DriversAPI } from '../api'
import DriverFormModal from '../components/DriverFormModal'
import Pagination from '../components/Pagination'

export default function Drivers(){
  const [data, setData] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState({ search:'', Status:'', Specialization:'', page:1, pageSize:10, sort_by:'CreatedAt', sort_dir:'desc' })
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editRow, setEditRow] = useState<any|null>(null)

  async function load(){
    setLoading(true)
    const skip = (query.page-1)*query.pageSize
    const params:any = { skip, limit: query.pageSize, sort_by: query.sort_by, sort_dir: query.sort_dir }
    if(query.search) params.DriverName = query.search
    if(query.Status) params.Status = query.Status
    if(query.Specialization) params.Specialization = query.Specialization
    const res = await DriversAPI.list(params)
    setData(res.items)
    setTotal(res.total)
    setLoading(false)
  }

  useEffect(()=>{ load() }, [query.page, query.pageSize, query.sort_by, query.sort_dir, query.search, query.Status, query.Specialization])

  function toggleSort(column: string){
    const isSame = query.sort_by === column
    const dir = isSame && query.sort_dir === 'asc' ? 'desc' : 'asc'
    setQuery({ ...query, sort_by: column, sort_dir: dir, page: 1 })
  }

  function onEdit(row:any){ setEditRow(row); setModalOpen(true) }
  async function onDelete(id:string){ if(confirm('Delete driver?')){ await DriversAPI.remove(id); load() } }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <input className="input w-80" placeholder="Search…" value={query.search} onChange={e=>setQuery({...query, search:e.target.value, page:1})} />
        <select className="input w-56" value={query.Status} onChange={e=>setQuery({...query, Status:e.target.value, page:1})}>
          <option value="">Status</option>
          {['ON_DUTY','OFF_DUTY','ON_LEAVE'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input w-64" value={query.Specialization} onChange={e=>setQuery({...query, Specialization:e.target.value, page:1})}>
          <option value="">Specialization</option>
          {['HEAVY_VEHICLES','LIGHT_VEHICLES','VIP_DUTY','EMERGENCY_RESPONSE','ESCORT','OTHER'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn btn-primary ml-auto" onClick={()=>{ setEditRow(null); setModalOpen(true) }}>Add Driver</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-xs text-gray-500">
              <tr className="border-b">
                {['DriverName','LicenseNumber','LicenseExpiryDate','Address','ExperienceYears','Specialization','Status','Actions'].map(col=>{
                  const sortable = col !== 'Actions'
                  const isActive = query.sort_by === col
                  const arrow = isActive ? (query.sort_dir === 'asc' ? ' ▲' : ' ▼') : ''
                  return (
                    <th key={col} className="text-left px-4 py-3">
                      {sortable ? (
                        <button className="hover:underline" onClick={()=>toggleSort(col)}>{col}{arrow}</button>
                      ) : (
                        col
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {data.map(row=>(
                <tr key={row._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{row.DriverName}</td>
                  <td className="px-4 py-3">{row.LicenseNumber}</td>
                  <td className="px-4 py-3">{(row.LicenseExpiryDate||'').slice(0,10)}</td>
                  <td className="px-4 py-3">{row.Address}</td>
                  <td className="px-4 py-3">{row.ExperienceYears}</td>
                  <td className="px-4 py-3">{row.Specialization}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${row.Status==='ON_DUTY'?'bg-emerald-50 text-emerald-700 border border-emerald-400':'bg-gray-100 text-gray-700 border border-gray-300'}`}>{row.Status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="btn btn-ghost" onClick={()=>onEdit(row)}>Update</button>
                      <button className="btn btn-ghost text-red-600" onClick={()=>onDelete(row._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && data.length===0 && (
                <tr><td className="px-4 py-10 text-center text-gray-500" colSpan={8}>No drivers</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">Total: {total}</div>
          <Pagination page={query.page} pageSize={query.pageSize} total={total} onChange={(p)=>setQuery({...query, page:p})} />
        </div>
      </div>

      <DriverFormModal open={modalOpen} onClose={()=>setModalOpen(false)} initial={editRow as any} onSaved={load} />
    </div>
  )
}