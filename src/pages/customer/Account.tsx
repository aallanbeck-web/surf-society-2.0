import { useNavigate } from 'react-router-dom'
import { Banner, Btn, DataTable, Pill, SectionHead } from '../../components/ui'
import RentalHistoryTable from '../../components/RentalHistoryTable'
import { useAppState } from '../../state/AppState'
import { fmt, fmtISODate, todayISO } from '../../lib/format'
import { getDaysRemaining, getIncludedDays, getNextTier, isNearingDayLimit } from '../../lib/membership'

export default function Account() {
  const navigate = useNavigate()
  const { currentMember: m, reservations } = useAppState()

  const included = getIncludedDays(m.tier)
  const remaining = getDaysRemaining(m)
  const nextTier = getNextTier(m.tier)
  const nearingLimit = isNearingDayLimit(m)

  const upcomingReservations = reservations
    .filter((r) => r.memberName === m.name && r.date >= todayISO())
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <SectionHead title="My Account" />
      {m.paymentStatus === 'past_due' && (
        <Banner tone="bad">Payment past due — update your payment method to keep booking privileges.</Banner>
      )}
      {nearingLimit && nextTier && (
        <Banner tone="info">
          <span>
            You've used {m.daysUsedThisMonth} of {included} rental days included with {m.tier} this month.
          </span>
          <Btn variant="gold" onClick={() => navigate('/membership')}>
            Upgrade to {nextTier.name}
          </Btn>
        </Banner>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr] gap-5 mb-7">
        <div className="bg-card border border-line rounded-xl p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-[16px]">{m.name}</div>
              <div className="text-[12.5px] text-ink-soft mt-1">{m.tier} membership</div>
            </div>
            <Pill variant={m.status}>{m.status === 'active' ? 'Active' : 'Inactive'}</Pill>
          </div>
          <div className="mt-4.5 text-[13.5px] text-ink-soft">
            Next billing date: <b className="text-ink">{fmt(m.nextBilling)}</b>
          </div>
          <div className="mt-1 text-[13.5px] text-ink-soft">
            Amount due: <b className="text-ink">${m.amount}.00</b>
          </div>
          <div className="mt-1 text-[13.5px] text-ink-soft">
            Payment status: <b className="text-ink">{m.paymentStatus === 'current' ? 'Current' : 'Past due'}</b>
          </div>
          <div className="mt-1 text-[13.5px] text-ink-soft">
            Payment method: <b className="text-ink">Visa •••• 4417</b>
          </div>
          <div className="mt-1 text-[13.5px] text-ink-soft">
            Rental days this month:{' '}
            <b className="text-ink">{included === null ? 'Unlimited' : `${remaining} of ${included} left`}</b>
          </div>
          <Btn variant="ghost" className="mt-4.5">
            Update payment method
          </Btn>
        </div>
        <DataTable>
          <table>
            <thead>
              <tr>
                <th className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                  Date
                </th>
                <th className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                  Description
                </th>
                <th className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                  Amount
                </th>
                <th className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {m.history.map((h, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 border-b border-line text-[13.5px] last:border-0">{h.date}</td>
                  <td className="px-4 py-3 border-b border-line text-[13.5px]">{h.desc}</td>
                  <td className="px-4 py-3 border-b border-line text-[13.5px]">${h.amount}.00</td>
                  <td className="px-4 py-3 border-b border-line text-[13.5px]">{h.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      </div>

      <SectionHead title="Upcoming reservations" size="sm" />
      {upcomingReservations.length === 0 ? (
        <p className="text-ink-soft text-[13.5px] mb-7">No upcoming reservations.</p>
      ) : (
        <div className="mb-7">
          <DataTable>
            <table>
              <thead>
                <tr>
                  {['Board', 'Date', 'Pickup window'].map((h) => (
                    <th key={h} className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upcomingReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 border-b border-line text-[13.5px]">{r.boardName}</td>
                    <td className="px-4 py-3 border-b border-line text-[13.5px]">{fmtISODate(r.date)}</td>
                    <td className="px-4 py-3 border-b border-line text-[13.5px]">{r.window}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTable>
        </div>
      )}

      <SectionHead title="Rental history" size="sm" />
      <RentalHistoryTable entries={m.rentalHistory} />
    </>
  )
}
