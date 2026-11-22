import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import MobileShell from './components/MobileShell'
import OutletModal from './components/OutletModal'
import CameraModal from './components/CameraModal'
import QueueDrawer from './components/QueueDrawer'
import ScanMemberModal from './components/ScanMemberModal'
import OrderHomePage from './pages/OrderHomePage'
import CustomizePage from './pages/CustomizePage'
import PromoPage from './pages/PromoPage'
import CheckoutPage from './pages/CheckoutPage'
import ProfilePage from './pages/ProfilePage'

function AppContent() {
  const { activeTab } = useApp()

  return (
    <MobileShell>
      {activeTab === 'order' && <OrderHomePage />}
      {activeTab === 'promo' && <PromoPage />}
      {activeTab === 'me' && <ProfilePage />}

      {/* Dedicated Full-Screen Flows & Drawers */}
      <CustomizePage />
      <CheckoutPage />
      <OutletModal />
      <CameraModal />
      <QueueDrawer />
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
