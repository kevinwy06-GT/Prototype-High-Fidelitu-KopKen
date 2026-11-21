import React, { useState } from 'react'
import { Search, TicketPercent, CheckCircle2, Sparkles, Clock } from 'lucide-react'
import { VOUCHERS, formatRp, calculateVoucherDiscount } from '../data/mockData'
import { useApp } from '../context/AppContext'

const FILTERS = ['Semua', 'Pick-up', 'Delivery', 'Harian', 'Bundling', 'Member']

export default function PromoPage() {
  const { appliedVoucher, applyVoucher, bestVoucher, cart, subtotal, serviceType, setCheckoutOpen, setActiveTab, showToast } =
    useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Semua')

  const filtered = VOUCHERS.filter((v) => {
    const matchF = filter === 'Semua' || v.category === filter
    const matchQ =
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.code.toLowerCase().includes(query.toLowerCase())
    return matchF && matchQ
  })

  function handleSelect(v) {
    applyVoucher(v)
    if (cart.length > 0) {
      setCheckoutOpen(true)
    } else {
      showToast(`Voucher ${v.code} siap dipakai! Pilih menu dulu.`, 'success')
      setActiveTab('order')
    }
  }

  return (
    <div className="px-4 pt-2 pb-36 space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-[#141414]">Promo & Voucher</h1>
        <p className="text-xs text-[#6B7280]">Cari dan pasang potongan harga dalam 1 ketuk</p>
      </div>

      {/* Auto-Best Suggestion Card */}
      {bestVoucher && (
        <div className="p-4 rounded-2xl bg-[#141414] text-white flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#FACC15] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Rekomendasi Paling Hemat
            </p>
            <p className="font-bold text-sm mt-0.5">{bestVoucher.voucher.title}</p>
            <p className="text-xs text-[#D1D5DB] tabular-nums">
              Langsung hemat {formatRp(bestVoucher.saving)} untuk keranjangmu
            </p>
          </div>
          <button
            onClick={() => handleSelect(bestVoucher.voucher)}
            className="min-h-[42px] px-4 rounded-xl bg-[#D62828] text-white text-xs font-bold shrink-0"
          >
            Pakai
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kode promo..."
          className="w-full min-h-[46px] pl-10 pr-4 rounded-2xl bg-[#F6F6F7] text-sm focus:bg-white focus:border focus:border-[#141414] focus:outline-none"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`min-h-[38px] px-3.5 rounded-full text-xs font-bold shrink-0 ${
              filter === f ? 'bg-[#141414] text-white' : 'bg-[#F3F4F6] text-[#4B5563]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((v) => {
          const isApplied = appliedVoucher?.id === v.id
          const saving = cart.length > 0 ? calculateVoucherDiscount(v, subtotal, serviceType) : 0
          return (
            <div
              key={v.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isApplied ? 'border-[#15803D] bg-[#F0FDF4]' : 'border-[#E5E7EB] bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#D62828] flex items-center justify-center shrink-0">
                    <TicketPercent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#D62828]">
                      {v.badge} • {v.code}
                    </span>
                    <h2 className="font-bold text-sm text-[#141414]">{v.title}</h2>
                  </div>
                </div>
                {isApplied && <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />}
              </div>

              <p className="text-xs text-[#6B7280] mt-2">{v.subtitle}</p>

              <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                <div className="text-[11px] text-[#6B7280]">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {v.expiry}
                  </p>
                  <p className="font-semibold text-[#141414] tabular-nums mt-0.5">
                    Min. {formatRp(v.minSpend)}
                    {saving > 0 && <span className="text-[#15803D]"> • Hemat {formatRp(saving)}</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(v)}
                  className={`min-h-[40px] px-4 rounded-xl text-xs font-bold ${
                    isApplied ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#141414] text-white'
                  }`}
                >
                  {isApplied ? 'Aktif' : 'Pakai'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
