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
  tier: string
  status: MemberStatus
  paymentStatus: PaymentStatus
  joined: string
  nextBilling: Date
  amount: number
  history: BillingHistoryEntry[]
  rentalHistory: RentalHistoryEntry[]
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
