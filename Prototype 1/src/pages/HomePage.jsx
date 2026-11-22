import React from 'react'
import {
  MapPin,
  ChevronRight,
  QrCode,
  RotateCcw,
  TicketPercent,
  Sparkles,
  ShoppingBag,
  Truck,
  Users,
  Clock,
  Eye,
  AlertCircle,
  Video,
} from 'lucide-react'
import { MENU_ITEMS, formatRp, getSpace } from '../data/mockData'
import SpaceBadge from '../components/SpaceBadge'
import { useApp } from '../context/AppContext'

export default function HomePage() {
  const {
    selectedOutlet,
    setOutletSheetOpen,
    setCameraOutletId,
    serviceType,
    setServiceType,
    regularOrders,
    reorderRegular,
    setScanModalOpen,
    points,
    activeOrder,
    setActiveTab,
    setCustomizingItem,
    cart,
    setCartOpen,
    grandTotal,
    simpleMode,
    setSimpleMode,
  } = useApp()

  const totalCartItems = cart.reduce((s, i) => s + i.qty, 0)
  const featuredItems = MENU_ITEMS.filter((m) =>
    ['kopi-kenangan-mantan', 'kopi-susu-black-aren', 'butter-croissant', 'pain-au-chocolat'].includes(m.id)
  )

  const selectedSpace = getSpace(selectedOutlet)

  return (
    <div className="px-4 pt-2 pb-24 space-y-4">
      {/* Top Brand Header + Simple Mode quick icon */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-[#6B5A53]">Selamat pagi, Kevin</p>
          <h1 className="text-lg font-extrabold tracking-tight text-[#2B1B17]">Kopi Kenangan</h1>
        </div>
        <button
          onClick={() => setSimpleMode(!simpleMode)}
          title="Mode Sederhana (Teks Besar)"
          className={`min-h-[40px] px-3 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors ${
            simpleMode
              ? 'bg-[#2B1B17] text-[#FAF7F2] border-[#2B1B17]'
              : 'bg-white text-[#2B1B17] border-[#E7DFD5]'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {simpleMode ? 'Mode Sederhana: ON' : 'Teks Besar'}
        </button>
      </div>

      {/* Smart Outlet Selector Bar (Solves wrong-outlet & crowd visibility) */}
      <button
        onClick={() => setOutletSheetOpen(true)}
        className="w-full p-3.5 rounded-2xl bg-white border border-[#E7DFD5] shadow-xs text-left flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#F8E2DF] text-[#C83228] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#6B5A53]">Gerai Aktif</span>
              {selectedOutlet.isNearest ? (
                <span className="px-1.5 py-0.5 rounded bg-[#E6F4EC] text-[#1E7E4E] text-[10px] font-bold">
                  Terdekat • {selectedOutlet.distance}
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#B45309] text-[10px] font-bold">
                  {selectedOutlet.distance} dari kamu
                </span>
              )}
            </div>
            <p className="font-bold text-sm text-[#2B1B17] truncate mt-0.5">{selectedOutlet.name}</p>
            <p className="text-[11px] text-[#6B5A53] flex items-center gap-1.5 mt-0.5">
              <Users className="w-3 h-3" />
              <span>
                Antrean {selectedOutlet.crowd} (±{selectedOutlet.estMinutes} mnt)
              </span>
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#9A8B82] shrink-0" />
      </button>

      {selectedSpace && (
        <button
          onClick={() => setCameraOutletId(selectedOutlet.id)}
          className="w-full -mt-1 p-3 rounded-2xl bg-white border border-[#E7DFD5] flex items-center justify-between gap-2 active:scale-[0.99] transition-transform"
        >
          <SpaceBadge outlet={selectedOutlet} />
          <span className="text-xs font-bold text-[#C83228] flex items-center gap-1 shrink-0">
            <Video className="w-4 h-4" /> Lihat kamera
          </span>
        </button>
      )}

      {/* Pick-up / Delivery Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[#EFE7DD] rounded-2xl">
        <button
          onClick={() => setServiceType('pickup')}
          className={`min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            serviceType === 'pickup' ? 'bg-white text-[#2B1B17] shadow-xs' : 'text-[#6B5A53]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#C83228]" />
          Pick-up (Ambil Sendiri)
        </button>
        <button
          onClick={() => setServiceType('delivery')}
          className={`min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            serviceType === 'delivery' ? 'bg-white text-[#2B1B17] shadow-xs' : 'text-[#6B5A53]'
          }`}
        >
          <Truck className="w-4 h-4 text-[#C83228]" />
          Delivery (Antar)
        </button>
      </div>

      {/* Active Order Live Queue Mini-Tracker */}
      {activeOrder && (
        <button
          onClick={() => setActiveTab('orders')}
          className="w-full p-4 rounded-2xl bg-[#2B1B17] text-[#FAF7F2] text-left shadow-md flex items-center justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5C9A8]">
                {activeOrder.stage === 3 ? 'Siap Diambil di Counter!' : 'Live Antrean Berjalan'}
              </span>
            </div>
            <p className="font-bold text-sm mt-1 tabular-nums">
              {activeOrder.stage === 3
                ? `Pesanan #${activeOrder.myQueueNumber} sudah terverifikasi barista`
                : `Barista proses #${activeOrder.currentBaristaNumber} • Pesananmu #${activeOrder.myQueueNumber}`}
            </p>
            <p className="text-xs text-[#D7C9BA] mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activeOrder.stage === 3
                ? `Kode Ambil: ${activeOrder.pickupCode}`
                : `Estimasi selesai ±${activeOrder.estMinutes} menit`}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-[#E5C9A8] shrink-0" />
        </button>
      )}

      {/* Quick Scan Member & Points Card (Persona 3 Primary Need) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3C261F] to-[#2B1B17] text-[#FAF7F2] shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold text-[#E5C9A8]">Kenangan Points</p>
            <p className="text-2xl font-extrabold tabular-nums mt-0.5">
              {points} <span className="text-xs font-semibold text-[#E5C9A8]">Poin</span>
            </p>
            <p className="text-[11px] text-[#D7C9BA] mt-1">
              {Math.max(0, 200 - points)} poin lagi untuk <strong className="text-white">Gratis 1 Kopi</strong>
            </p>
          </div>
          <button
            onClick={() => setScanModalOpen(true)}
            className="min-h-[48px] px-4 rounded-xl bg-[#FAF7F2] text-[#2B1B17] font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <QrCode className="w-4 h-4 text-[#C83228]" />
            Scan Member
          </button>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#D48A29] transition-all"
            style={{ width: `${Math.min(100, Math.round((points / 200) * 100))}%` }}
          />
        </div>
      </div>

      {/* Pesanan Reguler 1-Tap Reorder (Persona 3 & Persona 2) */}
      {regularOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-extrabold text-[#2B1B17]">Pesanan Reguler Saya</h2>
            <span className="text-[11px] font-semibold text-[#6B5A53]">1 ketuk langsung pesan</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD5] flex items-center gap-3">
            <img
              src={regularOrders[0].image}
              alt={regularOrders[0].name}
              className="w-16 h-16 rounded-xl object-cover bg-[#EFE7DD] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-[#2B1B17] truncate">{regularOrders[0].name}</p>
              <p className="text-[11px] text-[#6B5A53] line-clamp-2 mt-0.5">
                {regularOrders[0].size} • {regularOrders[0].ice} • {regularOrders[0].sugar}
                {regularOrders[0].toppings?.length ? ` • ${regularOrders[0].toppings.join(', ')}` : ''}
              </p>
              <p className="text-xs font-extrabold text-[#C83228] mt-1 tabular-nums">
                {formatRp(regularOrders[0].unitPrice)}
              </p>
            </div>
            <button
              onClick={() => reorderRegular(regularOrders[0])}
              className="min-h-[48px] px-3.5 rounded-xl bg-[#C83228] hover:bg-[#A92820] text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Pesan
            </button>
          </div>
        </section>
      )}

      {/* Simple Mode keeps home ultra-clean; Normal Mode shows 1 Promo Card + Recommendations */}
      {simpleMode ? (
        <button
          onClick={() => setActiveTab('menu')}
          className="w-full min-h-[56px] rounded-2xl bg-[#C83228] text-white font-bold text-base shadow-sm"
        >
          Lihat Daftar Menu Kopi & Pastry
        </button>
      ) : (
        <>
          {/* Single Focused Promo Banner (Persona 1 — Anti-Clutter) */}
          <button
            onClick={() => setActiveTab('promo')}
            className="w-full p-4 rounded-2xl bg-[#FFF3F1] border border-[#F4C7C3] text-left flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#C83228] text-white flex items-center justify-center shrink-0">
                <TicketPercent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C83228]">
                  5 Voucher Aktif Hari Ini
                </span>
                <p className="font-bold text-sm text-[#2B1B17]">Diskon 30% Pick-up & Potongan Rp10rb</p>
                <p className="text-xs text-[#6B5A53]">Ketuk untuk cari & pasang voucher</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#C83228] shrink-0" />
          </button>

          {/* Rekomendasi Kopi & Pastry */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-sm font-extrabold text-[#2B1B17] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D48A29]" />
                Rekomendasi Kopi & Pastry
              </h2>
              <button
                onClick={() => setActiveTab('menu')}
                className="text-xs font-bold text-[#C83228] min-h-[36px] px-2"
              >
                Lihat Semua
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredItems.map((item) => {
                const isOut = selectedOutlet.outOfStockIds.includes(item.id)
                return (
                  <button
                    key={item.id}
                    disabled={isOut}
                    onClick={() => setCustomizingItem(item)}
                    className={`p-2.5 rounded-2xl bg-white border border-[#E7DFD5] text-left flex flex-col transition-all ${
                      isOut ? 'opacity-60 cursor-not-allowed' : 'active:scale-[0.98]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-24 rounded-xl object-cover bg-[#EFE7DD]"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 text-[#2B1B17] text-[10px] font-bold shadow-xs">
                        {item.tag}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-[#2B1B17] mt-2 line-clamp-1">{item.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#C83228] tabular-nums">
                        {formatRp(item.price)}
                      </span>
                      {isOut && (
                        <span className="text-[10px] font-bold text-[#B91C1C] flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> Habis
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        </>
      )}

      {/* Floating Cart Button inside Home if cart has items */}
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
              <span className="text-sm font-bold">Lihat Keranjang</span>
            </div>
            <span className="text-sm font-extrabold tabular-nums">{formatRp(grandTotal)}</span>
          </button>
        </div>
      )}
    </div>
  )
}
