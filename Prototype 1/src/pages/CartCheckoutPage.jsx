import React, { useState } from 'react'
import {
  ArrowLeft,
  MapPin,
  Clock,
  TicketPercent,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { MENU_ITEMS, SCHEDULE_SLOTS, formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS (Instan)', sub: 'Bebas biaya admin' },
  { id: 'gopay', label: 'GoPay', sub: 'Saldo terhubung' },
  { id: 'ovo', label: 'OVO', sub: 'Cashback poin' },
  { id: 'bca', label: 'BCA Virtual Account', sub: 'Verifikasi otomatis' },
]

export default function CartCheckoutPage() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateCartQty,
    removeCartItem,
    addToCart,
    selectedOutlet,
    setOutletSheetOpen,
    serviceType,
    setServiceType,
    deliveryAddress,
    setDeliveryAddress,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    appliedVoucher,
    setVoucherSheetOpen,
    placeOrder,
  } = useApp()

  const [scheduleSlot, setScheduleSlot] = useState('now')
  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [addressError, setAddressError] = useState('')
  const [paymentError, setPaymentError] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  if (!cartOpen) return null

  const hasPastry = cart.some((c) => MENU_ITEMS.find((m) => m.id === c.menuId)?.category === 'Pastry')
  const pastryCrossSell = MENU_ITEMS.filter(
    (m) => m.category === 'Pastry' && !selectedOutlet.outOfStockIds.includes(m.id)
  ).slice(0, 2)

  function handlePay(simulateFailure = false) {
    if (serviceType === 'delivery' && deliveryAddress.trim().length < 8) {
      setAddressError('Masukkan alamat antar yang lengkap (min. 8 karakter).')
      return
    }
    setAddressError('')
    setIsPaying(true)
    setPaymentError(false)

    setTimeout(() => {
      setIsPaying(false)
      if (simulateFailure) {
        setPaymentError(true)
        return
      }
      placeOrder({ paymentMethod, scheduleSlot })
    }, 650)
  }

  return (
    <div className="absolute inset-0 z-40 bg-[#FAF7F2] flex flex-col animate-slide-up">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 bg-white border-b border-[#E7DFD5] flex items-center gap-3">
        <button
          onClick={() => setCartOpen(false)}
          aria-label="Kembali"
          className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#FAF7F2]"
        >
          <ArrowLeft className="w-5 h-5 text-[#2B1B17]" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-[#2B1B17]">Konfirmasi Pesanan</h1>
          <p className="text-xs text-[#6B5A53]">{cart.reduce((s, i) => s + i.qty, 0)} item di keranjang</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E7DFD5] p-6">
            <p className="font-bold text-base text-[#2B1B17]">Keranjangmu masih kosong</p>
            <p className="text-xs text-[#6B5A53] mt-1">Pilih kopi atau pastry favoritmu dulu ya.</p>
            <button
              onClick={() => setCartOpen(false)}
              className="mt-4 min-h-[48px] px-6 rounded-xl bg-[#C83228] text-white text-sm font-bold"
            >
              Jelajahi Menu
            </button>
          </div>
        ) : (
          <>
            {/* Outlet Confirmation + Distance Warning if far */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#C83228] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#6B5A53]">
                      {serviceType === 'pickup' ? 'Ambil di Gerai' : 'Dikirim dari Gerai'}
                    </p>
                    <p className="font-bold text-sm text-[#2B1B17]">{selectedOutlet.name}</p>
                    <p className="text-xs text-[#6B5A53]">
                      {selectedOutlet.distance} • Antrean {selectedOutlet.crowd} (±{selectedOutlet.estMinutes} mnt)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOutletSheetOpen(true)}
                  className="text-xs font-bold text-[#C83228] min-h-[36px] px-2 shrink-0"
                >
                  Ganti
                </button>
              </div>

              {selectedOutlet.distanceMeters > 2000 && (
                <div className="p-3 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Gerai ini berjarak <strong>{selectedOutlet.distance}</strong>. Ada gerai lebih dekat (350 m) jika
                    ingin ganti.
                  </span>
                </div>
              )}

              {/* Switcher */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {['pickup', 'delivery'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setServiceType(type)}
                    className={`min-h-[40px] rounded-xl text-xs font-bold border ${
                      serviceType === type
                        ? 'bg-[#2B1B17] text-white border-[#2B1B17]'
                        : 'bg-[#FAF7F2] text-[#6B5A53] border-[#E7DFD5]'
                    }`}
                  >
                    {type === 'pickup' ? 'Pick-up' : 'Delivery (+Rp8rb)'}
                  </button>
                ))}
              </div>

              {serviceType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold text-[#2B1B17] mb-1">Alamat Pengantaran</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value)
                      if (addressError) setAddressError('')
                    }}
                    className={`w-full min-h-[44px] px-3 rounded-xl border text-xs ${
                      addressError ? 'border-[#B91C1C] bg-[#FEF2F2]' : 'border-[#D7C9BA] bg-[#FAF7F2]'
                    }`}
                  />
                  {addressError && <p className="text-[11px] text-[#B91C1C] mt-1 font-medium">{addressError}</p>}
                </div>
              )}
            </div>

            {/* Scheduled Pick-up (Persona 2 Opportunity) */}
            {serviceType === 'pickup' && (
              <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5]">
                <h2 className="text-xs font-extrabold text-[#2B1B17] flex items-center gap-1.5 mb-2.5">
                  <Clock className="w-4 h-4 text-[#C83228]" />
                  Waktu Pengambilan (Scheduled Pick-up)
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {SCHEDULE_SLOTS.map((slot) => {
                    const active = scheduleSlot === slot.id
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setScheduleSlot(slot.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                          active ? 'border-[#C83228] bg-[#FFF8F7]' : 'border-[#E7DFD5] bg-white'
                        }`}
                      >
                        <p className="text-xs font-bold text-[#2B1B17]">{slot.label}</p>
                        <p className="text-[10px] text-[#6B5A53] mt-0.5">{slot.sublabel}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-3">
              <h2 className="text-xs font-extrabold text-[#2B1B17]">Rincian Pesanan</h2>
              {cart.map((item) => (
                <div key={item.key} className="flex items-start gap-3 pb-3 border-b border-[#F3ECE3] last:border-0 last:pb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#EFE7DD] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#2B1B17]">{item.name}</p>
                    <p className="text-[11px] text-[#6B5A53] mt-0.5">{item.summary}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#C83228] tabular-nums">
                        {formatRp(item.unitPrice * item.qty)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(item.key, -1)}
                          aria-label="Kurangi"
                          className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.key, 1)}
                          aria-label="Tambah"
                          className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeCartItem(item.key)}
                          aria-label="Hapus"
                          className="w-8 h-8 rounded-lg text-[#9A8B82] hover:text-[#B91C1C] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pastry Cross-sell */}
            {!hasPastry && pastryCrossSell.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#F2DFC1]">
                <p className="text-xs font-extrabold text-[#2B1B17] mb-2">Sekalian Tambah Pastry Hangat?</p>
                <div className="grid grid-cols-2 gap-2">
                  {pastryCrossSell.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        addToCart({
                          key: `${p.id}-Dipanggang hangat`,
                          menuId: p.id,
                          name: p.name,
                          image: p.image,
                          summary: 'Dipanggang hangat',
                          unitPrice: p.price,
                          qty: 1,
                        })
                      }
                      className="p-2.5 rounded-xl bg-white border border-[#E7DFD5] text-left flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2B1B17] truncate">{p.name}</p>
                        <p className="text-[11px] font-bold text-[#C83228] tabular-nums">{formatRp(p.price)}</p>
                      </div>
                      <Plus className="w-4 h-4 text-[#C83228] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 1-Tap Voucher Row (Persona 1) */}
            <button
              onClick={() => setVoucherSheetOpen(true)}
              className="w-full p-4 rounded-2xl bg-white border-2 border-dashed border-[#C83228] flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F8E2DF] text-[#C83228] flex items-center justify-center shrink-0">
                  <TicketPercent className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2B1B17]">
                    {appliedVoucher ? appliedVoucher.title : 'Pakai Voucher Hemat'}
                  </p>
                  <p className="text-xs text-[#1E7E4E] font-semibold tabular-nums">
                    {discount > 0 ? `Potongan ${formatRp(discount)} aktif!` : 'Cek 5 voucher tersedia hari ini'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#C83228] shrink-0" />
            </button>

            {/* Payment Method */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold text-[#2B1B17]">Metode Pembayaran</h2>
                <span className="text-[10px] font-semibold text-[#1E7E4E] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Aman
                </span>
              </div>
              {PAYMENT_METHODS.map((m) => {
                const active = paymentMethod === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`w-full min-h-[48px] px-3.5 py-2 rounded-xl border-2 flex items-center justify-between text-left ${
                      active ? 'border-[#C83228] bg-[#FFF8F7]' : 'border-[#E7DFD5]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-[#2B1B17]">{m.label}</p>
                      <p className="text-[10px] text-[#6B5A53]">{m.sub}</p>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        active ? 'border-[#C83228]' : 'border-[#BDB1A6]'
                      }`}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-[#C83228]" />}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Payment Error Recovery Banner (CH2 & Hubert's pain point) */}
            {paymentError && (
              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-extrabold">Koneksi pembayaran terputus sementara</p>
                    <p className="text-[11px] mt-0.5">
                      Tenang, keranjang dan vouchermu tetap aman tersimpan. Coba bayar ulang atau ganti metode.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handlePay(false)}
                  className="w-full min-h-[42px] rounded-xl bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Coba Bayar Ulang Sekarang
                </button>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-2 text-xs">
              <div className="flex justify-between text-[#6B5A53]">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold text-[#2B1B17]">{formatRp(subtotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-[#6B5A53]">
                  <span>Ongkos Kirim</span>
                  <span className="tabular-nums font-semibold text-[#2B1B17]">{formatRp(deliveryFee)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-[#1E7E4E] font-bold">
                  <span>Diskon Voucher ({appliedVoucher?.code})</span>
                  <span className="tabular-nums">-{formatRp(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E7DFD5] flex justify-between text-sm font-extrabold text-[#2B1B17]">
                <span>Total Bayar</span>
                <span className="tabular-nums text-[#C83228]">{formatRp(grandTotal)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      {cart.length > 0 && (
        <div className="shrink-0 p-4 bg-white border-t border-[#E7DFD5] space-y-2">
          <button
            disabled={isPaying}
            onClick={() => handlePay(false)}
            className="w-full min-h-[52px] rounded-2xl bg-[#C83228] hover:bg-[#A92820] text-white font-extrabold text-sm flex items-center justify-between px-5 shadow-md transition-colors disabled:opacity-70"
          >
            <span>{isPaying ? 'Memproses Pembayaran...' : 'Bayar Sekarang'}</span>
            <span className="tabular-nums">{formatRp(grandTotal)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
