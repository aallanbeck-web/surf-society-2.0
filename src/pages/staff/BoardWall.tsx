import { useMemo, useState } from 'react'
import { Btn, MiniBtn, Pill, Select, SectionHead } from '../../components/ui'
import QrCode from '../../components/QrCode'
import { useAppState } from '../../state/AppState'
import { svgBoard } from '../../lib/svgBoard'

export default function BoardWall() {
  const { boards, members, activity, checkOutBoard, checkInBoard } = useAppState()
  const [search, setSearch] = useState('')
  const [openCheckoutFor, setOpenCheckoutFor] = useState<number | null>(null)
  const [checkoutMember, setCheckoutMember] = useState(members[0]?.name ?? '')
  const [showAddMember, setShowAddMember] = useState(false)
  const joinUrl = `${window.location.origin}/join`

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return boards
    return boards.filter((b) => `${b.name} ${b.brand} ${b.type}`.toLowerCase().includes(q))
  }, [boards, search])

  const confirmCheckout = (id: number) => {
    checkOutBoard(id, checkoutMember)
    setOpenCheckoutFor(null)
  }

  return (
    <>
      <SectionHead
        title="Board Wall"
        action={
          <Btn variant="primary" onClick={() => setShowAddMember((v) => !v)}>
            {showAddMember ? 'Cancel' : '+ Add member'}
          </Btn>
        }
      />

      {showAddMember && (
        <div className="bg-card border border-line rounded-[14px] p-6.5 mb-7 flex flex-col md:flex-row gap-6 items-center">
          <QrCode data={joinUrl} />
          <div>
            <h2 className="text-[16px]">Have the customer scan this code</h2>
            <p className="text-ink-soft text-[13.5px] mt-1.5 max-w-[440px]">
              It opens the membership application on their phone so they can sign up on the spot — pick a
              tier, enter their info, and they're a member before they leave the counter.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2.5 mb-5 flex-wrap items-center">
        <input
          className="px-3.5 py-2.5 border border-line-strong rounded-lg bg-card min-w-[220px] focus:outline focus:outline-2 focus:outline-kelp focus:outline-offset-1"
          placeholder="Search by name, brand, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
        {filtered.map((b) => (
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
                <Pill variant={b.status === 'available' ? 'available' : 'out'}>
                  {b.status === 'available' ? 'Available' : 'Checked out'}
                </Pill>
                {b.status === 'available' ? (
                  <MiniBtn tone="checkout" onClick={() => setOpenCheckoutFor(b.id)}>
                    Check out
                  </MiniBtn>
                ) : (
                  <MiniBtn tone="checkin" onClick={() => checkInBoard(b.id)}>
                    Check in
                  </MiniBtn>
                )}
              </div>
              {b.status === 'out' && (
                <div className="text-xs text-ink-soft mt-1.5">
                  With {b.outTo} · since {b.outSince}
                </div>
              )}
              {openCheckoutFor === b.id && (
                <div className="flex gap-1.5 mt-2.5">
                  <Select
                    className="flex-1 px-2 py-1.5 text-[13px]"
                    value={checkoutMember}
                    onChange={(e) => setCheckoutMember(e.target.value)}
                  >
                    {members.map((m) => (
                      <option key={m.id}>{m.name}</option>
                    ))}
                  </Select>
                  <MiniBtn tone="checkout" onClick={() => confirmCheckout(b.id)}>
                    Confirm
                  </MiniBtn>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-9">
        <h2 className="text-[16px] mb-3">Recent activity</h2>
        <ul className="list-none p-0 m-0 border-t border-line">
          {activity.map((a, i) => (
            <li key={i} className="py-2.5 border-b border-line text-[13.5px] flex justify-between text-ink-soft">
              <span>{a.text}</span>
              <span>{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
