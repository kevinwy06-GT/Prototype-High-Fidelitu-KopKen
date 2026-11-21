import React from 'react'
import { QrCode, Award, Eye, RotateCcw, Heart, Gift } from 'lucide-react'
import { formatRp } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function MemberPage() {
  const { points, setScanModalOpen, simpleMode, setSimpleMode, regularOrders, reorderRegular } = useApp()

  return (
    <div className="px-4 pt-2 pb-24 space-y-4">
      <h1 className="text-lg font-extrabold text-[#2B1B17]">Member & Profil</h1>

      {/* Profile & Points Card */}
      <div className="p-5 rounded-3xl bg-[#2B1B17] text-[#FAF7F2] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E5C9A8] font-semibold">Kenangan VIP • Gold</p>
            <h2 className="text-lg font-extrabold mt-0.5">Kevin William</h2>
            <p className="text-xs text-[#D7C9BA]">0812-3456-7890</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-[#FBBF24] tabular-nums">{points}</p>
            <p className="text-[11px] text-[#E5C9A8]">Kenangan Points</p>
          </div>
        </div>

        <button
          onClick={() => setScanModalOpen(true)}
          className="w-full min-h-[50px] rounded-2xl bg-[#FAF7F2] text-[#2B1B17] font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <QrCode className="w-5 h-5 text-[#C83228]" />
          Tampilkan QR Scan Member
        </button>
      </div>

      {/* Reward Progress */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#2B1B17] flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#D48A29]" />
            Target Reward Berikutnya
          </span>
          <span className="text-xs font-bold text-[#C83228] tabular-nums">{points} / 200 Poin</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#EFE7DD] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#D48A29]"
            style={{ width: `${Math.min(100, Math.round((points / 200) * 100))}%` }}
          />
        </div>
        <p className="text-xs text-[#6B5A53]">
          Kumpulkan {Math.max(0, 200 - points)} poin lagi untuk menukar <strong>1 Minuman Gratis</strong> semua ukuran.
        </p>
      </div>

      {/* Accessibility / Simple Mode Toggle (Persona 3 & CH5 WCAG) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E7DFD5] flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-[#2B1B17]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2B1B17]">Mode Sederhana (Teks Besar)</h3>
            <p className="text-xs text-[#6B5A53] mt-0.5">
              Perbesar teks & ringkas beranda ke Scan Member dan Pesanan Reguler saja.
            </p>
          </div>
        </div>
        <button
          role="switch"
          aria-checked={simpleMode}
          onClick={() => setSimpleMode(!simpleMode)}
          className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${
            simpleMode ? 'bg-[#1E7E4E]' : 'bg-[#D7C9BA]'
          }`}
        >
          <span
            className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
              simpleMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Saved Regular Orders */}
      <section className="space-y-2.5">
        <h2 className="text-sm font-extrabold text-[#2B1B17] flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-[#C83228]" />
          Daftar Pesanan Reguler Tersimpan
        </h2>
        {regularOrders.map((reg) => (
          <div key={reg.id} className="p-3.5 rounded-2xl bg-white border border-[#E7DFD5] flex items-center gap-3">
            <img src={reg.image} alt={reg.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-[#2B1B17] truncate">{reg.name}</p>
              <p className="text-[11px] text-[#6B5A53] line-clamp-2">
                {reg.size} • {reg.ice} • {reg.sugar}
                {reg.toppings?.length ? ` • ${reg.toppings.join(', ')}` : ''}
              </p>
              <p className="text-xs font-bold text-[#C83228] tabular-nums mt-0.5">{formatRp(reg.unitPrice)}</p>
            </div>
            <button
              onClick={() => reorderRegular(reg)}
              className="min-h-[44px] px-3 rounded-xl bg-[#C83228] text-white text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Pesan
            </button>
          </div>
        ))}
      </section>

      <div className="p-3 rounded-xl bg-[#EFE7DD] text-[11px] text-[#6B5A53] flex items-center gap-2">
        <Award className="w-4 h-4 text-[#D48A29] shrink-0" />
        <span>Data nomor telepon, poin, dan transaksimu dilindungi enkripsi.</span>
      </div>
    </div>
  )
}
