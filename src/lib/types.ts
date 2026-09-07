export type BoardStatus = 'available' | 'out'

export interface Board {
  id: number
  name: string
  brand: string
  type: string
  size: string
  condition: string
  status: BoardStatus
  photo: string | null
  tint: string
  outTo?: string | null
  outSince?: string | null
  /** Friendly display string for when this board is expected back, e.g. "Today, 6:00 PM". Only set while checked out. */
  dueBack?: string | null
  /** True when a checked-out board is past its expected return. */
  isPastDue?: boolean
  /** Staff-only notes about this board — condition flags, damage reports, etc. */
  staffNotes: Note[]
}

/** A single timestamped staff annotation — reused for both member and board notes. */
export interface Note {
  id: number
  text: string
  date: string
}

export type MemberStatus = 'active' | 'inactive'
export type PaymentStatus = 'current' | 'past_due'

export interface BillingHistoryEntry {
  date: string
  desc: string
  amount: number
  status: string
}

export interface RentalHistoryEntry {
  board: string
  checkedOut: string
  returned: string
}

export interface Member {
  id: number
  name: string
  email: string
  phone: string
  /** Tier name (Swell/Local/Society), or 'Daily' for a non-membership pay-per-rental account. */
  tier: string
  status: MemberStatus
  paymentStatus: PaymentStatus
  joined: string
  nextBilling: Date
  amount: number
  history: BillingHistoryEntry[]
  rentalHistory: RentalHistoryEntry[]
  /** Rental days used against this month's included allowance (resets each billing cycle). Not applicable to Daily accounts. */
  daysUsedThisMonth: number
  /** Staff-only notes about this customer. */
  staffNotes: Note[]
}

export interface Review {
  id: number
  reviewer: string
  skill: string
  board: string
  boardType: string
  rating: number
  text: string
  date: string
}

export interface ActivityEntry {
  time: string
  text: string
}

export interface Tier {
  name: string
  price: number
  desc: string
  featured: boolean
  perks: string[]
  /** Rental days included per month, or null for unlimited (Society tier). */
  includedDaysPerMonth: number | null
}

export interface Slide {
  tint: string
  tag: string
  name: string
}

export interface RentalPricing {
  hourly: number
  daily: number
  weekly: number
}

export interface SentMessage {
  id: number
  memberName: string
  channel: 'email' | 'text'
  destination: string
  subject: string
  body: string
  date: string
}

export interface Reservation {
  id: number
  boardId: number
  boardName: string
  memberName: string
  /** `YYYY-MM-DD`, matches `<input type="date">` values — one reservation per board per date. */
  date: string
  /** e.g. "8:00 – 10:00 AM" */
  window: string
}
