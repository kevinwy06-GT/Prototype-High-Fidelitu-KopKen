import React from 'react'
import { Coffee, TicketPercent, User, Wifi, Battery, Signal, ShoppingBag, ChevronUp, Clock } from 'lucide-react'
import { formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { id: 'order', label: 'Pesan', icon: Coffee },
  { id: 'promo', label: 'Promo', icon: TicketPercent },
  { id: 'me', label: 'Saya', icon: User },
]

export default function MobileShell({ children }) {
  const {
    activeTab,
    setActiveTab,
    cart,
    grandTotal,
    setCheckoutOpen,
    activeOrder,
    setQueueDrawerOpen,
    focusMode,
    toast,
    customizingItem,
    checkoutOpen,
  } = useApp()

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const hideFloating = Boolean(customizingItem || checkoutOpen)

  return (
    <div className="min-h-screen w-full flex items-center justify-center sm:py-4 sm:px-4">
      <div
        className={`relative w-full sm:w-[390px] h-screen sm:h-[min(844px,calc(100vh-32px))] bg-white sm:rounded-[40px] sm:shadow-[0_24px_70px_rgba(20,20,20,0.18)] sm:border-[6px] sm:border-[#141414] flex flex-col overflow-hidden ${
          focusMode ? 'focus-mode' : ''
        }`}
      >
        {/* Clean HIG Status Bar */}
        <div className="shrink-0 h-11 px-6 flex items-center justify-between bg-white text-[#141414] text-xs font-semibold select-none z-20">
          <span className="tabular-nums">09:45</span>
          <div className="hidden sm:block w-24 h-5 bg-[#141414] rounded-full" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative bg-white">{children}</main>

        {/* Toast */}
        {toast && (
          <div className="absolute top-14 left-4 right-4 z-50 animate-fade-in pointer-events-none">
            <div
              className={`px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold ${
                toast.type === 'error'
                  ? 'bg-[#B91C1C] text-white'
                  : toast.type === 'success'
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#141414] text-white'
              }`}
            >
              {toast.message}
            </div>
          </div>
        )}

        {/* Prototype 2 Signature: Floating Live Queue Pill & Floating Cart Bar */}
        {!hideFloating && (activeOrder || totalItems > 0) && (
          <div className="absolute bottom-[78px] left-4 right-4 z-30 space-y-2">
            {activeOrder && (
              <button
                onClick={() => setQueueDrawerOpen(true)}
                className="w-full min-h-[50px] px-4 py-2.5 rounded-2xl bg-[#141414] text-white shadow-lg flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      activeOrder.stage === 3 ? 'bg-[#4ADE80]' : 'bg-[#FACC15] animate-pulse'
                    }`}
                  />
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold truncate tabular-nums">
                      {activeOrder.stage === 3
                        ? `Siap Diambil • Kode ${activeOrder.pickupCode}`
                        : `Barista #${activeOrder.currentBaristaNumber} → Kamu #${activeOrder.myQueueNumber}`}
                    </p>
                    <p className="text-[10px] text-[#D1D5DB] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeOrder.stage === 3
                        ? 'Terverifikasi siap di counter'
                        : `Estimasi ±${activeOrder.estMinutes} menit • Ketuk lihat detail`}
                    </p>
                  </div>
                </div>
                <ChevronUp className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              </button>
            )}

            {totalItems > 0 && (
              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full min-h-[52px] px-4 rounded-2xl bg-[#D62828] hover:bg-[#B91C1C] text-white shadow-lg flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-bold tabular-nums">{totalItems} item</span>
                  <span className="text-xs text-white/80">• Checkout</span>
                </div>
                <span className="text-sm font-extrabold tabular-nums">{formatRp(grandTotal)}</span>
              </button>
            )}
          </div>
        )}

        {/* Streamlined 3-Tab HIG Bottom Navigation */}
        <nav
          aria-label="Navigasi utama"
          className="shrink-0 bg-white/95 backdrop-blur border-t border-[#E5E7EB] px-6 pt-2 pb-3 sm:pb-4 z-30"
        >
          <div className="grid grid-cols-3 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`min-h-[48px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? 'text-[#D62828]' : 'text-[#6B7280]'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className={`text-[11px] ${isActive ? 'font-bold text-[#141414]' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
