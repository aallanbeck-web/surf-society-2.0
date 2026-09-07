import { useMemo, useState } from 'react'
import { DataTable, MiniBtn, Pill, StatCard, StatStrip, SectionHead } from '../../components/ui'
import ContactClientPanel from '../../components/ContactClientPanel'
import { hasOverdueBoard, useAppState } from '../../state/AppState'
import { fmt } from '../../lib/format'

export default function Members() {
  const { members, boards, messageLog, toggleMemberStatus, extendMemberBilling } = useAppState()
  const [search, setSearch] = useState('')
  const [messagingId, setMessagingId] = useState<number | null>(null)

  // Daily (non-membership, pay-per-rental) accounts aren't billed as members — this page is billing-focused.
  const billedMembers = useMemo(() => members.filter((m) => m.tier !== 'Daily'), [members])

  const active = billedMembers.filter((m) => m.status === 'active')
  const pastDue = billedMembers.filter((m) => m.paymentStatus === 'past_due')
  const mrr = active.reduce((s, m) => s + m.amount, 0)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return billedMembers
    return billedMembers.filter((m) => `${m.name} ${m.email} ${m.tier}`.toLowerCase().includes(q))
  }, [billedMembers, search])

  const messagingMember = messagingId ? (members.find((m) => m.id === messagingId) ?? null) : null

  return (
    <>
      <SectionHead title="Members & Billing" />
      <StatStrip>
        <StatCard value={active.length} label="active members" />
        <StatCard value={pastDue.length} label="past due" />
        <StatCard value={`$${mrr}`} label="monthly recurring, active" />
        <StatCard value={billedMembers.length} label="total accounts" />
      </StatStrip>

      <div className="flex gap-2.5 mb-5 flex-wrap items-center">
        <input
          className="px-3.5 py-2.5 border border-line-strong rounded-lg bg-card min-w-[220px] focus:outline focus:outline-2 focus:outline-kelp focus:outline-offset-1"
          placeholder="Search customers by name, email, or tier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {messagingMember && (
        <div className="mb-7 max-w-[560px]">
          <ContactClientPanel
            member={messagingMember}
            defaultTemplate={messagingMember.paymentStatus === 'past_due' ? 'past_due_payment' : 'promotion'}
            onClose={() => setMessagingId(null)}
          />
        </div>
      )}

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
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 border-b border-line text-[13.5px]">
                  {m.name}
                  {hasOverdueBoard(m.name, boards) && <span className="text-rust font-semibold"> · board overdue</span>}
                </td>
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
                    <MiniBtn onClick={() => setMessagingId(m.id)}>Message</MiniBtn>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-[13.5px] text-ink-soft text-center">
                  No customers found matching "{search}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DataTable>

      {messageLog.length > 0 && (
        <div className="mt-9">
          <h2 className="text-[16px] mb-3">Recent messages</h2>
          <ul className="list-none p-0 m-0 border-t border-line">
            {messageLog.map((msg) => (
              <li key={msg.id} className="py-2.5 border-b border-line text-[13.5px] flex justify-between gap-3 text-ink-soft">
                <span>
                  <b className="text-ink">{msg.memberName}</b> — {msg.subject} ({msg.channel === 'email' ? 'email' : 'text'})
                </span>
                <span>{msg.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
