import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import MobileShell from './components/MobileShell'
import OutletSheet from './components/OutletSheet'
import CustomizeSheet from './components/CustomizeSheet'
import VoucherSheet from './components/VoucherSheet'
import ScanMemberModal from './components/ScanMemberModal'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import PromoPage from './pages/PromoPage'
import CartCheckoutPage from './pages/CartCheckoutPage'
import OrdersPage from './pages/OrdersPage'
import MemberPage from './pages/MemberPage'

function AppContent() {
  const { activeTab } = useApp()

  return (
    <MobileShell>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'menu' && <MenuPage />}
      {activeTab === 'promo' && <PromoPage />}
      {activeTab === 'orders' && <OrdersPage />}
      {activeTab === 'member' && <MemberPage />}

      {/* Overlays & M3 Bottom Sheets */}
      <CartCheckoutPage />
      <OutletSheet />
      <CustomizeSheet />
      <VoucherSheet />
      <ScanMemberModal />
    </MobileShell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
