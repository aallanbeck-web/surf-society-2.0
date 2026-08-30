import { useNavigate } from 'react-router-dom'
import Slideshow from '../../components/Slideshow'
import { Btn } from '../../components/ui'
import { useAppState } from '../../state/AppState'
import { TIERS } from '../../lib/mockData'

export default function Home() {
  const navigate = useNavigate()
  const { rentalPricing } = useAppState()

  return (
    <>
      <section className="mb-12">
        <h1 className="text-[42px] leading-[1.08] max-w-[640px]">Surf Rentals Made Easy</h1>
        <p className="text-[17px] text-ink-soft max-w-[520px] mt-4">
          Grab a board for a session or a week with no commitment, or join for lower per-day cost and first pick of
          the quiver. Either way, pickup is two blocks from La Jolla Shores.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-[18px] my-8 mb-12">
        <div className="bg-card border border-line rounded-[14px] p-[26px] flex flex-col">
          <div className="text-[12.5px] font-semibold text-ink-soft">No membership needed</div>
          <h2 className="text-[22px] mt-1.5">Daily Rentals</h2>
          <div className="font-serif text-[26px] mt-2.5">
            From ${rentalPricing.daily}
            <span className="font-sans text-[13px] text-ink-soft font-medium"> / day</span>
          </div>
          <p className="text-ink-soft text-[13.5px] mt-2.5 flex-1">
            Pick a board, book online, pick it up. Good for a single session, a week of vacation, or trying a board
            before you buy one.
          </p>
          <Btn variant="primary" className="mt-4.5" onClick={() => navigate('/rentals')}>
            Browse daily rentals
          </Btn>
        </div>
        <div className="bg-card border border-gold rounded-[14px] p-[26px] flex flex-col">
          <div className="text-[12.5px] font-semibold text-ink-soft">Best for regulars</div>
          <h2 className="text-[22px] mt-1.5">Become a Member</h2>
          <div className="font-serif text-[26px] mt-2.5">
            From ${TIERS[0].price}
            <span className="font-sans text-[13px] text-ink-soft font-medium"> / month</span>
          </div>
          <p className="text-ink-soft text-[13.5px] mt-2.5 flex-1">
            Included rental days every month, priority pickup, and full access to the quiver — including boards
            members get first pick of.
          </p>
          <Btn variant="gold" className="mt-4.5" onClick={() => navigate('/membership')}>
            Compare membership tiers
          </Btn>
        </div>
      </section>

      <Slideshow />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line rounded-xl overflow-hidden mb-12">
        {[
          ['1', 'Choose rent or join', "Daily rental for one trip, membership if you're surfing most weeks."],
          ['2', 'Reserve a board online', "See what's available in real time and lock in a pickup window."],
          ['3', 'Pick up, surf, return', "Swap by our shop, check out at the counter, bring it back when you're done."],
        ].map(([n, t, d]) => (
          <div key={n} className="bg-card p-[22px]">
            <div className="font-serif text-xl text-gold-deep">{n}</div>
            <div className="font-semibold mt-1.5 text-[14.5px]">{t}</div>
            <div className="text-[13px] text-ink-soft mt-1">{d}</div>
          </div>
        ))}
      </section>

      <section className="bg-ink text-paper rounded-2xl px-10 py-9 flex items-center justify-between gap-6 flex-wrap mb-2">
        <div>
          <h2 className="text-paper text-2xl max-w-[440px]">Renting three or more days a month?</h2>
          <p className="text-paper/70 mt-1.5 max-w-[440px]">
            A Local membership already costs less per day. See the full comparison.
          </p>
        </div>
        <Btn variant="gold" onClick={() => navigate('/membership')}>
          See membership tiers
        </Btn>
      </section>
    </>
  )
}
