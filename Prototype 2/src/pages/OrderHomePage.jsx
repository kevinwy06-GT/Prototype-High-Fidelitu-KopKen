import React, { useState } from 'react'
import {
  MapPin,
  ChevronDown,
  QrCode,
  RotateCcw,
  Clock,
  Search,
  TicketPercent,
  Plus,
  AlertCircle,
  Users,
  Video,
} from 'lucide-react'
import { MENU_ITEMS, SCHEDULE_SLOTS, formatRp, getSpace } from '../data/mockData'
import SpaceBadge from '../components/SpaceBadge'
import { useApp } from '../context/AppContext'

const CATEGORIES = ['Semua', 'Kopi', 'Non-Kopi', 'Pastry']

export default function OrderHomePage() {
  const {
    selectedOutlet,
    setOutletModalOpen,
    setCameraOutletId,
    serviceType,
    setServiceType,
    scheduleSlot,
    setScheduleSlot,
    setScanModalOpen,
    regularOrders,
    reorderRegular,
    setCustomizingItem,
    setActiveTab,
    points,
    focusMode,
  } = useApp()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua')
  const [showScheduleBar, setShowScheduleBar] = useState(false)

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = category === 'Semua' || item.category === category
    const matchQ =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  const activeSlotLabel = SCHEDULE_SLOTS.find((s) => s.id === scheduleSlot)?.label || 'Ambil Sekarang'

  const selectedSpace = getSpace(selectedOutlet)

  return (
    <div className="px-4 pt-2 pb-36 space-y-4">
      {/* Minimalist Top Bar: Outlet + Service Type */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => setOutletModalOpen(true)}
          className="flex-1 min-w-0 py-1.5 text-left group"
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#D62828] shrink-0" />
            <span className="font-extrabold text-sm text-[#141414] truncate">
              {selectedOutlet.name.replace('Kopi Kenangan ', '')}
            </span>
            <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
          </div>
          <div className="flex items-center gap-2 mt-0.5 pl-5 text-[11px] text-[#6B7280]">
            <span className="font-semibold text-[#141414] tabular-nums">{selectedOutlet.distance}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {selectedOutlet.crowd} (±{selectedOutlet.estMinutes} mnt)
            </span>
          </div>
        </button>

        {/* Compact Segmented Service Switch */}
        <div className="shrink-0 flex bg-[#F3F4F6] p-1 rounded-full">
          <button
            onClick={() => setServiceType('pickup')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
              serviceType === 'pickup' ? 'bg-[#141414] text-white' : 'text-[#6B7280]'
            }`}
          >
            Pick-up
          </button>
          <button
            onClick={() => setServiceType('delivery')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
              serviceType === 'delivery' ? 'bg-[#141414] text-white' : 'text-[#6B7280]'
            }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {selectedSpace && (
        <button
          onClick={() => setCameraOutletId(selectedOutlet.id)}
          className="w-full -mt-2 flex items-center justify-between gap-2 py-1 active:opacity-70"
        >
          <SpaceBadge outlet={selectedOutlet} />
          <span className="text-[11px] font-bold text-[#D62828] flex items-center gap-1 shrink-0">
            <Video className="w-3.5 h-3.5" /> Lihat kamera
          </span>
        </button>
      )}

      {/* Quick Action Strip (Scan Member + 1-Tap Regular + Schedule) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setScanModalOpen(true)}
          className="min-h-[44px] px-3.5 rounded-2xl bg-[#141414] text-white text-xs font-bold flex items-center gap-2 shrink-0"
        >
          <QrCode className="w-4 h-4 text-[#FACC15]" />
          Scan Member ({points} pt)
        </button>

        {regularOrders.length > 0 && (
          <button
            onClick={() => reorderRegular(regularOrders[0])}
            className="min-h-[44px] px-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Pesan Reguler (1-Tap)
          </button>
        )}

        {serviceType === 'pickup' && (
          <button
            onClick={() => setShowScheduleBar((v) => !v)}
            className={`min-h-[44px] px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 shrink-0 ${
              scheduleSlot !== 'now'
                ? 'bg-[#EFF6FF] border-[#93C5FD] text-[#1D4ED8]'
                : 'bg-[#F6F6F7] border-[#E5E7EB] text-[#141414]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {activeSlotLabel}
          </button>
        )}
      </div>

      {/* Expandable Inline Schedule Picker */}
      {showScheduleBar && serviceType === 'pickup' && (
        <div className="p-3 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] grid grid-cols-2 gap-2 animate-fade-in">
          {SCHEDULE_SLOTS.map((slot) => (
            <button
              key={slot.id}
              onClick={() => {
                setScheduleSlot(slot.id)
                setShowScheduleBar(false)
              }}
              className={`min-h-[42px] px-3 py-2 rounded-xl text-left text-xs font-bold border ${
                scheduleSlot === slot.id
                  ? 'bg-[#141414] text-white border-[#141414]'
                  : 'bg-white text-[#141414] border-[#E5E7EB]'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      )}

      {/* Focus Mode Highlight Card for Regular Order (Persona 3) */}
      {focusMode && regularOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border-2 border-[#141414] space-y-2">
          <p className="text-xs font-extrabold text-[#D62828] uppercase">Pesanan Langganan Anda</p>
          <p className="font-extrabold text-base text-[#141414]">{regularOrders[0].name}</p>
          <p className="text-xs text-[#6B7280]">
            {regularOrders[0].size} • {regularOrders[0].ice} • {regularOrders[0].sugar} •{' '}
            {regularOrders[0].toppings?.join(', ')}
          </p>
          <button
            onClick={() => reorderRegular(regularOrders[0])}
            className="w-full min-h-[48px] rounded-xl bg-[#D62828] text-white font-bold text-sm mt-1"
          >
            Pesan Sekarang — {formatRp(regularOrders[0].unitPrice)}
          </button>
        </div>
      )}

      {/* Compact Promo Banner Strip */}
      <button
        onClick={() => setActiveTab('promo')}
        className="w-full px-3.5 py-3 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2.5">
          <TicketPercent className="w-5 h-5 text-[#D62828] shrink-0" />
          <div>
            <p className="text-xs font-extrabold text-[#141414]">Diskon 30% Pick-up & 4 Voucher Lainnya</p>
            <p className="text-[11px] text-[#6B7280]">Otomatis disarankan saat checkout</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#D62828] shrink-0">Lihat</span>
      </button>

      {/* Search & Category Tabs (Direct-to-Menu) */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu kopi atau pastry..."
            className="w-full min-h-[46px] pl-10 pr-4 rounded-2xl bg-[#F6F6F7] border border-transparent focus:border-[#141414] focus:bg-white text-sm text-[#141414] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = category === cat
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`min-h-[38px] px-4 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  active ? 'bg-[#141414] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Editorial Clean Menu List */}
      <div className="divide-y divide-[#F3F4F6]">
        {filtered.map((item) => {
          const isOut = selectedOutlet.outOfStockIds.includes(item.id)
          return (
            <div
              key={item.id}
              className={`py-3.5 flex items-center gap-3.5 ${isOut ? 'opacity-65' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-sm text-[#141414]">{item.name}</h3>
                  {isOut ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold">
                      <AlertCircle className="w-3 h-3" /> Habis
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280] line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                <p className="font-extrabold text-sm text-[#141414] mt-2 tabular-nums">{formatRp(item.price)}</p>
              </div>

              <div className="relative shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-24 h-24 rounded-2xl object-cover bg-[#F3F4F6] ${isOut ? 'grayscale' : ''}`}
                />
                <button
                  disabled={isOut}
                  onClick={() => setCustomizingItem(item)}
                  aria-label={`Tambah ${item.name}`}
                  className={`absolute -bottom-2 right-2 min-w-[40px] min-h-[40px] px-3 rounded-full shadow-md flex items-center justify-center gap-1 text-xs font-bold transition-transform ${
                    isOut
                      ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                      : 'bg-white border border-[#E5E7EB] text-[#D62828] active:scale-95'
                  }`}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} />
                  {!isOut && 'Pilih'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
