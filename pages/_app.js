import '../styles/globals.css'
import RoleNavBar from '../components/RoleNavBar'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <RoleNavBar />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
