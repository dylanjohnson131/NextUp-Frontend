export default function Dashboard(){
  return (
    <main className="container">
      <h1>Coach Dashboard</h1>
      <section className="mt-4">
        <p>Welcome to your NextUp dashboard!</p>
        <div className="mt-6">
          <h2>Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <a href="/players" className="block bg-cyan-400 text-slate-900 px-4 py-2 rounded text-center">View Players</a>
            <a href="/about" className="block bg-slate-700 text-white px-4 py-2 rounded text-center">About</a>
          </div>
        </div>
      </section>
    </main>
  )
}
