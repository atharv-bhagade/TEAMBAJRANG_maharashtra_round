import PageContainer from '../components/layout/PageContainer'
import EventCard from '../components/drop/EventCard'
import Button from '../components/ui/Button'
import LoadingBlock from '../components/ui/LoadingBlock'
import { useDrop } from '../hooks/useDrop'
import { DROP_STATUS } from '../mock/mockData'

const steps = [
  {
    step: '01',
    title: 'Join the entry pool',
    description: 'Select your ticket count and enter during the window. There is no rush and no race to click first.',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Wait for admission',
    description: 'When the pool closes, allocations open. Everyone gets an equal, randomized chance regardless of bandwidth.',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Claim your tickets',
    description: 'Admitted fans receive a dedicated window to claim tickets held exclusively for them.',
    icon: (
      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const principles = [
  {
    title: 'One entry per account',
    body: 'Your place in the pool is saved to your account. Extra tabs or rapid refreshes provide zero advantage.',
  },
  {
    title: 'No speed race',
    body: 'Your chance shouldn’t depend on your internet speed. Join calmly during the window.',
  },
  {
    title: 'Flexible quantities',
    body: 'Request what you need, up to the 4-ticket per account limit. Everyone is treated equally.',
  },
]

export default function Home() {
  const { drop, loading } = useDrop()
  const open = drop.status === DROP_STATUS.OPEN

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14 pt-4 sm:pt-8">
        <div className="lg:col-span-6 fd-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-950/70 px-3.5 py-1.5 text-xs font-semibold text-violet-300 border border-violet-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            <span>Live Fair Pool Open</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Big moments.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              A fair chance.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-300 max-w-xl">
            Enter exclusive ticket drops without the rush. Join during the entry window and let fair allocation decide.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#15151F] border border-white/5 text-sm text-slate-300">
            <p className="font-semibold text-white">“Your chance shouldn’t depend on your internet speed.”</p>
            <p className="text-slate-400 text-xs mt-1">Join the pool. Everyone gets a fair chance.</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/drop" size="lg" className="w-full sm:w-auto shadow-xl shadow-violet-950/50">
              Explore Drops
            </Button>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors w-full sm:w-auto text-center"
            >
              How It Works →
            </a>
          </div>
        </div>

        {/* Featured Drop Card */}
        <div id="drops" className="lg:col-span-6 fd-fade-up scroll-mt-24" style={{ animationDelay: '120ms' }}>
          {loading ? (
            <LoadingBlock text="Loading drop..." />
          ) : (
            <EventCard drop={drop}>
              <Button to="/drop" size="lg" className="w-full" aria-disabled={!open}>
                {open ? 'Join Fair Drop' : 'View Drop'}
              </Button>
            </EventCard>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="mt-28 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">The Fair Drop Process</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            How the Fair Pool Works
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            No bots winning in milliseconds. No crashed servers. Just orderly, verified allocation.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative overflow-hidden rounded-2xl bg-[#15151F] p-7 border border-white/10 shadow-lg shadow-black/40 group hover:border-violet-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-950/70 border border-violet-500/20">
                  {s.icon}
                </span>
                <span className="font-display font-extrabold text-2xl text-slate-700 select-none">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-white tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fairness Principles Section */}
      <section className="mt-24 rounded-3xl bg-gradient-to-br from-[#181827] to-[#12121E] border border-white/10 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Our Commitment</span>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white tracking-tight">
            Built Around Fairness
          </h2>
          <p className="mt-3 text-slate-300">
            Engineered to give genuine fans an equal opportunity to experience the artists they love.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {principles.map((p, idx) => (
            <div key={p.title} className="rounded-2xl bg-[#15151F]/80 p-5 border border-white/5">
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Rule {idx + 1}</span>
              <h3 className="mt-2 font-display text-base font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
