import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

type Role = 'customer' | 'staff' | 'admin'

function roleFromPath(pathname: string): Role {
  if (pathname.startsWith('/staff')) return 'staff'
  if (pathname.startsWith('/admin')) return 'admin'
  return 'customer'
}

const ROLE_HOME: Record<Role, string> = {
  customer: '/',
  staff: '/staff/board-wall',
  admin: '/admin/inventory',
}

const CUSTOMER_TABS = [
  ['/', 'Home'],
  ['/rentals', 'Daily Rentals'],
  ['/membership', 'Membership'],
  ['/reviews', 'Reviews'],
  ['/join', 'Join'],
  ['/account', 'My Account'],
] as const

const STAFF_TABS = [
  ['/staff/board-wall', 'Board Wall'],
  ['/staff/check-in', 'Member Check-In'],
] as const

const ADMIN_TABS = [
  ['/admin/inventory', 'Inventory'],
  ['/admin/members', 'Members & Billing'],
] as const

function subnavClass(active: boolean) {
  return active
    ? 'border border-transparent bg-ink text-paper px-3.5 py-[7px] rounded-full text-[13.5px] font-medium'
    : 'border border-transparent hover:border-line-strong text-ink-soft px-3.5 py-[7px] rounded-full text-[13.5px] font-medium'
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = roleFromPath(location.pathname)
  const tabs = role === 'customer' ? CUSTOMER_TABS : role === 'staff' ? STAFF_TABS : ADMIN_TABS

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-8 py-4 bg-ink text-paper flex-wrap gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif font-semibold text-[19px]">Surf Society</span>
          <span className="text-[11px] text-gold border border-gold/50 px-2 py-0.5 rounded-full">Sandbox</span>
        </div>
        <div className="flex gap-1 bg-white/[0.08] p-1 rounded-[10px]">
          {(['customer', 'staff', 'admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => navigate(ROLE_HOME[r])}
              className={
                r === role
                  ? 'border-none bg-paper text-ink px-4 py-2 rounded-[7px] text-[13.5px] font-medium opacity-100'
                  : 'border-none bg-transparent text-paper px-4 py-2 rounded-[7px] text-[13.5px] font-medium opacity-65 hover:opacity-90'
              }
            >
              {r === 'customer' ? 'Customer' : r === 'staff' ? 'Staff' : 'Admin'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 px-8 py-3.5 border-b border-line bg-paper-dim flex-wrap">
        {tabs.map(([path, label]) => (
          <NavLink key={path} to={path} end className={({ isActive }) => subnavClass(isActive)}>
            {label}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 px-8 pt-10 pb-20 max-w-[1180px] w-full mx-auto">
        <Outlet />
      </main>

      <footer className="px-8 py-5 border-t border-line text-xs text-ink-soft text-center">
        Sandbox build for internal review — no real bookings, payments, or accounts are processed here.
      </footer>
    </div>
  )
}
