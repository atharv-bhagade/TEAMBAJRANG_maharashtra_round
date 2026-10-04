import { Navigate } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import LoginForm from '../features/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { isAuthenticated, reAuthRequired, isAdmin, redirectAfterLogin } = useAuth()

  // If already authenticated and re-authentication is not required, redirect
  if (isAuthenticated && !reAuthRequired) {
    return <Navigate to={redirectAfterLogin || (isAdmin ? '/admin' : '/')} replace />
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-4xl py-6 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12 items-stretch rounded-3xl bg-[#15151F] border border-white/10 shadow-2xl shadow-black/80 overflow-hidden">
          
          {/* Brand/Artwork Column (Desktop) */}
          <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 bg-gradient-to-br from-[#1E1238] via-[#2A1350] to-[#120B24] border-r border-white/10 overflow-hidden">
            {/* Atmospheric lighting */}
            <div aria-hidden="true" className="absolute -top-12 -left-12 h-44 w-44 rounded-full bg-violet-600/30 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-fuchsia-600/20 blur-2xl" />
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300 border border-violet-500/30">
                Verified Fan Access
              </span>
              <h2 className="mt-6 font-display text-2xl font-bold text-white tracking-tight leading-snug">
                Your next unforgettable live event starts here.
              </h2>
              <p className="mt-3 text-sm text-violet-200/80 leading-relaxed">
                Fair Drop connects real fans to premier concerts and world tours with fair seat allocation.
              </p>
            </div>

            {/* Digital Ticket Graphic */}
            <div className="relative z-10 mt-8 rounded-2xl bg-[#110D20]/90 p-4 border border-violet-500/20 shadow-lg">
              <div className="flex items-center justify-between text-xs text-violet-300">
                <span className="font-semibold uppercase tracking-wider">Live Tour Pass</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <p className="mt-2 font-display text-base font-bold text-white">Coldplay — Mumbai</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <span>Direct Quota · Nov 2026</span>
                <span className="font-mono text-violet-400">FAIR-DROP</span>
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-slate-500 mt-6">
              © Fair Drop · Premier Live Events & Tours
            </p>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full fd-fade-up">
              <LoginForm />
            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  )
}
