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

export async function getCurrentUser(){
  return req('/auth/me')
}

export async function getCurrentPlayer(){
  return req('/api/players/me')
}

export async function getCurrentCoach(){
  return req('/api/coaches/me')
}

export async function fetchOpponentTeamOverview(teamId){
  return req(`/api/teams/${teamId}/overview`)
}

// Player Goals CRUD operations
export async function fetchPlayerGoals(playerId){
  return req(`/api/player-goals/by-player/${playerId}`)
}

export async function fetchMyGoals(){
  return req('/api/player-goals/my-goals')
}

export async function createPlayerGoal(goalData){
  return req('/api/player-goals', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(goalData)
  })
}

export async function updatePlayerGoal(goalId, goalData){
  return req(`/api/player-goals/${goalId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(goalData)
  })
}

export async function deletePlayerGoal(goalId){
  return req(`/api/player-goals/${goalId}`, {
    method: 'DELETE'
  })
}

// Team information
export async function fetchTeamById(teamId){
  return req(`/api/teams/${teamId}`)
}

export async function fetchMyTeam(){
  // Get current player first, then fetch their team
  const player = await getCurrentPlayer()
  if (!player || !player.team || !player.team.teamId) {
    throw new Error('Player team information not available')
  }
  return fetchTeamById(player.team.teamId)
}

export default { login, logout, registerPlayer, registerCoach, fetchTeams, fetchPlayers, getCurrentUser, getCurrentPlayer, getCurrentCoach, fetchOpponentTeamOverview, fetchPlayerGoals, fetchMyGoals, createPlayerGoal, updatePlayerGoal, deletePlayerGoal, fetchTeamById, fetchMyTeam }
