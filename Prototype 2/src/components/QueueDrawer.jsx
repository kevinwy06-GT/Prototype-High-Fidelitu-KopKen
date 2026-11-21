import React from 'react'
import { X, ShieldCheck, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function QueueDrawer() {
  const { queueDrawerOpen, setQueueDrawerOpen, activeOrder, completeActiveOrder } = useApp()

  if (!queueDrawerOpen || !activeOrder) return null

  const progressPct = activeOrder.stage === 3 ? 100 : activeOrder.stage === 2 ? 75 : 40

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[85%] flex flex-col animate-slide-up overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D62828]">
              Live Queue Tracker • {activeOrder.id}
            </p>
            <h2 className="text-base font-extrabold text-[#141414]">Status Pesanan Real-Time</h2>
          </div>
          <button
            onClick={() => setQueueDrawerOpen(false)}
            aria-label="Tutup"
            className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
          {/* Big Minimalist Queue Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#F6F6F7] border border-[#E5E7EB] text-center">
              <p className="text-[11px] font-semibold text-[#6B7280]">Barista Memproses</p>
              <p className="text-3xl font-extrabold text-[#141414] tabular-nums mt-1">
                #{activeOrder.currentBaristaNumber}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#141414] text-white text-center">
              <p className="text-[11px] font-semibold text-[#D1D5DB]">Pesananmu</p>
              <p className="text-3xl font-extrabold text-white tabular-nums mt-1">#{activeOrder.myQueueNumber}</p>
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div>
            <div className="h-2.5 rounded-full bg-[#F3F4F6] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  activeOrder.stage === 3 ? 'bg-[#15803D]' : 'bg-[#D62828]'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-[#6B7280] mt-2">
              <span className={activeOrder.stage >= 1 ? 'text-[#141414]' : ''}>Diterima</span>
              <span className={activeOrder.stage >= 2 ? 'text-[#141414]' : ''}>Diracik</span>
              <span className={activeOrder.stage >= 3 ? 'text-[#15803D]' : ''}>Siap Diambil</span>
            </div>
          </div>

          {/* Status Banner */}
          {activeOrder.stage === 3 ? (
            <div className="p-4 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-extrabold">Terverifikasi Barista — Siap Diambil!</p>
                  <p className="text-xs mt-0.5">
                    Pesanan sudah di rak Pick-up. Tunjukkan kode{' '}
                    <strong className="font-mono text-sm">{activeOrder.pickupCode}</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={completeActiveOrder}
                className="w-full min-h-[48px] rounded-xl bg-[#15803D] text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Konfirmasi Sudah Diambil
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#F6F6F7] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#141414] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#D62828]" />
                {activeOrder.stage === 2
                  ? 'Minumanmu sedang diracik sekarang'
                  : `Tersisa ${Math.max(1, activeOrder.myQueueNumber - activeOrder.currentBaristaNumber)} antrean lagi`}
              </span>
              <span className="font-extrabold text-[#D62828] tabular-nums">±{activeOrder.estMinutes} mnt</span>
            </div>
          )}

          {/* Outlet & Items */}
          <div className="p-4 rounded-2xl border border-[#E5E7EB] space-y-2.5 text-xs">
            <p className="font-bold text-[#141414] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D62828]" />
              {activeOrder.outletName}
            </p>
            <div className="pt-2 border-t border-[#F3F4F6] space-y-1.5">
              {activeOrder.items.map((it) => (
                <div key={it.key} className="flex justify-between">
                  <span className="text-[#141414] font-medium">
                    {it.qty}x {it.name}
                  </span>
                  <span className="tabular-nums text-[#6B7280]">{formatRp(it.unitPrice * it.qty)}</span>
                </div>
              ))}
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Diskon Voucher</span>
                  <span className="tabular-nums">-{formatRp(activeOrder.discount)}</span>
                </div>
              )}
              <div className="pt-1.5 border-t border-[#F3F4F6] flex justify-between font-extrabold text-[#141414]">
                <span>Total Dibayar</span>
                <span className="tabular-nums text-[#D62828]">{formatRp(activeOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
