export default function Home() {
  return (
    <main className="container">
      <h1>NextUp</h1>
      <p className="mt-2">Welcome back — choose a view to get started.</p>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/dashboard" className="p-4 bg-slate-800 rounded">Coach Dashboard</a>
        <a href="/players" className="p-4 bg-slate-800 rounded">Player List</a>
        <a href="/login" className="p-4 bg-slate-800 rounded">Log in</a>
      </section>
    </main>
  )
}
