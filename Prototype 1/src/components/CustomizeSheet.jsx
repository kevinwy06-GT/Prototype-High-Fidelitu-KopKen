import React, { useState, useEffect } from 'react'
import { X, Plus, Minus, Heart, Check } from 'lucide-react'
import { CUSTOM_OPTIONS, formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function CustomizeSheet() {
  const { customizingItem, setCustomizingItem, addToCart, saveRegularOrder } = useApp()

  const [sizeId, setSizeId] = useState('regular')
  const [iceId, setIceId] = useState('normal-ice')
  const [sugarId, setSugarId] = useState('normal-sugar')
  const [toppingIds, setToppingIds] = useState([])
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')
  const [saveAsRegular, setSaveAsRegular] = useState(false)

  useEffect(() => {
    if (customizingItem) {
      setSizeId('regular')
      setIceId('normal-ice')
      setSugarId('normal-sugar')
      setToppingIds([])
      setQty(1)
      setNotes('')
      setSaveAsRegular(false)
    }
  }, [customizingItem])

  if (!customizingItem) return null

  const selectedSize = CUSTOM_OPTIONS.sizes.find((s) => s.id === sizeId) || CUSTOM_OPTIONS.sizes[0]
  const selectedIce = CUSTOM_OPTIONS.ice.find((i) => i.id === iceId) || CUSTOM_OPTIONS.ice[0]
  const selectedSugar = CUSTOM_OPTIONS.sugar.find((s) => s.id === sugarId) || CUSTOM_OPTIONS.sugar[0]
  const selectedToppings = CUSTOM_OPTIONS.toppings.filter((t) => toppingIds.includes(t.id))

  const extraPrice =
    (customizingItem.customizable ? selectedSize.priceDelta : 0) +
    selectedToppings.reduce((sum, t) => sum + t.priceDelta, 0)
  const unitPrice = customizingItem.price + extraPrice
  const totalPrice = unitPrice * qty

  function toggleTopping(id) {
    setToppingIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function handleAdd() {
    const summaryParts = customizingItem.customizable
      ? [selectedSize.label, selectedIce.label, selectedSugar.label, ...selectedToppings.map((t) => t.label)]
      : ['Dipanggang hangat']
    if (notes.trim()) summaryParts.push(`Catatan: ${notes.trim()}`)

    const summary = summaryParts.join(' • ')
    addToCart({
      key: `${customizingItem.id}-${summary}`,
      menuId: customizingItem.id,
      name: customizingItem.name,
      image: customizingItem.image,
      summary,
      unitPrice,
      qty,
    })

    if (saveAsRegular && customizingItem.customizable) {
      saveRegularOrder({
        label: `Favorit: ${customizingItem.name}`,
        menuId: customizingItem.id,
        name: customizingItem.name,
        image: customizingItem.image,
        size: selectedSize.label,
        ice: selectedIce.label,
        sugar: selectedSugar.label,
        toppings: selectedToppings.map((t) => t.label),
        unitPrice,
        notes: notes.trim(),
      })
    }
    setCustomizingItem(null)
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-t-3xl max-h-[88%] flex flex-col animate-slide-up overflow-hidden">
        {/* Header with image */}
        <div className="relative p-4 bg-white border-b border-[#E7DFD5] flex items-center gap-3">
          <img
            src={customizingItem.image}
            alt={customizingItem.name}
            className="w-16 h-16 rounded-2xl object-cover bg-[#EFE7DD] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-[#2B1B17] leading-snug">{customizingItem.name}</h2>
            <p className="text-xs text-[#6B5A53] line-clamp-2 mt-0.5">{customizingItem.description}</p>
            <p className="text-sm font-bold text-[#C83228] mt-1 tabular-nums">{formatRp(customizingItem.price)}</p>
          </div>
          <button
            onClick={() => setCustomizingItem(null)}
            aria-label="Tutup"
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#F3ECE3] text-[#2B1B17] shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5 overflow-y-auto no-scrollbar">
          {customizingItem.customizable && (
            <>
              {/* Radio: Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-[#2B1B17]">Ukuran Gelas</h3>
                  <span className="text-[11px] font-semibold text-[#C83228] bg-[#F8E2DF] px-2 py-0.5 rounded-full">
                    Pilih 1
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CUSTOM_OPTIONS.sizes.map((s) => {
                    const active = sizeId === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSizeId(s.id)}
                        className={`min-h-[48px] px-3 py-2.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                          active
                            ? 'bg-white border-[#C83228] text-[#2B1B17]'
                            : 'bg-white border-[#E7DFD5] text-[#6B5A53]'
                        }`}
                      >
                        <span className="text-xs font-bold">{s.label}</span>
                        <span className="text-xs tabular-nums font-semibold">
                          {s.priceDelta > 0 ? `+${formatRp(s.priceDelta)}` : 'Gratis'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Radio: Ice / Temp */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-[#2B1B17]">Suhu & Es</h3>
                  <span className="text-[11px] font-semibold text-[#6B5A53]">Pilih 1</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CUSTOM_OPTIONS.ice.map((opt) => {
                    const active = iceId === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setIceId(opt.id)}
                        className={`min-h-[48px] px-3 py-2 rounded-xl border-2 text-xs font-semibold flex items-center gap-2 transition-all ${
                          active
                            ? 'bg-white border-[#C83228] text-[#2B1B17]'
                            : 'bg-white border-[#E7DFD5] text-[#6B5A53]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            active ? 'border-[#C83228]' : 'border-[#BDB1A6]'
                          }`}
                        >
                          {active && <span className="w-2 h-2 rounded-full bg-[#C83228]" />}
                        </span>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Radio: Sugar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-[#2B1B17]">Tingkat Gula</h3>
                  <span className="text-[11px] font-semibold text-[#6B5A53]">Pilih 1</span>
                </div>
                <div className="space-y-2">
                  {CUSTOM_OPTIONS.sugar.map((opt) => {
                    const active = sugarId === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSugarId(opt.id)}
                        className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 text-xs font-semibold flex items-center gap-2.5 transition-all ${
                          active
                            ? 'bg-white border-[#C83228] text-[#2B1B17]'
                            : 'bg-white border-[#E7DFD5] text-[#6B5A53]'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            active ? 'border-[#C83228]' : 'border-[#BDB1A6]'
                          }`}
                        >
                          {active && <span className="w-2 h-2 rounded-full bg-[#C83228]" />}
                        </span>
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Checkbox: Toppings (Multi-select CH7) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-[#2B1B17]">Topping Tambahan</h3>
                  <span className="text-[11px] font-semibold text-[#6B5A53]">Opsional • Boleh lebih dari 1</span>
                </div>
                <div className="space-y-2">
                  {CUSTOM_OPTIONS.toppings.map((top) => {
                    const checked = toppingIds.includes(top.id)
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => toggleTopping(top.id)}
                        className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border-2 text-xs font-semibold flex items-center justify-between transition-all ${
                          checked
                            ? 'bg-white border-[#C83228] text-[#2B1B17]'
                            : 'bg-white border-[#E7DFD5] text-[#6B5A53]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border-2 ${
                              checked ? 'bg-[#C83228] border-[#C83228] text-white' : 'border-[#BDB1A6]'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" strokeWidth={3} />}
                          </span>
                          {top.label}
                        </span>
                        <span className="tabular-nums text-[#2B1B17]">+{formatRp(top.priceDelta)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Save to Regular Order (Persona 3) */}
              <button
                type="button"
                onClick={() => setSaveAsRegular((v) => !v)}
                className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl border flex items-center gap-3 text-left transition-colors ${
                  saveAsRegular
                    ? 'bg-[#FFF5E6] border-[#D48A29] text-[#2B1B17]'
                    : 'bg-white border-[#E7DFD5] text-[#6B5A53]'
                }`}
              >
                <Heart
                  className={`w-5 h-5 shrink-0 ${saveAsRegular ? 'fill-[#C83228] text-[#C83228]' : 'text-[#9A8B82]'}`}
                />
                <div>
                  <p className="text-xs font-bold text-[#2B1B17]">Simpan sebagai Pesanan Reguler</p>
                  <p className="text-[11px] text-[#6B5A53]">Lain kali cukup 1 ketuk dari Beranda</p>
                </div>
              </button>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#2B1B17] mb-1.5">Catatan untuk Barista (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: pisah sedotan, sedikit foam..."
              className="w-full min-h-[48px] px-3.5 rounded-xl bg-white border border-[#D7C9BA] text-sm text-[#2B1B17] focus:outline-none focus:border-[#C83228]"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 bg-white border-t border-[#E7DFD5] flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl p-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Kurangi jumlah"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#2B1B17] hover:bg-[#EFE7DD]"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-bold text-sm tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Tambah jumlah"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#2B1B17] hover:bg-[#EFE7DD]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 min-h-[48px] px-4 rounded-xl bg-[#C83228] hover:bg-[#A92820] text-white font-bold text-sm flex items-center justify-between shadow-sm transition-colors"
          >
            <span>Tambah Pesanan</span>
            <span className="tabular-nums">{formatRp(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
