import '../styles/globals.css'
import NavBar from '../components/NavBar'
import { AuthProvider } from '../contexts/AuthContext'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
  <NavBar />
      <Component {...pageProps} />
    </AuthProvider>
  )
}
