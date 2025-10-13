const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5164'

async function req(path, opts={}){
  const headers = opts.headers || {}
  const res = await fetch(`${BASE}${path}`, { 
    ...opts, 
    headers,
    credentials: 'include'
  })
  
  if (res.status === 204 && res.ok) return { success: true }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  
  const json = await res.json().catch(()=>null)
  return json
}

export async function login({email, password}){
  return req('/auth/login', { 
    method: 'POST', 
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({email, password}) 
  })
}

export async function logout(){
  return req('/auth/logout', { method: 'POST' })
}

export async function registerPlayer(playerData){
  return req('/auth/register/player', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(playerData)
  })
}

export async function registerCoach(coachData){
  return req('/auth/register/coach', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(coachData)
  })
}

export async function fetchTeams(){
  return req('/api/teams')
}

export async function fetchPlayers(){
  return req('/api/players')
}

export default { login, logout, registerPlayer, registerCoach, fetchTeams, fetchPlayers }
