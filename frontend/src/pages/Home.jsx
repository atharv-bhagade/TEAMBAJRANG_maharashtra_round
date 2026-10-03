import PageContainer from '../components/layout/PageContainer'
import EventCard from '../components/drop/EventCard'
import Button from '../components/ui/Button'
import LoadingBlock from '../components/ui/LoadingBlock'
import { useDrop } from '../hooks/useDrop'
import { DROP_STATUS } from '../mock/mockData'

const principles = [
  ['One entry per account', 'Your place in the queue is saved to your account, so extra tabs or refreshes add no advantage.'],
  ['Orderly access', 'Fair Drop makes ticket buying orderly and calm for everyone.'],
  ['Choose your tickets', 'Claim what you need, up to the per-account limit.'],
]

export default function Home() {
  const { drop, loading } = useDrop()
  const open = drop.status === DROP_STATUS.OPEN

  return (
    <PageContainer>
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="fd-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
            <span aria-hidden="true">●</span> A drop is live now
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            High-demand drops, designed for{' '}
            <span className="bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-transparent">fair access.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Fair Drop gives fans orderly, fair access to high-demand ticket drops.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/drop" size="lg">Join Drop</Button>
            <a href="#how" className="rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-white">How it works →</a>
          </div>
        </div>

        <div className="fd-fade-up" style={{ animationDelay: '120ms' }}>
          {loading ? (
            <LoadingBlock text="Loading drop..." />
          ) : (
            <EventCard drop={drop}>
              <Button to="/drop" size="lg" className="w-full" aria-disabled={!open}>
                {open ? 'Join Drop' : 'View Drop'}
              </Button>
            </EventCard>
          )}
        </div>
      </section>

      <section id="how" className="mt-20 scroll-mt-24">
        <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Built around fairness</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {principles.map(([title, body], i) => (
            <div key={title} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 font-display font-bold text-brand-700">{i + 1}</span>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
