import { SectionHead, MiniBtn, Pill } from '../../components/ui'
import { useAppState } from '../../state/AppState'
import { svgBoard } from '../../lib/svgBoard'

export default function Rentals() {
  const { rentalPricing, boards } = useAppState()
  const available = boards.filter((b) => b.status === 'available')

  return (
    <>
      <SectionHead title="Daily Rentals" />
      <p className="text-ink-soft max-w-[560px] mb-2">
        No membership required. Book by the hour, the day, or the week — pricing below, availability updates as
        boards come and go.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 mb-11">
        {[
          ['Hourly', rentalPricing.hourly, 'per hour'],
          ['Daily', rentalPricing.daily, 'per day'],
          ['Weekly', rentalPricing.weekly, 'per week'],
        ].map(([label, price, unit]) => (
          <div key={label as string} className="bg-card border border-line rounded-xl px-[22px] py-5 text-left">
            <div className="text-[12.5px] text-ink-soft">{label}</div>
            <div className="font-serif text-[28px] mt-1.5">${price}</div>
            <div className="text-[12.5px] text-ink-soft">{unit}</div>
          </div>
        ))}
      </div>

      <SectionHead title="Available now" size="sm" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
        {available.map((b) => (
          <div key={b.id} className="bg-card border border-line rounded-xl overflow-hidden">
            <div className="aspect-[4/3] bg-paper-dim flex items-center justify-center overflow-hidden">
              <img src={b.photo || svgBoard(b.tint)} alt={b.name} className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-3.5">
              <div className="font-semibold text-[14.5px]">{b.name}</div>
              <div className="text-[12.5px] text-ink-soft mt-0.5">
                {b.brand} · {b.type} · {b.size}
              </div>
              <div className="flex justify-between items-center mt-2.5">
                <Pill variant="available">Available</Pill>
                <MiniBtn tone="checkout">Reserve</MiniBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
