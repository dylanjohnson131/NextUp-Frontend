import Link from 'next/link'

export default function About() {
  return (
    <main className="container">
      <h1>About</h1>
      <p>This is a minimal Next.js + React app scaffolded for the user.</p>
      <Link className="button" href="/">Home</Link>
    </main>
  )
}
