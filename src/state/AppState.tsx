import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Board, Member, Review, ActivityEntry, Reservation, SentMessage } from '../lib/types'
import { addDays, fmtISODate } from '../lib/format'
import {
  initialBoards,
  initialMembers,
  initialReviews,
  initialActivity,
  initialReservations,
  initialRentalPricing,
  TIERS,
  JOIN_NEXT_BILLING,
} from '../lib/mockData'

interface NewBoardInput {
  name: string
  brand: string
  type: string
  size: string
  condition: string
  photo: string | null
}

interface NewReviewInput {
  board: string
  skill: string
  rating: number
  text: string
}

interface JoinInput {
  name: string
  email: string
  phone: string
  /** A TIERS name (Swell/Local/Society), or 'Daily' for a non-membership pay-per-rental account. */
  tier: string
}

interface NewReservationInput {
  boardId: number
  boardName: string
  date: string
  window: string
}

interface ReservationResult {
  ok: boolean
  reason?: string
}

interface SendMessageInput {
  memberName: string
  channel: 'email' | 'text'
  destination: string
  subject: string
  body: string
}

/** True when a member currently has a checked-out board that's past its expected return. */
export function hasOverdueBoard(memberName: string, boards: Board[]): boolean {
  return boards.some((b) => b.status === 'out' && b.outTo === memberName && b.isPastDue)
}

/** A member is eligible to have a board checked out to them: active, payment current, nothing overdue. */
export function isMemberEligible(member: Member, boards: Board[]): boolean {
  return member.status === 'active' && member.paymentStatus === 'current' && !hasOverdueBoard(member.name, boards)
}

interface AppStateValue {
  // data
  boards: Board[]
  members: Member[]
  reviews: Review[]
  activity: ActivityEntry[]
  reservations: Reservation[]
  messageLog: SentMessage[]
  rentalPricing: typeof initialRentalPricing
  currentMemberView: string
  joinSuccess: Member | null
  isSignedIn: boolean

  // derived
  currentMember: Member

  // actions
  checkOutBoard: (boardId: number, memberName: string) => void
  checkInBoard: (boardId: number) => void
  addBoard: (input: NewBoardInput) => void
  toggleMemberStatus: (memberId: number) => void
  extendMemberBilling: (memberId: number) => void
  signInAs: (memberName: string) => void
  joinAsMember: (input: JoinInput) => void
  addReview: (input: NewReviewInput) => void
  createReservation: (input: NewReservationInput) => ReservationResult
  addMemberNote: (memberId: number, text: string) => void
  addBoardNote: (boardId: number, text: string) => void
  sendClientMessage: (input: SendMessageInput) => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(initialBoards)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [activity, setActivity] = useState<ActivityEntry[]>(initialActivity)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [messageLog, setMessageLog] = useState<SentMessage[]>([])
  const [currentMemberView, setCurrentMemberView] = useState('Priya Nair')
  const [joinSuccess, setJoinSuccess] = useState<Member | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const checkOutBoard = (boardId: number, memberName: string) => {
    const member = members.find((m) => m.name === memberName)
    // Defense in depth — the staff UI only ever offers eligible members, but never let an
    // inactive, past-due, or already-overdue account walk out with another board.
    if (!member || !isMemberEligible(member, boards)) return

    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId
          ? { ...b, status: 'out', outTo: memberName, outSince: 'Just now', dueBack: 'Today, 6:00 PM', isPastDue: false }
          : b,
      ),
    )
    const board = boards.find((b) => b.id === boardId)
    if (board) {
      setActivity((prev) => [{ time: 'Just now', text: `${memberName} checked out ${board.name}` }, ...prev])
    }
  }

  const checkInBoard = (boardId: number) => {
    const board = boards.find((b) => b.id === boardId)
    if (board) {
      setActivity((prev) => [{ time: 'Just now', text: `${board.outTo} checked in ${board.name}` }, ...prev])
    }
    setBoards((prev) =>
      prev.map((b) =>
        b.id === boardId ? { ...b, status: 'available', outTo: null, outSince: null, dueBack: null, isPastDue: false } : b,
      ),
    )
  }

  const addBoard = (input: NewBoardInput) => {
    setBoards((prev) => {
      const newId = Math.max(0, ...prev.map((b) => b.id)) + 1
      return [...prev, { id: newId, ...input, status: 'available', tint: '#3F6B5E', staffNotes: [] }]
    })
  }

  const toggleMemberStatus = (memberId: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m)),
    )
  }

  const extendMemberBilling = (memberId: number) => {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, nextBilling: addDays(m.nextBilling, 30) } : m)))
  }

  const signInAs = (memberName: string) => {
    setCurrentMemberView(memberName)
    setIsSignedIn(true)
  }

  const joinAsMember = (input: JoinInput) => {
    // 'Daily' is a non-membership, pay-per-rental account — not one of the paid TIERS.
    const tier = TIERS.find((t) => t.name === input.tier)
    setMembers((prev) => {
      const newId = Math.max(0, ...prev.map((m) => m.id)) + 1
      const newMember: Member = {
        id: newId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        tier: input.tier,
        status: 'active',
        paymentStatus: 'current',
        joined: 'Aug 2026',
        nextBilling: JOIN_NEXT_BILLING,
        amount: tier ? tier.price : 0,
        history: tier ? [{ date: 'Aug 30', desc: `${input.tier} membership — signup`, amount: tier.price, status: 'Paid' }] : [],
        rentalHistory: [],
        daysUsedThisMonth: 0,
        staffNotes: [],
      }
      setJoinSuccess(newMember)
      return [...prev, newMember]
    })
    // Creating an account signs you in as that account, same as the demo sign-in form.
    setCurrentMemberView(input.name)
    setIsSignedIn(true)
  }

  const addReview = (input: NewReviewInput) => {
    const board = boards.find((b) => b.name === input.board)
    setReviews((prev) => {
      const newId = Math.max(0, ...prev.map((r) => r.id)) + 1
      return [
        {
          id: newId,
          reviewer: currentMemberView,
          skill: input.skill,
          board: input.board,
          boardType: board ? board.type : '',
          rating: input.rating,
          text: input.text,
          date: 'Just now',
        },
        ...prev,
      ]
    })
  }

  const createReservation = (input: NewReservationInput): ReservationResult => {
    // One reservation per board per date — this is what actually prevents double-booking.
    const conflict = reservations.find((r) => r.boardId === input.boardId && r.date === input.date)
    if (conflict) {
      return {
        ok: false,
        reason: `${input.boardName} is already reserved for ${fmtISODate(input.date)} (by ${conflict.memberName}). Pick another date.`,
      }
    }

    setReservations((prev) => {
      const newId = Math.max(0, ...prev.map((r) => r.id)) + 1
      return [
        ...prev,
        { id: newId, boardId: input.boardId, boardName: input.boardName, memberName: currentMemberView, date: input.date, window: input.window },
      ]
    })
    // A confirmed reservation counts as a rental day against the member's monthly allowance.
    setMembers((prev) =>
      prev.map((m) => (m.name === currentMemberView ? { ...m, daysUsedThisMonth: m.daysUsedThisMonth + 1 } : m)),
    )
    return { ok: true }
  }

  const addMemberNote = (memberId: number, text: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m
        const newId = Math.max(0, ...m.staffNotes.map((n) => n.id)) + 1
        return { ...m, staffNotes: [{ id: newId, text, date: 'Just now' }, ...m.staffNotes] }
      }),
    )
  }

  const addBoardNote = (boardId: number, text: string) => {
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== boardId) return b
        const newId = Math.max(0, ...b.staffNotes.map((n) => n.id)) + 1
        return { ...b, staffNotes: [{ id: newId, text, date: 'Just now' }, ...b.staffNotes] }
      }),
    )
  }

  const sendClientMessage = (input: SendMessageInput) => {
    setMessageLog((prev) => {
      const newId = Math.max(0, ...prev.map((m) => m.id)) + 1
      return [{ id: newId, ...input, date: 'Just now' }, ...prev]
    })
  }

  const currentMember = members.find((m) => m.name === currentMemberView) ?? members[0]

  const value = useMemo<AppStateValue>(
    () => ({
      boards,
      members,
      reviews,
      activity,
      reservations,
      messageLog,
      rentalPricing: initialRentalPricing,
      currentMemberView,
      joinSuccess,
      isSignedIn,
      currentMember,
      checkOutBoard,
      checkInBoard,
      addBoard,
      toggleMemberStatus,
      extendMemberBilling,
      signInAs,
      joinAsMember,
      addReview,
      createReservation,
      addMemberNote,
      addBoardNote,
      sendClientMessage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boards, members, reviews, activity, reservations, messageLog, currentMemberView, joinSuccess, isSignedIn, currentMember],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
