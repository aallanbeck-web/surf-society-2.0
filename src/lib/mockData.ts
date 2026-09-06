import { addDays } from './format'
import type { Board, Member, Review, ActivityEntry, Tier, Slide, RentalPricing } from './types'

/**
 * All mock data below is in-memory only and resets on page refresh.
 * See README.md — Phase 2 replaces this with Supabase Postgres + Storage.
 */

export const initialRentalPricing: RentalPricing = { hourly: 15, daily: 45, weekly: 180 }

export const initialBoards: Board[] = [
  { id: 1, name: 'Blue Hibiscus', brand: 'Album', type: 'Shortboard', size: "5'10\"", condition: 'Excellent', status: 'available', photo: null, tint: '#3F6B5E' },
  { id: 2, name: 'Mid Tide', brand: 'CJ Nelson', type: 'Midlength', size: "7'2\"", condition: 'Good', status: 'out', outTo: 'Priya Nair', outSince: 'Today, 9:12 AM', photo: null, tint: '#B8801F' },
  { id: 3, name: 'Old Faithful', brand: 'Takayama', type: 'Longboard', size: "9'0\"", condition: 'Good', status: 'available', photo: null, tint: '#1C3B44' },
  { id: 4, name: 'Foam Runner', brand: 'Catch Surf', type: 'Soft-top', size: "6'0\"", condition: 'Fair', status: 'available', photo: null, tint: '#B0432E' },
  { id: 5, name: 'Twin Fin 68', brand: 'Lost', type: 'Fish', size: "5'8\"", condition: 'Excellent', status: 'out', outTo: 'Marcus Ito', outSince: 'Yesterday, 4:40 PM', photo: null, tint: '#3F6B5E' },
  { id: 6, name: 'Shores Special', brand: 'Channel Islands', type: 'Shortboard', size: "6'1\"", condition: 'Excellent', status: 'available', photo: null, tint: '#0E2A32' },
]

export const initialMembers: Member[] = [
  {
    id: 1, name: 'Priya Nair', email: 'priya@example.com', tier: 'Local', status: 'active', paymentStatus: 'current', joined: 'Feb 2025', nextBilling: new Date(2026, 8, 4), amount: 129,
    history: [
      { date: 'Aug 4', desc: 'Local membership — monthly', amount: 129, status: 'Paid' },
      { date: 'Jul 4', desc: 'Local membership — monthly', amount: 129, status: 'Paid' },
    ],
    rentalHistory: [
      { board: 'Mid Tide', checkedOut: 'Today, 9:12 AM', returned: '—' },
      { board: 'Old Faithful', checkedOut: 'Aug 21', returned: 'Aug 23' },
      { board: 'Blue Hibiscus', checkedOut: 'Aug 9', returned: 'Aug 9' },
    ],
  },
  {
    id: 2, name: 'Marcus Ito', email: 'marcus@example.com', tier: 'Society', status: 'active', paymentStatus: 'current', joined: 'Nov 2024', nextBilling: new Date(2026, 8, 11), amount: 249,
    history: [
      { date: 'Aug 11', desc: 'Society membership — monthly', amount: 249, status: 'Paid' },
      { date: 'Aug 2', desc: 'Guest pass add-on', amount: 20, status: 'Paid' },
    ],
    rentalHistory: [
      { board: 'Twin Fin 68', checkedOut: 'Yesterday, 4:40 PM', returned: '—' },
      { board: 'Shores Special', checkedOut: 'Aug 18', returned: 'Aug 19' },
      { board: 'Foam Runner', checkedOut: 'Aug 5', returned: 'Aug 5' },
    ],
  },
  {
    id: 3, name: 'Dana Whitfield', email: 'dana@example.com', tier: 'Swell', status: 'inactive', paymentStatus: 'past_due', joined: 'May 2025', nextBilling: new Date(2026, 5, 2), amount: 59,
    history: [{ date: 'Jun 2', desc: 'Swell membership — monthly', amount: 59, status: 'Paid' }],
    rentalHistory: [{ board: 'Foam Runner', checkedOut: 'May 30', returned: 'Jun 1' }],
  },
  {
    id: 4, name: 'Ollie Reyes', email: 'ollie@example.com', tier: 'Local', status: 'active', paymentStatus: 'past_due', joined: 'Jan 2025', nextBilling: new Date(2026, 8, 2), amount: 129,
    history: [{ date: 'Aug 2', desc: 'Local membership — monthly', amount: 129, status: 'Failed' }],
    rentalHistory: [
      { board: 'Old Faithful', checkedOut: 'Yesterday, 1:05 PM', returned: 'Yesterday, 1:05 PM' },
      { board: 'Old Faithful', checkedOut: 'Aug 14', returned: 'Aug 16' },
    ],
  },
]

export const initialReviews: Review[] = [
  { id: 1, reviewer: 'Priya Nair', skill: 'Intermediate', board: 'Mid Tide', boardType: 'Midlength', rating: 5, text: "Paddles easy and still turns fine in the pocket. Great bridge board if you're moving off a longboard.", date: 'Aug 22' },
  { id: 2, reviewer: 'Marcus Ito', skill: 'Advanced', board: 'Twin Fin 68', boardType: 'Fish', rating: 4, text: 'Fast and loose in small stuff, but you need to be on your front foot or it slides out.', date: 'Aug 19' },
  { id: 3, reviewer: 'Ollie Reyes', skill: 'Beginner', board: 'Old Faithful', boardType: 'Longboard', rating: 5, text: "This is the one to grab if you've rented twice before. Stable enough that I actually stood up.", date: 'Aug 15' },
]

export const initialActivity: ActivityEntry[] = [
  { time: '9:12 AM', text: 'Priya Nair checked out Mid Tide' },
  { time: 'Yesterday · 4:40 PM', text: 'Marcus Ito checked out Twin Fin 68' },
  { time: 'Yesterday · 1:05 PM', text: 'Ollie Reyes checked in Old Faithful' },
]

export const SLIDES: Slide[] = [
  { tint: '#3F6B5E', tag: 'New in the quiver', name: "Blue Hibiscus — Album 5'10\"" },
  { tint: '#1C3B44', tag: 'Most booked this month', name: "Old Faithful — Takayama 9'0\"" },
  { tint: '#0E2A32', tag: 'Most booked this month', name: "Shores Special — Channel Islands 6'1\"" },
  { tint: '#B8801F', tag: 'New in the quiver', name: "Mid Tide — CJ Nelson 7'2\"" },
]

export const TIERS: Tier[] = [
  {
    name: 'Swell', price: 59, desc: 'For the occasional dawn patrol.', featured: false,
    perks: ['2 rental days included / month', '15% off additional rental days', 'Standard quiver access', 'Book online, no wait list'],
  },
  {
    name: 'Local', price: 129, desc: 'For people who surf most weeks.', featured: true,
    perks: ['6 rental days included / month', 'Priority pickup windows', 'Full quiver, including longboards', '1 guest pass / month'],
  },
  {
    name: 'Society', price: 249, desc: 'For the board-a-day crowd.', featured: false,
    perks: ['Unlimited rental days', 'First pick of new boards', '3 guest passes / month', 'Free wax, traction pad & storage locker'],
  },
]

// Used only when a new member joins via the Join flow (mirrors the sandbox's fixed demo date).
export const JOIN_NEXT_BILLING = addDays(new Date(2026, 7, 30), 30)
