# NextUp Client

Frontend application for NextUp - a modern youth football team management platform built with Next.js.
Overview
nextup-client is the user-facing application for NextUp, providing intuitive interfaces for players, coaches, and athletic directors to manage teams, track performance, and gain insights into youth football programs. Built with Next.js for optimal performance and SEO, the client features role-specific dashboards and real-time data visualization.

Want to check out the API? View here: https://github.com/dylanjohnson131/nextup-api

 # Tech Stack

Framework: Next.js 13.5.6 (App Router)
Language: JavaScript
Styling:  CSS
State Management: React Context API
API Communication: Axios 
Authentication: JWT with HTTP-only cookies
UI Components: custom component library

Key Features
Role-Based Dashboards
Player Dashboard

Personal profile and statistics overview
Performance trends and historical data
Team schedule and upcoming games
Position-specific stat tracking

Coach Dashboard

Team roster management
Game scheduling and management
Player stat input and tracking
Team analysis and insights
Practice planning tools

Athletic Director Dashboard

Multi-team oversight
Game creation center
Coach management

Prerequisites

Node.js (v18 or higher)
npm or yarn
NextUp.Api running locally or deployed

Getting Started
1. Clone the Repository
git clone <repository-url>
cd nextup-client
2. Install Dependencies
npm install
# or
yarn install
3. Configure Environment Variables
Create a .env.local file in the project root:
envNEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
For production:
envNEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
4. Run the Development Server
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser.
5. Build for Production
npm run build
npm start
# or
yarn build
yarn start
# Project Structure

```

nextup-client/
├── .gitignore
├── next.config.js
├── package.json
├── README.md
├── .next/
│   └── ... (build output)
├── .vscode/
│   ├── launch.json
├── components/
│   ├── PlayerPerformanceChart.js
│   ├── PlayerStatsCard.js
│   └── RoleNavBar.js
├── contexts/
│   └── AuthContext.js
├── hocs/
│   └── withAuth.js
├── lib/
│   ├── api.js
│   └── positions.js
├── pages/
│   ├── _app.js
│   ├── about.js
│   ├── dashboard.js
│   ├── index.js
│   ├── login.js
│   ├── players.js
│   ├── register.js
│   ├── athletic-director/
│   │   ├── dashboard.js
│   │   ├── games.js
│   │   ├── schedule.js
│   │   └── teams.js
│   ├── coach/
│   │   ├── dashboard.js
│   │   ├── depth-chart.js
│   │   ├── game-stats.js
│   │   ├── my-team.js
│   │   ├── opponents.js
│   │   ├── schedule.js
│   │   └── opponent/
│   │       └── [teamId].js
│   └── player/
│       ├── dashboard.js
│       ├── matchup.js
│       ├── my-goals.js
│       ├── my-stats.js
│       └── team-info.js
├── public/
├── styles/
│   ├── ad-dashboard.css
│   ├── globals.css
│   └── navbar-modern.css

```

# Key Pages

Landing Page (/ or index.js): The main entry point introducing the app.
Login (/login.js) and Register (/register.js): For user authentication and account creation.
Dashboard (/dashboard.js): A general dashboard that redirects users based on their role.
Players (/players.js): Lists players and their profiles.
About (/about.js): Information about the app.
Role-specific dashboards and features:

Athletic Director Pages (/athletic-director/):

Dashboard, Games, Schedule, Teams management.
Coach Pages (/coach/):

Dashboard, Depth Chart, Game Stats, My Team, Opponents, Schedule, and detailed Opponent pages.
Player Pages (/player/):

Dashboard, Matchup, My Goals, My Stats, Team Info.

Authentication Flow

Login:
Users enter their credentials on the /login page. When they submit the form, the frontend sends a login request to the backend API using Axios.

JWT & HTTP-only Cookie:
If authentication is successful, the backend responds by setting a JWT in an HTTP-only cookie. This cookie is not accessible via JavaScript, which helps protect against XSS attacks.

Auth State Management:
The frontend uses a custom AuthContext (in AuthContext.js) to manage authentication state. After login, the context updates the user’s state and role based on the backend response.

Protected Routes:
Certain pages (like dashboards) are protected using a higher-order component (withAuth.js). This checks the authentication state and redirects unauthenticated users to the login page.

Session Persistence:
On page reloads, the frontend checks with the backend (using the HTTP-only cookie) to verify if the user is still authenticated and updates the context accordingly.

Logout:
When users log out, the frontend calls the backend to clear the authentication cookie and resets the auth state in the context.

API Integration
The client communicates with NextUp.Api via REST endpoints:
typescript// Example API call structure
import { apiClient } from '@/lib/api/client';

// Get teams
const teams = await apiClient.get('/teams');

// Create team
const newTeam = await apiClient.post('/teams', teamData);

// Get player stats
const stats = await apiClient.get(`/players/${playerId}/stats`);

# Future Enhancements

Visual Charts/Analytics for Players
Video Highlight Integration
Player Image on Player's Profile Card
Mobile Support
Advanced data visualizations 
Parent Portal
Add a "Fan" Role to keep up with a team and integrate ticket sales within the app

Contributing
This project was developed as part of a school capstone project. If you'd like to contribute:

Fork the repository
Create a feature branch
Make your changes with tests
Submit a pull request


# Note: 
    This application showcases modern React/Next.js development practices with a focus on user  experience, performance, and maintainable code architecture. Built as a demonstration project for youth sports management solutions.
