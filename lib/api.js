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

// Fetch upcoming games for a team
export async function fetchUpcomingGames(teamId){
  return req(`/api/games/upcoming/${teamId}`)
}

// Player information
export async function fetchPlayerById(playerId){
  return req(`/api/players/${playerId}`)
}

// Player statistics
export async function fetchPlayerStats(playerId){
  return req(`/api/stats/player/${playerId}`)
}

// Athletic Director functions
export async function fetchAthleticDirectorDashboard(){
  return req('/api/athletic-directors/dashboard')
}

export async function fetchAthleticDirectorTeams(){
  return req('/api/athletic-directors/teams')
}

export async function createAthleticDirectorTeam(teamData){
  return req('/api/athletic-directors/teams', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(teamData)
  })
}

export async function updateAthleticDirectorTeam(teamId, teamData){
  return req(`/api/athletic-directors/teams/${teamId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(teamData)
  })
}

export async function deleteAthleticDirectorTeam(teamId){
  return req(`/api/athletic-directors/teams/${teamId}`, {
    method: 'DELETE'
  })
}

export async function fetchAthleticDirectorGames(){
  return req('/api/athletic-directors/games')
}

export async function createAthleticDirectorGame(gameData){
  return req('/api/athletic-directors/games', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(gameData)
  })
}

export async function updateAthleticDirectorGame(gameId, gameData){
  return req(`/api/athletic-directors/games/${gameId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(gameData)
  })
}

export async function deleteAthleticDirectorGame(gameId){
  return req(`/api/athletic-directors/games/${gameId}`, {
    method: 'DELETE'
  })
}

export default { login, logout, registerPlayer, registerCoach, fetchTeams, fetchPlayers, getCurrentUser, getCurrentPlayer, getCurrentCoach, fetchOpponentTeamOverview, fetchPlayerGoals, fetchMyGoals, createPlayerGoal, updatePlayerGoal, deletePlayerGoal, fetchTeamById, fetchMyTeam, fetchUpcomingGames, fetchPlayerById, fetchPlayerStats, fetchAthleticDirectorDashboard, fetchAthleticDirectorTeams, createAthleticDirectorTeam, updateAthleticDirectorTeam, deleteAthleticDirectorTeam, fetchAthleticDirectorGames, createAthleticDirectorGame, updateAthleticDirectorGame, deleteAthleticDirectorGame }
