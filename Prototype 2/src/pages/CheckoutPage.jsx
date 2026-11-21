import React, { useState } from 'react'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { MENU_ITEMS, SCHEDULE_SLOTS, formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

const PAYMENTS = [
  { id: 'qris', label: 'QRIS Instan', sub: 'Tanpa biaya admin' },
  { id: 'gopay', label: 'GoPay', sub: 'Terhubung' },
  { id: 'ovo', label: 'OVO', sub: 'Cashback poin' },
  { id: 'bca', label: 'BCA Virtual Account', sub: 'Otomatis' },
]

export default function CheckoutPage() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    updateCartQty,
    removeCartItem,
    addToCart,
    selectedOutlet,
    setOutletModalOpen,
    serviceType,
    setServiceType,
    scheduleSlot,
    setScheduleSlot,
    deliveryAddress,
    setDeliveryAddress,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    appliedVoucher,
    applyVoucher,
    bestVoucher,
    setActiveTab,
    placeOrder,
  } = useApp()

  const [paymentMethod, setPaymentMethod] = useState('qris')
  const [addressError, setAddressError] = useState('')
  const [paymentError, setPaymentError] = useState(false)
  const [isPaying, setIsPaying] = useState(false)

  if (!checkoutOpen) return null

  const hasPastry = cart.some((c) => MENU_ITEMS.find((m) => m.id === c.menuId)?.category === 'Pastry')
  const pastryList = MENU_ITEMS.filter(
    (m) => m.category === 'Pastry' && !selectedOutlet.outOfStockIds.includes(m.id)
  ).slice(0, 2)

  function handlePay() {
    if (serviceType === 'delivery' && deliveryAddress.trim().length < 8) {
      setAddressError('Alamat antar minimal 8 karakter agar kurir mudah menemukan lokasi.')
      return
    }
    setAddressError('')
    setIsPaying(true)
    setPaymentError(false)
    setTimeout(() => {
      setIsPaying(false)
      placeOrder({ paymentMethod })
    }, 600)
  }

  return (
    <div className="absolute inset-0 z-40 bg-white flex flex-col animate-slide-up">
      <div className="shrink-0 px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-3">
        <button
          onClick={() => setCheckoutOpen(false)}
          aria-label="Kembali"
          className="w-11 h-11 rounded-full bg-[#F3F4F6] flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-[#141414]" />
        </button>
        <div>
          <h1 className="text-base font-extrabold text-[#141414]">Checkout</h1>
          <p className="text-xs text-[#6B7280]">{cart.reduce((s, i) => s + i.qty, 0)} item</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-5">
        {cart.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <p className="font-bold text-base text-[#141414]">Keranjang kosong</p>
            <button
              onClick={() => setCheckoutOpen(false)}
              className="mt-2 min-h-[46px] px-6 rounded-2xl bg-[#141414] text-white text-xs font-bold"
            >
              Pilih Menu
            </button>
          </div>
        ) : (
          <>
            {/* Outlet & Delivery */}
            <section className="p-4 rounded-2xl bg-[#F6F6F7] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#D62828] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-[#141414]">{selectedOutlet.name}</p>
                    <p className="text-xs text-[#6B7280]">
                      {selectedOutlet.distance} • Antrean {selectedOutlet.crowd} (±{selectedOutlet.estMinutes} mnt)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOutletModalOpen(true)}
                  className="text-xs font-bold text-[#D62828] min-h-[36px] px-2"
                >
                  Ubah
                </button>
              </div>

              {selectedOutlet.distanceMeters > 2000 && (
                <div className="p-3 rounded-xl bg-[#FEF3C7] text-[#92400E] text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Gerai berjarak {selectedOutlet.distance}. Pertimbangkan gerai terdekat (350 m).</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {['pickup', 'delivery'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setServiceType(t)}
                    className={`min-h-[40px] rounded-xl text-xs font-bold ${
                      serviceType === t ? 'bg-[#141414] text-white' : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                    }`}
                  >
                    {t === 'pickup' ? 'Pick-up' : 'Delivery (+Rp8rb)'}
                  </button>
                ))}
              </div>

              {serviceType === 'delivery' && (
                <div>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value)
                      if (addressError) setAddressError('')
                    }}
                    placeholder="Alamat antar lengkap..."
                    className={`w-full min-h-[44px] px-3 rounded-xl border text-xs bg-white ${
                      addressError ? 'border-[#B91C1C]' : 'border-[#E5E7EB]'
                    }`}
                  />
                  {addressError && <p className="text-[11px] text-[#B91C1C] mt-1 font-medium">{addressError}</p>}
                </div>
              )}

              {serviceType === 'pickup' && (
                <div className="pt-1">
                  <p className="text-[11px] font-bold text-[#6B7280] mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Waktu Ambil
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SCHEDULE_SLOTS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setScheduleSlot(s.id)}
                        className={`min-h-[40px] px-3 rounded-xl text-xs font-bold border ${
                          scheduleSlot === s.id
                            ? 'bg-white border-[#141414] text-[#141414]'
                            : 'bg-transparent border-[#E5E7EB] text-[#6B7280]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Auto-Suggest Best Voucher (P2 Key Differentiator!) */}
            {bestVoucher && (!appliedVoucher || appliedVoucher.id !== bestVoucher.voucher.id) ? (
              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#D62828] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-extrabold text-[#141414]">
                      Voucher Paling Hemat: {bestVoucher.voucher.code}
                    </p>
                    <p className="text-[11px] text-[#15803D] font-bold tabular-nums">
                      Langsung potong {formatRp(bestVoucher.saving)}!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => applyVoucher(bestVoucher.voucher)}
                  className="min-h-[40px] px-3.5 rounded-xl bg-[#D62828] text-white text-xs font-bold shrink-0"
                >
                  Pasang
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setCheckoutOpen(false)
                  setActiveTab('promo')
                }}
                className="w-full p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between text-xs font-bold"
              >
                <span className="text-[#141414]">
                  {appliedVoucher ? `Voucher aktif: ${appliedVoucher.code}` : 'Pilih Voucher Promo'}
                </span>
                <span className="text-[#15803D] tabular-nums">
                  {discount > 0 ? `-${formatRp(discount)}` : 'Lihat Semua'}
                </span>
              </button>
            )}

            {/* Items */}
            <section className="divide-y divide-[#F3F4F6] border border-[#E5E7EB] rounded-2xl px-4">
              {cart.map((item) => (
                <div key={item.key} className="py-3.5 flex items-start gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#141414]">{item.name}</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{item.summary}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#141414] tabular-nums">
                        {formatRp(item.unitPrice * item.qty)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(item.key, -1)}
                          className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold tabular-nums">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.key, 1)}
                          className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => removeCartItem(item.key)}
                          className="w-8 h-8 rounded-lg text-[#9CA3AF] hover:text-[#B91C1C] flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Pastry Add-on */}
            {!hasPastry && pastryList.length > 0 && (
              <section className="space-y-2">
                <p className="text-xs font-extrabold text-[#141414]">Tambahkan Pastry Teman Kopi</p>
                <div className="grid grid-cols-2 gap-2">
                  {pastryList.map((p) => (
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
                      className="p-3 rounded-2xl bg-[#F6F6F7] flex items-center justify-between gap-2 text-left"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#141414] truncate">{p.name}</p>
                        <p className="text-[11px] font-bold text-[#D62828] tabular-nums">{formatRp(p.price)}</p>
                      </div>
                      <Plus className="w-4 h-4 text-[#141414] shrink-0" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Payment */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold text-[#141414]">Pembayaran</h2>
                <span className="text-[10px] font-semibold text-[#15803D] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terenkripsi
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENTS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`min-h-[48px] p-3 rounded-2xl border-2 text-left ${
                      paymentMethod === m.id ? 'border-[#141414] bg-[#FAFAFA]' : 'border-[#E5E7EB]'
                    }`}
                  >
                    <p className="text-xs font-bold text-[#141414]">{m.label}</p>
                    <p className="text-[10px] text-[#6B7280]">{m.sub}</p>
                  </button>
                ))}
              </div>
            </section>

            {paymentError && (
              <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs space-y-2">
                <p className="font-bold">Pembayaran tertunda. Keranjangmu tetap aman.</p>
                <button
                  onClick={handlePay}
                  className="w-full min-h-[40px] rounded-xl bg-[#991B1B] text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
                </button>
              </div>
            )}

            {/* Summary */}
            <section className="p-4 rounded-2xl bg-[#F6F6F7] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold text-[#141414]">{formatRp(subtotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-[#6B7280]">
                  <span>Ongkir Delivery</span>
                  <span className="tabular-nums font-semibold text-[#141414]">{formatRp(deliveryFee)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Diskon ({appliedVoucher?.code})</span>
                  <span className="tabular-nums">-{formatRp(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E5E7EB] flex justify-between text-sm font-extrabold text-[#141414]">
                <span>Total</span>
                <span className="tabular-nums text-[#D62828]">{formatRp(grandTotal)}</span>
              </div>
            </section>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="shrink-0 p-4 bg-white border-t border-[#E5E7EB]">
          <button
            disabled={isPaying}
            onClick={handlePay}
            className="w-full min-h-[52px] px-5 rounded-2xl bg-[#D62828] hover:bg-[#B91C1C] text-white font-extrabold text-sm flex items-center justify-between disabled:opacity-70"
          >
            <span>{isPaying ? 'Memproses...' : 'Bayar & Pesan Sekarang'}</span>
            <span className="tabular-nums">{formatRp(grandTotal)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
