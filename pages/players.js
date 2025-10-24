import { useEffect, useState } from 'react'
import { fetchPlayers } from '../lib/api'
import withAuth from '../hocs/withAuth'

function Players(){
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
        {players && players.length > 0 ? (
          players.map(pl=> <li key={pl.playerId}>{pl.name} — {pl.position}</li>)
        ) : (
          <li>No players found</li>
        )}
      </ul>
    </main>
  )
}

export default withAuth(Players)
