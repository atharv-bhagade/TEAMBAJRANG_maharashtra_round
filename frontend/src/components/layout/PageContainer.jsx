import Header from './Header'
import DemoPanel from './DemoPanel'

export default function PageContainer({ children, narrow = false, demo = false }) {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#F5F5FA] fd-ambient-bg flex flex-col justify-between selection:bg-violet-600 selection:text-white">
      <Header />
      <main id="main" className={`mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-12 ${narrow ? 'max-w-3xl' : 'max-w-6xl'}`}>
        {children}
      </main>
      <footer className="border-t border-white/5 bg-[#0B0B12]/80 backdrop-blur py-8 mt-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-300">Fair Drop</span>
            <span>·</span>
            <span>Equal access ticket drops for real fans</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="/#how" className="hover:text-violet-300 transition-colors">How It Works</a>
            <a href="/drop" className="hover:text-violet-300 transition-colors">Live Drops</a>
            <span>© {new Date().getFullYear()} Fair Drop</span>
          </div>
        </div>
      </footer>
      {demo && <DemoPanel />}
    </div>
  )
}
