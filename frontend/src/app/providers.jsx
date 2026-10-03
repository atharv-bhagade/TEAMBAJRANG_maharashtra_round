import { BrowserRouter } from 'react-router-dom'

// Single place for app-wide providers (router now; auth/query providers in later phases).
export default function Providers({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}
