import { DataTable, MiniBtn, Pill, StatCard, StatStrip, SectionHead } from '../../components/ui'
import { useAppState } from '../../state/AppState'
import { fmt } from '../../lib/format'

export default function Members() {
  const { members, toggleMemberStatus, extendMemberBilling } = useAppState()
  const active = members.filter((m) => m.status === 'active')
  const pastDue = members.filter((m) => m.paymentStatus === 'past_due')
  const mrr = active.reduce((s, m) => s + m.amount, 0)

  return (
    <>
      <SectionHead title="Members & Billing" />
      <StatStrip>
        <StatCard value={active.length} label="active members" />
        <StatCard value={pastDue.length} label="past due" />
        <StatCard value={`$${mrr}`} label="monthly recurring, active" />
        <StatCard value={members.length} label="total accounts" />
      </StatStrip>
      <DataTable>
        <table>
          <thead>
            <tr>
              {['Member', 'Tier', 'Next billing', 'Payment', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[11.5px] text-ink-soft px-4 py-3 border-b border-line font-semibold bg-paper-dim">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{m.name}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{m.tier}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">{fmt(m.nextBilling)}</td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">
                  <Pill variant={m.paymentStatus}>{m.paymentStatus === 'current' ? 'Current' : 'Past due'}</Pill>
                </td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">
                  <Pill variant={m.status}>{m.status === 'active' ? 'Active' : 'Inactive'}</Pill>
                </td>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">
                  <div className="flex gap-1.5 flex-wrap">
                    <MiniBtn onClick={() => extendMemberBilling(m.id)}>Extend 30 days</MiniBtn>
                    <MiniBtn tone={m.status === 'active' ? 'warn' : 'checkin'} onClick={() => toggleMemberStatus(m.id)}>
                      {m.status === 'active' ? 'Stop membership' : 'Reactivate'}
                    </MiniBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </>
  )
}
