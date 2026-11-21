import React, { useState } from 'react'
import { Search, TicketPercent, CheckCircle2, Clock } from 'lucide-react'
import { VOUCHERS, formatRp, calculateVoucherDiscount } from '../data/mockData'
import { useApp } from '../context/AppContext'

const FILTERS = ['Semua', 'Pick-up', 'Delivery', 'Harian', 'Bundling', 'Member']

export default function PromoPage() {
  const { appliedVoucher, applyVoucher, cart, subtotal, serviceType, setCartOpen, setActiveTab, showToast } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Semua')

  const filtered = VOUCHERS.filter((v) => {
    const matchF = filter === 'Semua' || v.category === filter
    const matchQ =
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.code.toLowerCase().includes(query.toLowerCase()) ||
      v.subtitle.toLowerCase().includes(query.toLowerCase())
    return matchF && matchQ
  })

  function handleUseVoucher(v) {
    applyVoucher(v)
    if (cart.length > 0) {
      setCartOpen(true)
    } else {
      showToast(`Voucher ${v.code} disimpan! Yuk pilih menu dulu.`, 'success')
      setActiveTab('menu')
    }
  }

  return (
    <div className="px-4 pt-2 pb-24 space-y-4">
      <div>
        <h1 className="text-lg font-extrabold text-[#2B1B17]">Promo & Voucher</h1>
        <p className="text-xs text-[#6B5A53]">Semua potongan harga terkumpul di satu tempat</p>
      </div>

      {/* Search Voucher */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A7D76] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kode promo (misal: HEMAT30)..."
          className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-white border border-[#E7DFD5] text-sm text-[#2B1B17] focus:outline-none focus:border-[#C83228]"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((f) => {
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`min-h-[40px] px-3.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                active ? 'bg-[#C83228] text-white' : 'bg-white text-[#6B5A53] border border-[#E7DFD5]'
              }`}
            >
              {f}
            </button>
          )
        })}
      </div>

      {/* Voucher Cards */}
      <div className="space-y-3">
        {filtered.map((v) => {
          const isApplied = appliedVoucher?.id === v.id
          const estSaving = cart.length > 0 ? calculateVoucherDiscount(v, subtotal, serviceType) : null

          return (
            <div
              key={v.id}
              className={`p-4 rounded-2xl bg-white border-2 transition-all ${
                isApplied ? 'border-[#1E7E4E] shadow-sm' : 'border-[#E7DFD5]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F8E2DF] text-[#C83228] flex items-center justify-center shrink-0">
                    <TicketPercent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#C83228] text-[10px] font-extrabold">
                      {v.badge} • Kode: {v.code}
                    </span>
                    <h2 className="font-bold text-sm text-[#2B1B17] mt-0.5">{v.title}</h2>
                  </div>
                </div>
                {isApplied && <CheckCircle2 className="w-5 h-5 text-[#1E7E4E] shrink-0" />}
              </div>

              <p className="text-xs text-[#6B5A53] mt-2">{v.subtitle}</p>

              <div className="mt-3 pt-3 border-t border-dashed border-[#E7DFD5] flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#6B5A53]">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {v.expiry}
                  </p>
                  <p className="font-semibold text-[#2B1B17] tabular-nums mt-0.5">
                    Min. belanja {formatRp(v.minSpend)}
                    {estSaving > 0 && <span className="text-[#1E7E4E]"> • Hemat {formatRp(estSaving)}</span>}
                  </p>
                </div>

                <button
                  onClick={() => handleUseVoucher(v)}
                  className={`min-h-[42px] px-4 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                    isApplied
                      ? 'bg-[#E6F4EC] text-[#1E7E4E]'
                      : 'bg-[#C83228] hover:bg-[#A92820] text-white'
                  }`}
                >
                  {isApplied ? 'Terpasang' : 'Pakai'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
