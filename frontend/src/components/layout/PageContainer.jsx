import Header from './Header'
import DemoPanel from './DemoPanel'

export default function PageContainer({ children, narrow = false, demo = false }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(60rem_30rem_at_50%_-10%,#e0e7ff,transparent)]">
      <Header />
      <main id="main" className={`mx-auto px-4 py-8 sm:px-6 sm:py-12 ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>
        {children}
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6">
        © Fair Drop
      </footer>
      {demo && <DemoPanel />}
    </div>
  )
}
