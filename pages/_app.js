import '../styles/globals.css'
import RoleNavBar from '../components/RoleNavBar'

export default function App({ Component, pageProps }) {
  return (
    <>
      <RoleNavBar />
      <Component {...pageProps} />
    </>
  )
}
