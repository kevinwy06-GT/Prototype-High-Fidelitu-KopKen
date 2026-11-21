import React from 'react'
import { Home, Coffee, TicketPercent, ClipboardList, User, Wifi, Battery, Signal } from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV_ITEMS = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'menu', label: 'Menu', icon: Coffee },
  { id: 'promo', label: 'Promo', icon: TicketPercent },
  { id: 'orders', label: 'Pesanan', icon: ClipboardList },
  { id: 'member', label: 'Member', icon: User },
]

export default function MobileShell({ children }) {
  const { activeTab, setActiveTab, activeOrder, simpleMode, toast } = useApp()

  return (
    <div className="min-h-screen w-full flex items-center justify-center sm:py-4 sm:px-4">
      <div
        className={`relative w-full sm:w-[390px] h-screen sm:h-[min(844px,calc(100vh-32px))] bg-[#FAF7F2] sm:rounded-[38px] sm:shadow-[0_24px_70px_rgba(43,27,23,0.22)] sm:border-[6px] sm:border-[#2B1B17] flex flex-col overflow-hidden ${
          simpleMode ? 'simple-mode' : ''
        }`}
      >
        {/* Status Bar */}
        <div className="shrink-0 h-11 px-6 flex items-center justify-between bg-[#FAF7F2] text-[#2B1B17] text-xs font-semibold select-none z-20">
          <span className="tabular-nums">09:45</span>
          <div className="hidden sm:block w-24 h-5 bg-[#2B1B17] rounded-full" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">{children}</main>

        {/* Toast Notification (CH7 System Feedback) */}
        {toast && (
          <div className="absolute top-14 left-4 right-4 z-50 animate-fade-in pointer-events-none">
            <div
              className={`px-4 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center gap-2 ${
                toast.type === 'error'
                  ? 'bg-[#991B1B] text-white'
                  : toast.type === 'success'
                  ? 'bg-[#1E7E4E] text-white'
                  : 'bg-[#2B1B17] text-[#FAF7F2]'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Material Design 3 Bottom Navigation Bar (5 Tabs, >=48px touch targets) */}
        <nav
          aria-label="Navigasi utama"
          className="shrink-0 bg-white border-t border-[#E7DFD5] px-2 pt-1.5 pb-3 sm:pb-4 z-30"
        >
          <div className="grid grid-cols-5 gap-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              const showBadge = item.id === 'orders' && activeOrder
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83228] transition-colors"
                >
                  <div
                    className={`relative px-4 py-1 rounded-full transition-all ${
                      isActive ? 'bg-[#F8E2DF] text-[#C83228]' : 'text-[#6B5A53]'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.9} />
                    {showBadge && (
                      <span className="absolute -top-0.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#C83228] ring-2 ring-white animate-pulse" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] leading-tight ${
                      isActive ? 'font-bold text-[#2B1B17]' : 'font-medium text-[#6B5A53]'
                    }`}
                  >
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
