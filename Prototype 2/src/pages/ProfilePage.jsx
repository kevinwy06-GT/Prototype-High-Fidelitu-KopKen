import React from 'react'
import { QrCode, Eye, RotateCcw, Heart, Gift, History } from 'lucide-react'
import { formatRp, MENU_ITEMS } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function ProfilePage() {
  const {
    points,
    setScanModalOpen,
    focusMode,
    setFocusMode,
    regularOrders,
    reorderRegular,
    orderHistory,
    addToCart,
    setCheckoutOpen,
  } = useApp()

  function handleReorderHistory(order) {
    order.items.forEach((it) => {
      const m = MENU_ITEMS.find((x) => x.id === it.menuId) || MENU_ITEMS[0]
      addToCart({
        key: `${m.id}-${it.summary}`,
        menuId: m.id,
        name: it.name,
        image: m.image,
        summary: it.summary,
        unitPrice: it.unitPrice,
        qty: it.qty,
      })
    })
    setCheckoutOpen(true)
  }

  return (
    <div className="px-4 pt-2 pb-36 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#141414]">Saya</h1>
          <p className="text-xs text-[#6B7280]">Kevin William • 0812-3456-7890</p>
        </div>
        <button
          onClick={() => setScanModalOpen(true)}
          className="min-h-[44px] px-4 rounded-2xl bg-[#141414] text-white text-xs font-bold flex items-center gap-2"
        >
          <QrCode className="w-4 h-4 text-[#FACC15]" />
          QR Member
        </button>
      </div>

      {/* Points Progress */}
      <div className="p-4 rounded-2xl bg-[#F6F6F7] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#141414] flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#D62828]" /> Kenangan Points
          </span>
          <span className="text-sm font-extrabold text-[#141414] tabular-nums">{points} / 200 pt</span>
        </div>
        <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#D62828]"
            style={{ width: `${Math.min(100, Math.round((points / 200) * 100))}%` }}
          />
        </div>
        <p className="text-[11px] text-[#6B7280]">
          {Math.max(0, 200 - points)} poin lagi menuju <strong>Gratis 1 Minuman</strong>.
        </p>
      </div>

      {/* Focus / Large Text Mode Toggle (Persona 3) */}
      <div className="p-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F6F6F7] flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-[#141414]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#141414]">Mode Fokus & Teks Besar</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Perbesar ukuran tulisan dan tampilkan kartu Pesanan Reguler di atas halaman Pesan.
            </p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={focusMode}
          onClick={() => setFocusMode(!focusMode)}
          className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${
            focusMode ? 'bg-[#15803D]' : 'bg-[#D1D5DB]'
          }`}
        >
          <span
            className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
              focusMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Regular Orders */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-extrabold text-[#141414] flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-[#D62828]" /> Pesanan Reguler Tersimpan
        </h2>
        {regularOrders.map((reg) => (
          <div key={reg.id} className="p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center gap-3">
            <img src={reg.image} alt={reg.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-[#141414] truncate">{reg.name}</p>
              <p className="text-[11px] text-[#6B7280] line-clamp-2">
                {reg.size} • {reg.ice} • {reg.sugar}
                {reg.toppings?.length ? ` • ${reg.toppings.join(', ')}` : ''}
              </p>
              <p className="text-xs font-bold text-[#D62828] tabular-nums mt-0.5">{formatRp(reg.unitPrice)}</p>
            </div>
            <button
              onClick={() => reorderRegular(reg)}
              className="min-h-[42px] px-3.5 rounded-xl bg-[#141414] text-white text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Pesan
            </button>
          </div>
        ))}
      </section>

      {/* History */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-extrabold text-[#141414] flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#6B7280]" /> Riwayat Pesanan
        </h2>
        {orderHistory.map((h) => (
          <div key={h.id} className="p-3.5 rounded-2xl border border-[#E5E7EB] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#141414]">{h.outletName}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                {h.status}
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">{h.date}</p>
            {h.items.map((it, idx) => (
              <p key={idx} className="text-xs text-[#141414]">
                {it.qty}x {it.name} <span className="text-[#6B7280] text-[11px]">({it.summary})</span>
              </p>
            ))}
            <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#141414] tabular-nums">{formatRp(h.total)}</span>
              <button
                onClick={() => handleReorderHistory(h)}
                className="min-h-[38px] px-3 rounded-xl bg-[#F3F4F6] text-xs font-bold text-[#141414] flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D62828]" /> Pesan Lagi
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
