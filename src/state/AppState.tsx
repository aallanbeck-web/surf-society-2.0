import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Board, Member, Review, ActivityEntry } from '../lib/types'
import { addDays } from '../lib/format'
import {
  initialBoards,
  initialMembers,
  initialReviews,
  initialActivity,
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
  tier: string
}

interface AppStateValue {
  // data
  boards: Board[]
  members: Member[]
  reviews: Review[]
  activity: ActivityEntry[]
  rentalPricing: typeof initialRentalPricing
  currentMemberView: string
  joinSuccess: Member | null

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
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(initialBoards)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [activity, setActivity] = useState<ActivityEntry[]>(initialActivity)
  const [currentMemberView, setCurrentMemberView] = useState('Priya Nair')
  const [joinSuccess, setJoinSuccess] = useState<Member | null>(null)

  const checkOutBoard = (boardId: number, memberName: string) => {
    setBoards((prev) =>
      prev.map((b) => (b.id === boardId ? { ...b, status: 'out', outTo: memberName, outSince: 'Just now' } : b)),
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
    setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, status: 'available', outTo: null, outSince: null } : b)))
  }

  const addBoard = (input: NewBoardInput) => {
    setBoards((prev) => {
      const newId = Math.max(0, ...prev.map((b) => b.id)) + 1
      return [...prev, { id: newId, ...input, status: 'available', tint: '#3F6B5E' }]
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
  }

  const joinAsMember = (input: JoinInput) => {
    const tier = TIERS.find((t) => t.name === input.tier)!
    setMembers((prev) => {
      const newId = Math.max(0, ...prev.map((m) => m.id)) + 1
      const newMember: Member = {
        id: newId,
        name: input.name,
        email: input.email,
        tier: input.tier,
        status: 'active',
        paymentStatus: 'current',
        joined: 'Aug 2026',
        nextBilling: JOIN_NEXT_BILLING,
        amount: tier.price,
        history: [{ date: 'Aug 30', desc: `${input.tier} membership — signup`, amount: tier.price, status: 'Paid' }],
        rentalHistory: [],
      }
      setJoinSuccess(newMember)
      return [...prev, newMember]
    })
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

  const currentMember = members.find((m) => m.name === currentMemberView) ?? members[0]

  const value = useMemo<AppStateValue>(
    () => ({
      boards,
      members,
      reviews,
      activity,
      rentalPricing: initialRentalPricing,
      currentMemberView,
      joinSuccess,
      currentMember,
      checkOutBoard,
      checkInBoard,
      addBoard,
      toggleMemberStatus,
      extendMemberBilling,
      signInAs,
      joinAsMember,
      addReview,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [boards, members, reviews, activity, currentMemberView, joinSuccess, currentMember],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
