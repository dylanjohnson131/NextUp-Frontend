import { useEffect, useState } from 'react'
import { fetchPlayers } from '../lib/api'

export default function Players(){
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    fetchPlayers().then(p=>{setPlayers(p||[]); setLoading(false)}).catch(()=>setLoading(false))
  },[])

  return (
    <main className="container">
      <h1>Players</h1>
      {loading && <p>Loading...</p>}
      <ul className="mt-4">
        {players.map(pl=> <li key={pl.PlayerId}>{pl.Name} — {pl.Position}</li>)}
      </ul>
    </main>
  )
}
