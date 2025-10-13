import { useState } from 'react'
import { useRouter } from 'next/router'
import { login, getCurrentUser } from '../lib/api'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await login({ email, password })
      
      if (res && (res.message === 'Logged in successfully' || res.success)) {
        // Get user info to redirect to appropriate dashboard
        const userInfo = await getCurrentUser()
        if (userInfo && userInfo.Role === 'Coach') {
          router.push('/coach/dashboard')
        } else if (userInfo && userInfo.Role === 'Player') {
          router.push('/player/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  return (
    <main className="container">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} className="mt-4 max-w-md">
        <label className="block">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 rounded bg-slate-800" />
        <label className="block mt-3">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 rounded bg-slate-800" />
        <button type="submit" className="mt-4 bg-cyan-400 text-slate-900 px-3 py-1 rounded">Log in</button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
      
      <div className="mt-6">
        <p>Don't have an account? <a href="/register" className="text-cyan-400 hover:underline">Create one</a></p>
      </div>
    </main>
  )
}
