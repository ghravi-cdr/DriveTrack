import { useState, useEffect } from 'react'
import { DriversAPI } from '../api'

export default function DriverFormModal({ open, onClose, initial, onSaved }:{ open:boolean; onClose:()=>void; initial?:any; onSaved:()=>void }){
  const [form, setForm] = useState<any>({
    DriverName:'',
    LicenseNumber:'',
    LicenseExpiryDate:'',
    ContactNumber:'',
    Address:'',
    ExperienceYears:0,
    Specialization:'OTHER',
    Status:'OFF_DUTY',
    Remarks:''
  })
  const editing = !!initial?._id

  useEffect(()=>{
    if(initial){
      setForm({
        DriverName: initial.DriverName || '',
        LicenseNumber: initial.LicenseNumber || '',
        LicenseExpiryDate: (initial.LicenseExpiryDate || '').slice(0,10),
        ContactNumber: initial.ContactNumber || '',
        Address: initial.Address || '',
        ExperienceYears: initial.ExperienceYears ?? 0,
        Specialization: initial.Specialization || 'OTHER',
        Status: initial.Status || 'OFF_DUTY',
        Remarks: initial.Remarks || ''
      })
    } else {
      setForm({
        DriverName:'',
        LicenseNumber:'',
        LicenseExpiryDate:'',
        ContactNumber:'',
        Address:'',
        ExperienceYears:0,
        Specialization:'OTHER',
        Status:'OFF_DUTY',
        Remarks:''
      })
    }
  }, [initial, open])

  if(!open) return null

  async function save(){
    const payload = { ...form, ExperienceYears: Number(form.ExperienceYears||0) }
    if(editing) await DriversAPI.update(initial._id, payload)
    else await DriversAPI.create(payload)
    onSaved()
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] card p-6 space-y-4">
        <div className="text-lg font-extrabold">{editing?'Update Driver':'Add Driver'}</div>
        <div className="grid grid-cols-2 gap-4">
          {['DriverName','LicenseNumber','LicenseExpiryDate','ContactNumber','Address','ExperienceYears','Remarks'].map(key=>(
            <div key={key}>
              <div className="text-xs text-gray-500 font-bold">{key}</div>
              <input className="input" type={key==='LicenseExpiryDate'?'date':'text'} value={(form as any)[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})} />
            </div>
          ))}
          <div>
            <div className="text-xs text-gray-500 font-bold">Specialization</div>
            <select className="input" value={form.Specialization} onChange={e=>setForm({...form, Specialization:e.target.value})}>
              {['HEAVY_VEHICLES','LIGHT_VEHICLES','VIP_DUTY','EMERGENCY_RESPONSE','ESCORT','OTHER'].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold">Status</div>
            <select className="input" value={form.Status} onChange={e=>setForm({...form, Status:e.target.value})}>
              {['ON_DUTY','OFF_DUTY','ON_LEAVE'].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>{editing?'Update':'Create'}</button>
        </div>
      </div>
    </div>
  )
}