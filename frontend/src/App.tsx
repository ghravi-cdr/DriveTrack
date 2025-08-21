import { useState, useEffect } from 'react'
import { Auth } from './auth'
import { AuthAPI, ProfileAPI } from './api'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Drivers from './pages/Drivers'
import Logs from './pages/Logs'

type Page = 'dashboard' | 'drivers' | 'logs'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [profileOpen, setProfileOpen] = useState(false)
  const user = Auth.user()

  if (!user) return <Login onLoggedIn={() => window.location.reload()} />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f46e5"/>
                <stop offset="100%" stopColor="#06b6d4"/>
              </linearGradient>
            </defs>
            <rect x="4" y="8" width="56" height="40" rx="10" fill="url(#g)"/>
            <circle cx="20" cy="52" r="6" fill="#111827"/>
            <circle cx="48" cy="52" r="6" fill="#111827"/>
            <path d="M12 28h40" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
            <path d="M20 20h16" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <div className="font-extrabold text-xl">Drive Track</div>
        </div>
        <button onClick={() => setProfileOpen(true)} className="flex items-center gap-2">
          <ProfileAvatar />
          <div className="text-sm text-gray-600">{user.full_name || user.email}</div>
        </button>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-56 bg-gray-900 text-gray-100 pt-4">
        <div className="px-4 py-3 text-gray-300 font-bold">Fleet Admin</div>
        <nav className="mt-6 flex flex-col gap-1 px-2">
          <button className={`text-left px-3 py-2 rounded-lg ${page==='dashboard'?'bg-gray-800':''}`} onClick={()=>setPage('dashboard')}>Dashboard</button>
          <button className={`text-left px-3 py-2 rounded-lg ${page==='drivers'?'bg-gray-800':''}`} onClick={()=>setPage('drivers')}>Drivers</button>
          <button className={`text-left px-3 py-2 rounded-lg ${page==='logs'?'bg-gray-800':''}`} onClick={()=>setPage('logs')}>Logs</button>
          {/* Logout moved to Profile drawer */}
        </nav>
      </div>

      {/* Content */}
      <div className="pl-56 pt-16 p-6">
        {page==='dashboard' && <Dashboard />}
        {page==='drivers' && <Drivers />}
        {page==='logs' && <Logs />}
      </div>

      {/* Profile Drawer */}
      {profileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20" onClick={()=>setProfileOpen(false)}></div>
          <div className="absolute right-0 top-16 bottom-0 w-[420px] bg-white border-l border-gray-200 p-6 space-y-6">
            <div className="font-extrabold text-lg">Profile</div>
            <div className="flex gap-4 items-center">
              <ProfileAvatar size="lg" />
              <div>
                <div className="font-bold">{user.full_name || 'Admin'}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <div className="mt-2 inline-flex px-3 py-1 rounded-full border border-emerald-500 text-emerald-700 text-xs font-bold">Admin</div>
              </div>
            </div>
            <ProfilePicUploader />
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-500">Account</div>
              <div className="card p-3"><div className="text-xs text-gray-500">Full name</div><div className="font-semibold">{user.full_name || '—'}</div></div>
              <div className="card p-3"><div className="text-xs text-gray-500">Email</div><div className="font-semibold">{user.email}</div></div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-500">Security</div>
              <ChangePassword />
              <button onClick={()=>{Auth.clear(); location.reload()}} className="btn btn-ghost w-full justify-start text-red-600">Log out</button>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button onClick={()=>setProfileOpen(false)} className="btn btn-ghost">Close</button>
              <button onClick={()=>setProfileOpen(false)} className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ChangePassword(){
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button className="btn btn-ghost w-full justify-start" onClick={()=>setOpen(true)}>Change password</button>
      {open && <ChangePasswordModal onClose={()=>setOpen(false)} />}
    </div>
  )
}

function ChangePasswordModal({ onClose }:{ onClose: ()=>void }){
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string|undefined>()
  const [ok, setOk] = useState<string|undefined>()

  async function submit(e:any){
    e.preventDefault()
    setError(undefined); setOk(undefined)
    if(next.length < 6){ setError('New password must be at least 6 characters'); return }
    if(next !== confirm){ setError('Passwords do not match'); return }
    try {
      await AuthAPI.changePassword(current, next)
      setOk('Password changed successfully')
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err:any) {
      setError(err.message || 'Could not change password')
    }
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <form onSubmit={submit} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] card p-6 space-y-4">
        <div className="text-lg font-extrabold">Change password</div>
        {error && <div className="p-2 text-sm bg-red-50 text-red-700 rounded">{error}</div>}
        {ok && <div className="p-2 text-sm bg-emerald-50 text-emerald-700 rounded">{ok}</div>}
        <div>
          <div className="text-xs text-gray-500 font-bold">Current password</div>
          <input className="input w-full" type="password" value={current} onChange={e=>setCurrent(e.target.value)} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-bold">New password</div>
          <input className="input w-full" type="password" value={next} onChange={e=>setNext(e.target.value)} />
        </div>
        <div>
          <div className="text-xs text-gray-500 font-bold">Confirm new password</div>
          <input className="input w-full" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="submit">Update</button>
        </div>
      </form>
    </div>
  )
}

function ProfileAvatar({ size }:{ size?: 'lg' | 'sm' } = {}){
  const sz = size==='lg' ? 'w-16 h-16 rounded-2xl' : 'w-10 h-10 rounded-xl'
  const [src, setSrc] = useState<string | null>(null)
  useEffect(()=>{ const t = localStorage.getItem('token'); setSrc(`${ProfileAPI.getPictureUrl()}?token=${encodeURIComponent(t||'')}`) }, [])
  return (
    <div className={`${sz} bg-indigo-50 border border-indigo-200 overflow-hidden`}> 
      {src && <img src={src} alt="avatar" className="w-full h-full object-cover" onError={()=>setSrc(null)} />}
    </div>
  )
}

function ProfilePicUploader(){
  const [busy, setBusy] = useState(false)
  async function onPick(e:any){
    const file = e.target.files?.[0]
    if(!file) return
    setBusy(true)
    try{ await ProfileAPI.uploadPicture(file); location.reload() } finally{ setBusy(false) }
  }
  return (
    <div className="card p-3">
      <div className="text-xs text-gray-500">Profile picture</div>
      <label className="btn btn-ghost mt-2">
        {busy? 'Uploading…' : 'Upload new picture'}
        <input type="file" accept="image/*" className="hidden" onChange={onPick} />
      </label>
    </div>
  )
}