import Link from 'next/link'

export default function NavBar() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">NextUp</Link>
        <Link href="/dashboard" className="text-slate-300 hover:text-white">Dashboard</Link>
        <Link href="/players" className="text-slate-300 hover:text-white">Players</Link>
      </div>
      <div>
        <Link href="/login" className="bg-cyan-400 text-slate-900 px-3 py-1 rounded">Log in</Link>
      </div>
    </nav>
  )
}
