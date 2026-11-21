import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Minus, Heart, Check } from 'lucide-react'
import { CUSTOM_OPTIONS, formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function CustomizePage() {
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
    <div className="absolute inset-0 z-40 bg-white flex flex-col animate-slide-up">
      {/* Dedicated Full-Screen Hero Image + Back Button */}
      <div className="relative h-48 shrink-0 bg-[#F3F4F6]">
        <img
          src={customizingItem.image}
          alt={customizingItem.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        <button
          onClick={() => setCustomizingItem(null)}
          aria-label="Kembali"
          className="absolute top-3 left-4 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center text-[#141414]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Spacious Editorial Sections */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
        <div className="border-b border-[#F3F4F6] pb-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-extrabold text-[#141414]">{customizingItem.name}</h1>
            <span className="text-base font-extrabold text-[#D62828] tabular-nums shrink-0">
              {formatRp(customizingItem.price)}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">{customizingItem.description}</p>
        </div>

        {customizingItem.customizable && (
          <>
            {/* Step 1: Size */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#141414]">1. Pilih Ukuran</h2>
                <span className="text-[11px] font-bold text-[#D62828]">Wajib • Pilih 1</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {CUSTOM_OPTIONS.sizes.map((s) => {
                  const active = sizeId === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSizeId(s.id)}
                      className={`min-h-[52px] px-4 py-3 rounded-2xl border-2 text-left transition-all ${
                        active ? 'border-[#141414] bg-[#141414] text-white' : 'border-[#E5E7EB] bg-white text-[#141414]'
                      }`}
                    >
                      <p className="text-xs font-bold">{s.label}</p>
                      <p className={`text-[11px] tabular-nums mt-0.5 ${active ? 'text-[#D1D5DB]' : 'text-[#6B7280]'}`}>
                        {s.priceDelta > 0 ? `+${formatRp(s.priceDelta)}` : 'Harga dasar'}
                      </p>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 2: Ice / Temp */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#141414]">2. Suhu & Es</h2>
                <span className="text-[11px] font-semibold text-[#6B7280]">Pilih 1</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CUSTOM_OPTIONS.ice.map((opt) => {
                  const active = iceId === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setIceId(opt.id)}
                      className={`min-h-[44px] px-4 rounded-full text-xs font-bold border-2 transition-all ${
                        active ? 'border-[#141414] bg-[#141414] text-white' : 'border-[#E5E7EB] bg-white text-[#374151]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 3: Sugar */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#141414]">3. Tingkat Kemanisan</h2>
                <span className="text-[11px] font-semibold text-[#6B7280]">Pilih 1</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CUSTOM_OPTIONS.sugar.map((opt) => {
                  const active = sugarId === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSugarId(opt.id)}
                      className={`min-h-[44px] px-4 rounded-full text-xs font-bold border-2 transition-all ${
                        active ? 'border-[#141414] bg-[#141414] text-white' : 'border-[#E5E7EB] bg-white text-[#374151]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 4: Toppings (Checkboxes) */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#141414]">4. Tambahan / Topping</h2>
                <span className="text-[11px] font-semibold text-[#6B7280]">Opsional • Multi-pilih</span>
              </div>
              <div className="divide-y divide-[#F3F4F6] border border-[#E5E7EB] rounded-2xl overflow-hidden">
                {CUSTOM_OPTIONS.toppings.map((top) => {
                  const checked = toppingIds.includes(top.id)
                  return (
                    <button
                      key={top.id}
                      onClick={() => toggleTopping(top.id)}
                      className="w-full min-h-[50px] px-4 py-3 bg-white flex items-center justify-between text-xs font-semibold text-[#141414]"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                            checked ? 'bg-[#D62828] border-[#D62828] text-white' : 'border-[#D1D5DB]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </span>
                        {top.label}
                      </span>
                      <span className="tabular-nums font-bold text-[#6B7280]">+{formatRp(top.priceDelta)}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Save Regular Toggle */}
            <button
              onClick={() => setSaveAsRegular((v) => !v)}
              className={`w-full min-h-[52px] px-4 py-3 rounded-2xl border flex items-center gap-3 text-left ${
                saveAsRegular ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#F6F6F7] border-transparent'
              }`}
            >
              <Heart className={`w-5 h-5 shrink-0 ${saveAsRegular ? 'fill-[#D62828] text-[#D62828]' : 'text-[#9CA3AF]'}`} />
              <div>
                <p className="text-xs font-bold text-[#141414]">Simpan ke Pesanan Reguler (1-Tap)</p>
                <p className="text-[11px] text-[#6B7280]">Pesan ulang racikan ini dalam 1 klik</p>
              </div>
            </button>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-[#141414] mb-1.5">Catatan Barista (Opsional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: sedikit foam, pisah es..."
            className="w-full min-h-[48px] px-4 rounded-2xl bg-[#F6F6F7] border border-transparent focus:border-[#141414] focus:bg-white text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="shrink-0 p-4 bg-white border-t border-[#E5E7EB] flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-2xl p-1">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Kurangi"
            className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-6 text-center font-bold text-sm tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Tambah"
            className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="flex-1 min-h-[50px] px-5 rounded-2xl bg-[#D62828] hover:bg-[#B91C1C] text-white font-extrabold text-sm flex items-center justify-between"
        >
          <span>Tambah</span>
          <span className="tabular-nums">{formatRp(totalPrice)}</span>
        </button>
      </div>
    </div>
  )
}
