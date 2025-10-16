import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import withAuth from '../hocs/withAuth'

function Dashboard(){
  return (
    <main className="container">
      <h1>Dashboard</h1>
      <section className="mt-4">
        <p>Welcome to your NextUp dashboard!</p>
        <div className="mt-6">
          <h2>Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <Link href="/players" className="block bg-cyan-400 text-slate-900 px-4 py-2 rounded text-center">View Players</Link>
            <Link href="/about" className="block bg-slate-700 text-white px-4 py-2 rounded text-center">About</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default withAuth(Dashboard)
