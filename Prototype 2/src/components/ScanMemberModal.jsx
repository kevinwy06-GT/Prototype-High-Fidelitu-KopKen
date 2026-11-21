import React from 'react'
import { X, Sparkles, Award } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ScanMemberModal() {
  const { scanModalOpen, setScanModalOpen, points, setPoints, showToast } = useApp()

  if (!scanModalOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/60 animate-fade-in">
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D62828]">Member QR</p>
            <h2 className="text-base font-extrabold text-[#141414]">Tunjukkan ke Kasir</h2>
          </div>
          <button
            onClick={() => setScanModalOpen(false)}
            aria-label="Tutup"
            className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <p className="text-xs text-[#6B7280] mb-4">
            Poin langsung tercatat otomatis tanpa perlu menyebutkan nomor telepon.
          </p>

          <div className="p-4 bg-white border-2 border-[#141414] rounded-2xl">
            <svg viewBox="0 0 120 120" className="w-44 h-44" aria-label="QR Member">
              <rect width="120" height="120" fill="#FFFFFF" />
              <rect x="8" y="8" width="28" height="28" fill="#141414" rx="3" />
              <rect x="13" y="13" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="17" y="17" width="10" height="10" fill="#141414" />
              <rect x="84" y="8" width="28" height="28" fill="#141414" rx="3" />
              <rect x="89" y="13" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="93" y="17" width="10" height="10" fill="#141414" />
              <rect x="8" y="84" width="28" height="28" fill="#141414" rx="3" />
              <rect x="13" y="89" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="17" y="93" width="10" height="10" fill="#141414" />
              <g fill="#141414">
                <rect x="44" y="10" width="6" height="6" />
                <rect x="56" y="10" width="12" height="6" />
                <rect x="44" y="22" width="12" height="6" />
                <rect x="64" y="22" width="10" height="6" />
                <rect x="10" y="44" width="12" height="6" />
                <rect x="28" y="44" width="8" height="6" />
                <rect x="44" y="44" width="18" height="6" />
                <rect x="68" y="44" width="12" height="6" />
                <rect x="90" y="44" width="16" height="6" />
                <rect x="16" y="56" width="16" height="6" />
                <rect x="40" y="56" width="10" height="10" />
                <rect x="56" y="56" width="12" height="6" />
                <rect x="76" y="56" width="10" height="10" />
                <rect x="96" y="56" width="14" height="6" />
                <rect x="10" y="70" width="18" height="6" />
                <rect x="34" y="70" width="12" height="6" />
                <rect x="54" y="70" width="18" height="6" />
                <rect x="84" y="70" width="22" height="6" />
                <rect x="44" y="84" width="8" height="14" />
                <rect x="58" y="84" width="14" height="6" />
                <rect x="80" y="84" width="10" height="10" />
                <rect x="98" y="84" width="12" height="12" />
                <rect x="58" y="98" width="18" height="12" />
                <rect x="84" y="102" width="24" height="8" />
              </g>
            </svg>
          </div>

          <p className="mt-3 font-mono text-sm font-bold tracking-widest text-[#141414]">KK-MBR-9024-881</p>

          <div className="mt-4 w-full p-3 rounded-2xl bg-[#F6F6F7] flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#141414]">
              <Award className="w-4 h-4 text-[#D62828]" /> Poin Aktif
            </span>
            <span className="font-extrabold text-[#141414] tabular-nums">{points} Poin</span>
          </div>

          <button
            onClick={() => {
              setPoints((p) => p + 15)
              showToast('Scan kasir sukses! +15 Poin ditambahkan', 'success')
              setScanModalOpen(false)
            }}
            className="mt-4 w-full min-h-[48px] rounded-2xl bg-[#141414] text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FACC15]" />
            Simulasi Scan di Kasir (+15 Poin)
          </button>
        </div>
      </div>
    </div>
  )
}
