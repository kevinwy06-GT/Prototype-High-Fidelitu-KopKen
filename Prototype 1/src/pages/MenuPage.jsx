import React, { useState } from 'react'
import { Search, MapPin, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { MENU_ITEMS, formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

const CATEGORIES = ['Semua', 'Kopi', 'Non-Kopi', 'Pastry']

export default function MenuPage() {
  const { selectedOutlet, setOutletSheetOpen, setCustomizingItem, cart, setCartOpen, grandTotal } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua')

  const totalCartItems = cart.reduce((s, i) => s + i.qty, 0)

  const filtered = MENU_ITEMS.filter((item) => {
    const matchCat = category === 'Semua' || item.category === category
    const matchQ =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  })

  return (
    <div className="px-4 pt-2 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-[#2B1B17]">Menu</h1>
        <button
          onClick={() => setOutletSheetOpen(true)}
          className="min-h-[36px] px-3 rounded-full bg-white border border-[#E7DFD5] text-xs font-bold text-[#2B1B17] flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-[#C83228]" />
          <span className="max-w-[140px] truncate">{selectedOutlet.name.replace('Kopi Kenangan ', '')}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A7D76] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kopi, matcha, atau pastry..."
          className="w-full min-h-[48px] pl-10 pr-4 rounded-2xl bg-white border border-[#E7DFD5] text-sm text-[#2B1B17] focus:outline-none focus:border-[#C83228]"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const active = category === cat
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold shrink-0 transition-colors ${
                active ? 'bg-[#2B1B17] text-[#FAF7F2]' : 'bg-white text-[#6B5A53] border border-[#E7DFD5]'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Live Stock Notice */}
      <div className="px-3.5 py-2.5 rounded-xl bg-[#EFE7DD] text-[11px] text-[#4A2E25] flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#1E7E4E] shrink-0" />
        <span>
          Stok menu disinkronkan real-time dengan <strong>{selectedOutlet.name}</strong>.
        </span>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-[#E7DFD5]">
            <p className="font-bold text-sm text-[#2B1B17]">Menu tidak ditemukan</p>
            <p className="text-xs text-[#6B5A53] mt-1">Coba kata kunci lain atau pilih kategori Semua.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isOut = selectedOutlet.outOfStockIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl bg-white border border-[#E7DFD5] flex items-center gap-3 ${
                  isOut ? 'opacity-70' : ''
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-20 h-20 rounded-xl object-cover bg-[#EFE7DD] ${isOut ? 'grayscale' : ''}`}
                  />
                  {isOut && (
                    <span className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-[10px] font-extrabold text-white">
                      HABIS
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-[#2B1B17]">{item.name}</h3>
                    {isOut ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[10px] font-bold">
                        <AlertCircle className="w-3 h-3" /> Habis di gerai ini
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-[#6B5A53] text-[10px] font-semibold">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B5A53] line-clamp-2 mt-0.5">{item.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#C83228] tabular-nums">
                      {formatRp(item.price)}
                    </span>
                    <button
                      disabled={isOut}
                      onClick={() => setCustomizingItem(item)}
                      className={`min-h-[40px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                        isOut
                          ? 'bg-[#E7DFD5] text-[#8A7D76] cursor-not-allowed'
                          : 'bg-[#C83228] hover:bg-[#A92820] text-white'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      {isOut ? 'Kosong' : 'Tambah'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Floating Cart Bar */}
      {totalCartItems > 0 && (
        <div className="fixed sm:absolute bottom-20 left-4 right-4 z-20">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full min-h-[52px] px-4 rounded-2xl bg-[#2B1B17] text-white shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#C83228] text-xs font-extrabold flex items-center justify-center tabular-nums">
                {totalCartItems}
              </span>
              <span className="text-sm font-bold">Lanjut ke Keranjang</span>
            </div>
            <span className="text-sm font-extrabold tabular-nums">{formatRp(grandTotal)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
