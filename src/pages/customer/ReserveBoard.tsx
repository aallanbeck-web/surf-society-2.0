import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Banner, Btn, Field, Panel, Pill, SectionHead, Select, TextInput } from '../../components/ui'
import { hasOverdueBoard, useAppState } from '../../state/AppState'
import { svgBoard } from '../../lib/svgBoard'
import { fmtISODate, todayISO } from '../../lib/format'

const PICKUP_WINDOWS = [
  '8:00 – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 – 2:00 PM',
  '2:00 – 4:00 PM',
  '4:00 – 6:00 PM',
]

export default function ReserveBoard() {
  const { boardId } = useParams()
  const navigate = useNavigate()
  const { boards, members, reservations, isSignedIn, currentMemberView, signInAs, createReservation } = useAppState()
  const board = boards.find((b) => b.id === Number(boardId))

  const [acct, setAcct] = useState(members[0]?.name ?? '')
  const [date, setDate] = useState(todayISO())
  const [window, setWindow] = useState(PICKUP_WINDOWS[0])
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upcomingReservations = useMemo(
    () =>
      board
        ? reservations.filter((r) => r.boardId === board.id && r.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date))
        : [],
    [reservations, board],
  )

  if (!board) {
    return (
      <>
        <SectionHead title="Board not found" />
        <p className="text-ink-soft mb-4">That board doesn't exist, or has been removed from the quiver.</p>
        <Btn variant="primary" onClick={() => navigate('/rentals')}>
          Back to Daily Rentals
        </Btn>
      </>
    )
  }

  const boardSummary = (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-paper-dim">
        <img src={board.photo || svgBoard(board.tint)} alt={board.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <div className="font-semibold text-[15px]">{board.name}</div>
        <div className="text-[12.5px] text-ink-soft mt-0.5">
          {board.brand} · {board.type} · {board.size}
        </div>
      </div>
      <Pill variant={board.status === 'available' ? 'available' : 'out'}>
        {board.status === 'available' ? 'Available' : 'Checked out'}
      </Pill>
    </div>
  )

  if (!isSignedIn) {
    const handleSignIn = (e: React.FormEvent) => {
      e.preventDefault()
      signInAs(acct)
    }
    return (
      <>
        <SectionHead title="Reserve a Board" />
        {boardSummary}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[820px]">
          <Panel className="mb-0">
            <h2 className="text-[16px]">Already a member? Sign in</h2>
            <p className="text-ink-soft text-[13px] mt-1.5">Sign in to pick a pickup day and time for this board.</p>
            <form onSubmit={handleSignIn}>
              <Field label="Account (demo — pick one to preview)">
                <Select value={acct} onChange={(e) => setAcct(e.target.value)}>
                  {members.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} — {m.tier}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Password">
                <TextInput type="password" placeholder="••••••••" />
              </Field>
              <Btn type="submit" variant="primary" className="mt-4.5">
                Sign in &amp; continue
              </Btn>
            </form>
          </Panel>
          <Panel className="mb-0">
            <h2 className="text-[16px]">New here?</h2>
            <p className="text-ink-soft text-[13px] mt-1.5">
              Daily rentals need an account so we can confirm pickup and hold you to one damage-free board at a
              time. It takes under a minute.
            </p>
            <Btn variant="gold" className="mt-4.5" onClick={() => navigate('/join')}>
              Create an account
            </Btn>
          </Panel>
        </div>
      </>
    )
  }

  if (hasOverdueBoard(currentMemberView, boards)) {
    return (
      <>
        <SectionHead title="Reserve a Board" />
        {boardSummary}
        <Banner tone="bad">
          You have an overdue board on your account — please return it before reserving another.
        </Banner>
        <Btn variant="primary" onClick={() => navigate('/account')}>
          Go to My Account
        </Btn>
      </>
    )
  }

  if (confirmed) {
    return (
      <>
        <SectionHead title="Reservation Confirmed" />
        <div className="bg-kelp/10 border border-kelp rounded-xl p-5.5 max-w-[560px]">
          <p className="m-0 mb-2.5">
            <b>{board.name}</b> is reserved for <b>{currentMemberView}</b> on{' '}
            <b>{new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</b>,
            pickup between <b>{window}</b>.
          </p>
          <p className="text-ink-soft text-[13px] mb-4">Bring a valid ID at pickup — the counter is two blocks from La Jolla Shores.</p>
          <Btn variant="primary" onClick={() => navigate('/account')}>
            Go to My Account
          </Btn>
        </div>
      </>
    )
  }

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    const result = createReservation({ boardId: board.id, boardName: board.name, date, window })
    if (!result.ok) {
      setError(result.reason ?? 'That date is unavailable for this board.')
      return
    }
    setError(null)
    setConfirmed(true)
  }

  return (
    <>
      <SectionHead title="Reserve a Board" />
      {boardSummary}
      <Panel className="max-w-[520px]">
        <h2 className="text-[16px]">Pick a day and pickup window</h2>
        <p className="text-ink-soft text-[13px] mt-1.5">
          Signed in as <b className="text-ink">{currentMemberView}</b>. Pickup windows are 2 hours, during business
          hours.
        </p>
        {upcomingReservations.length > 0 && (
          <p className="text-ink-soft text-[13px] mt-3">
            Already reserved: {upcomingReservations.map((r) => fmtISODate(r.date)).join(', ')} — this board can only
            be booked once per day.
          </p>
        )}
        {error && <Banner tone="bad">{error}</Banner>}
        <form onSubmit={handleConfirm}>
          <Field label="Pickup date">
            <TextInput
              type="date"
              min={todayISO()}
              required
              value={date}
              onChange={(e) => {
                setError(null)
                setDate(e.target.value)
              }}
            />
          </Field>
          <Field label="Pickup window">
            <Select value={window} onChange={(e) => setWindow(e.target.value)}>
              {PICKUP_WINDOWS.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </Select>
          </Field>
          <Btn type="submit" variant="gold" className="mt-4.5">
            Confirm reservation
          </Btn>
        </form>
      </Panel>
    </>
  )
}
