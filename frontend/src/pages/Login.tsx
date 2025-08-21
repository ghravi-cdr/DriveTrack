import { useState } from 'react'
import { Auth } from '../auth'
import { AuthAPI } from '../api'

export default function Login({ onLoggedIn }:{ onLoggedIn: ()=>void }){
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [name, setName] = useState('Admin')
  const [error, setError] = useState<string | null>(null)

  async function submit(e:any){
    e.preventDefault()
    try {
      if(mode==='register'){
        await AuthAPI.register(email, password, name)
      }
      const res = await AuthAPI.login(email, password)
      Auth.set(res.access_token, res.user)
      onLoggedIn()
    } catch (err:any) {
      let msg = 'Something went wrong'
      try {
        const parsed = JSON.parse(err.message)
        if(parsed?.detail) msg = typeof parsed.detail === 'string' ? parsed.detail : (parsed.detail[0]?.msg || msg)
      } catch {}
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={submit} className="card p-8 w-[420px] space-y-4">
        <div className="text-2xl font-extrabold text-center">Sign {mode==='login'?'in':'up'}</div>
        {error && <div className="p-2 text-sm bg-red-50 text-red-700 rounded-lg">{error}</div>}
        {mode==='register' && (
          <div>
            <div className="text-xs font-bold text-gray-500">Full name</div>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} />
          </div>
        )}
        <div>
          <div className="text-xs font-bold text-gray-500">Email</div>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <div className="text-xs font-bold text-gray-500">Password</div>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-full" type="submit">{mode==='login'?'Sign in':'Create account'}</button>
        <button type="button" className="w-full text-sm text-blue-600" onClick={()=>setMode(mode==='login'?'register':'login')}>
          {mode==='login'?'No account? Sign up':'Have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}