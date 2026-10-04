import Providers from './providers'
import AppRoutes from './routes'
import MyTicketsDrawer from '../components/tickets/MyTicketsDrawer'

export default function App() {
  return (
    <Providers>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <AppRoutes />
      {/* Global slide-over tickets drawer accessible from header everywhere */}
      <MyTicketsDrawer />
    </Providers>
  )
}
