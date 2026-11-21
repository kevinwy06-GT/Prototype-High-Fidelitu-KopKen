import React from 'react'
import { Clock, CheckCircle2, Coffee, MapPin, ShieldCheck, RotateCcw } from 'lucide-react'
import { formatRp, MENU_ITEMS } from '../data/mockData'
import { useApp } from '../context/AppContext'

const STAGES = [
  { id: 1, label: 'Diterima' },
  { id: 2, label: 'Diracik Barista' },
  { id: 3, label: 'Siap Diambil' },
]

export default function OrdersPage() {
  const { activeOrder, completeActiveOrder, orderHistory, addToCart, setCartOpen, setActiveTab } = useApp()

  function handleReorderHistory(order) {
    order.items.forEach((it) => {
      const menuObj = MENU_ITEMS.find((m) => m.id === it.menuId) || MENU_ITEMS[0]
      addToCart({
        key: `${menuObj.id}-${it.summary}`,
        menuId: menuObj.id,
        name: it.name,
        image: menuObj.image,
        summary: it.summary,
        unitPrice: it.unitPrice,
        qty: it.qty,
      })
    })
    setCartOpen(true)
  }

  return (
    <div className="px-4 pt-2 pb-24 space-y-5">
      <div>
        <h1 className="text-lg font-extrabold text-[#2B1B17]">Pesanan & Live Antrean</h1>
        <p className="text-xs text-[#6B5A53]">Pantau posisi antrean barista secara real-time</p>
      </div>

      {/* Active Order + Live Queue Card (Persona 2 Core Need) */}
      {activeOrder ? (
        <div className="rounded-3xl bg-white border-2 border-[#2B1B17] overflow-hidden shadow-md">
          <div className="bg-[#2B1B17] text-[#FAF7F2] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5C9A8]">
                {activeOrder.serviceType === 'pickup' ? 'Pick-up' : 'Delivery'} • {activeOrder.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold">
                {activeOrder.scheduleSlot === 'now' ? 'Ambil Sekarang' : `Jadwal ${activeOrder.scheduleSlot}`}
              </span>
            </div>
            <p className="text-xs text-[#D7C9BA] mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {activeOrder.outletName}
            </p>

            {/* Live Queue Big Numbers */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white/10">
                <p className="text-[10px] font-semibold text-[#E5C9A8] uppercase">Diproses Barista</p>
                <p className="text-2xl font-extrabold tabular-nums mt-0.5">
                  #{activeOrder.currentBaristaNumber}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#C83228]">
                <p className="text-[10px] font-semibold text-white/90 uppercase">Nomor Pesananmu</p>
                <p className="text-2xl font-extrabold tabular-nums mt-0.5">#{activeOrder.myQueueNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Stepper */}
            <div className="grid grid-cols-3 gap-2">
              {STAGES.map((st) => {
                const done = activeOrder.stage >= st.id
                return (
                  <div key={st.id} className="text-center">
                    <div
                      className={`h-2 rounded-full mb-1.5 transition-all ${
                        done ? 'bg-[#1E7E4E]' : 'bg-[#E7DFD5]'
                      }`}
                    />
                    <span className={`text-[11px] font-bold ${done ? 'text-[#2B1B17]' : 'text-[#9A8B82]'}`}>
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Verified Ready Status (Solves inaccurate "ready" complaint!) */}
            {activeOrder.stage === 3 ? (
              <div className="p-3.5 rounded-2xl bg-[#E6F4EC] border border-[#A7F3D0] text-[#065F46] space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-extrabold">Terverifikasi Barista — Benar-Benar Siap!</p>
                    <p className="text-[11px] mt-0.5">
                      Minuman sudah diletakkan di rak Pick-up. Tunjukkan kode{' '}
                      <strong className="font-mono text-sm">{activeOrder.pickupCode}</strong>.
                    </p>
                  </div>
                </div>
                <button
                  onClick={completeActiveOrder}
                  className="w-full min-h-[44px] rounded-xl bg-[#1E7E4E] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Tandai Sudah Diambil
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-[#2B1B17]">
                  <Clock className="w-4 h-4 text-[#C83228]" />
                  {activeOrder.stage === 2
                    ? 'Barista sedang meracik pesananmu!'
                    : `Sisa ${Math.max(1, activeOrder.myQueueNumber - activeOrder.currentBaristaNumber)} antrean di depanmu`}
                </span>
                <span className="font-extrabold text-[#C83228] tabular-nums">±{activeOrder.estMinutes} mnt</span>
              </div>
            )}

            {/* Items summary */}
            <div className="pt-2 border-t border-[#F3ECE3] space-y-1.5">
              {activeOrder.items.map((it) => (
                <div key={it.key} className="flex justify-between text-xs">
                  <span className="text-[#2B1B17] font-semibold">
                    {it.qty}x {it.name}
                  </span>
                  <span className="tabular-nums text-[#6B5A53]">{formatRp(it.unitPrice * it.qty)}</span>
                </div>
              ))}
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-xs text-[#1E7E4E] font-bold">
                  <span>Diskon Voucher</span>
                  <span className="tabular-nums">-{formatRp(activeOrder.discount)}</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-[#F3ECE3] flex justify-between text-xs font-extrabold text-[#2B1B17]">
                <span>Total Dibayar</span>
                <span className="tabular-nums text-[#C83228]">{formatRp(activeOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white border border-[#E7DFD5] text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#C83228] flex items-center justify-center mx-auto">
            <Coffee className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-[#2B1B17]">Belum ada pesanan aktif</h2>
          <p className="text-xs text-[#6B5A53]">
            Setelah kamu memesan, posisi antrean barista akan tampil live di sini.
          </p>
          <button
            onClick={() => setActiveTab('menu')}
            className="mt-2 min-h-[44px] px-5 rounded-xl bg-[#C83228] text-white text-xs font-bold"
          >
            Pesan Kopi Sekarang
          </button>
        </div>
      )}

      {/* Order History */}
      <section className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#2B1B17]">Riwayat Pesanan</h2>
        {orderHistory.map((h) => (
          <div key={h.id} className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2B1B17]">{h.outletName}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E6F4EC] text-[#1E7E4E] text-[10px] font-bold">
                {h.status}
              </span>
            </div>
            <p className="text-[11px] text-[#6B5A53]">{h.date}</p>
            <div className="text-xs text-[#2B1B17] space-y-0.5">
              {h.items.map((it, idx) => (
                <p key={idx} className="font-medium">
                  {it.qty}x {it.name}{' '}
                  <span className="text-[#6B5A53] text-[11px]">({it.summary})</span>
                </p>
              ))}
            </div>
            <div className="pt-2 border-t border-[#F3ECE3] flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-[#2B1B17] tabular-nums">{formatRp(h.total)}</p>
                <p className="text-[10px] text-[#D48A29] font-bold">+{h.pointsEarned} Poin</p>
              </div>
              <button
                onClick={() => handleReorderHistory(h)}
                className="min-h-[40px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#D7C9BA] text-xs font-bold text-[#2B1B17] flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C83228]" />
                Pesan Lagi
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
