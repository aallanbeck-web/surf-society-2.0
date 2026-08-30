import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { AppStateProvider } from './state/AppState'

import Home from './pages/customer/Home'
import Rentals from './pages/customer/Rentals'
import Membership from './pages/customer/Membership'
import Reviews from './pages/customer/Reviews'
import Join from './pages/customer/Join'
import Account from './pages/customer/Account'

import BoardWall from './pages/staff/BoardWall'
import MemberCheckIn from './pages/staff/MemberCheckIn'

import Inventory from './pages/admin/Inventory'
import Members from './pages/admin/Members'

function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="rentals" element={<Rentals />} />
            <Route path="membership" element={<Membership />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="join" element={<Join />} />
            <Route path="account" element={<Account />} />

            <Route path="staff/board-wall" element={<BoardWall />} />
            <Route path="staff/check-in" element={<MemberCheckIn />} />

            <Route path="admin/inventory" element={<Inventory />} />
            <Route path="admin/members" element={<Members />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  )
}

export default App
