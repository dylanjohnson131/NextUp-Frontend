import Link from 'next/link'
import { useRouter } from 'next/router'

export default function NavBar() {
  const router = useRouter()

  const active = (path) => router.pathname === path ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className={`font-bold text-xl ${router.pathname === '/' ? 'underline' : ''}`}>NextUp</Link>
        <Link href="/dashboard" className={active('/dashboard')}>Dashboard</Link>
        <Link href="/players" className={active('/players')}>Players</Link>
      </div>
      <div>
        <Link href="/login" className="bg-cyan-400 text-slate-900 px-3 py-1 rounded">Log in</Link>
      </div>
    </nav>
  )
}
