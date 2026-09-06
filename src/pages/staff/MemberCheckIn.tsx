import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Banner, Btn, Pill, SectionHead } from '../../components/ui'
import RentalHistoryTable from '../../components/RentalHistoryTable'
import { useAppState } from '../../state/AppState'
import { fmt } from '../../lib/format'
import { getDaysRemaining, getIncludedDays, isNearingDayLimit } from '../../lib/membership'

export default function MemberCheckIn() {
  const { members } = useAppState()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState('')

  const runSearch = () => setSearched(query)

  const q = searched.trim().toLowerCase()
  const match = q ? members.find((m) => m.name.toLowerCase().includes(q)) : null
  const goodStanding = match ? match.status === 'active' && match.paymentStatus === 'current' : false

  return (
    <>
      <SectionHead title="Member Check-In" />
      <p className="text-ink-soft max-w-[560px] mb-5">
        Look a member up before swapping their board or answering a rental history question — this confirms
        their membership is active and payment is current, and shows what they've rented.
      </p>
      <div className="flex gap-2.5 mb-5 flex-wrap items-center">
        <input
          className="px-3.5 py-2.5 border border-line-strong rounded-lg bg-card min-w-[220px] focus:outline focus:outline-2 focus:outline-kelp focus:outline-offset-1"
          placeholder="Search customer by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              runSearch()
            }
          }}
        />
        <Btn variant="primary" onClick={runSearch}>
          Look up
        </Btn>
      </div>

      {q &&
        (!match ? (
          <Banner tone="bad">No member found matching "{searched}".</Banner>
        ) : (
          <>
            {goodStanding ? (
              <Banner tone="good">Good standing — clear to check out a board.</Banner>
            ) : (
              <Banner tone="bad">
                {match.status !== 'active' ? 'Membership inactive.' : 'Payment past due.'} Resolve before checking out
                a board.
              </Banner>
            )}
            <div className="bg-card border border-line rounded-xl p-6 max-w-[480px]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-[16px]">{match.name}</div>
                  <div className="text-[12.5px] text-ink-soft mt-1">{match.tier} membership</div>
                </div>
                <Pill variant={match.status}>{match.status === 'active' ? 'Active' : 'Inactive'}</Pill>
              </div>
              <div className="mt-4.5 text-[13.5px] text-ink-soft">
                Payment status: <b className="text-ink">{match.paymentStatus === 'current' ? 'Current' : 'Past due'}</b>
              </div>
              <div className="mt-1 text-[13.5px] text-ink-soft">
                Next billing: <b className="text-ink">{fmt(match.nextBilling)}</b>
              </div>
              <div className="mt-1 text-[13.5px] text-ink-soft">
                Rental days this month:{' '}
                <b className="text-ink">
                  {getIncludedDays(match.tier) === null
                    ? 'Unlimited'
                    : `${getDaysRemaining(match)} of ${getIncludedDays(match.tier)} left`}
                </b>
                {isNearingDayLimit(match) && (
                  <span className="text-gold-deep"> — nearing limit, consider suggesting an upgrade</span>
                )}
              </div>
              {goodStanding && (
                <Btn variant="primary" className="mt-4" onClick={() => navigate('/staff/board-wall')}>
                  Go to Board Wall
                </Btn>
              )}
            </div>

            <div className="mt-7">
              <SectionHead title={`Rental history — ${match.name}`} size="sm" />
              <RentalHistoryTable entries={match.rentalHistory} />
            </div>
          </>
        ))}
    </>
  )
}
