import React from 'react'
import { X, Award, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ScanMemberModal() {
  const { scanModalOpen, setScanModalOpen, points, setPoints, showToast } = useApp()

  if (!scanModalOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/65 animate-fade-in">
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-slide-up">
        <div className="bg-[#2B1B17] text-[#FAF7F2] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#E5C9A8] font-medium">Kenangan VIP Member</p>
            <h2 className="text-base font-bold">Scan Member di Kasir</h2>
          </div>
          <button
            onClick={() => setScanModalOpen(false)}
            aria-label="Tutup QR"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <p className="text-xs text-[#6B5A53] mb-4">
            Tunjukkan kode ini ke kasir untuk langsung mencatat poin tanpa perlu menyebut nomor HP.
          </p>

          {/* Realistic Crisp SVG QR Code */}
          <div className="p-4 bg-white border-2 border-[#2B1B17] rounded-2xl shadow-sm">
            <svg viewBox="0 0 120 120" className="w-44 h-44" aria-label="QR Code Member Kopi Kenangan">
              <rect width="120" height="120" fill="#FFFFFF" />
              {/* Top-left finder */}
              <rect x="8" y="8" width="28" height="28" fill="#2B1B17" rx="3" />
              <rect x="13" y="13" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="17" y="17" width="10" height="10" fill="#2B1B17" />
              {/* Top-right finder */}
              <rect x="84" y="8" width="28" height="28" fill="#2B1B17" rx="3" />
              <rect x="89" y="13" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="93" y="17" width="10" height="10" fill="#2B1B17" />
              {/* Bottom-left finder */}
              <rect x="8" y="84" width="28" height="28" fill="#2B1B17" rx="3" />
              <rect x="13" y="89" width="18" height="18" fill="#FFFFFF" rx="1" />
              <rect x="17" y="93" width="10" height="10" fill="#2B1B17" />
              {/* Data modules */}
              <g fill="#2B1B17">
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

          <p className="mt-3 font-mono text-sm font-bold tracking-widest text-[#2B1B17]">KK-MBR-9024-881</p>

          <div className="mt-4 w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold text-[#2B1B17]">
              <Award className="w-4 h-4 text-[#D48A29]" />
              Saldo Poin Saat Ini
            </span>
            <span className="font-bold text-sm text-[#C83228] tabular-nums">{points} Poin</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setPoints((p) => p + 15)
              showToast('Scan kasir berhasil! +15 Poin Kenangan ditambahkan', 'success')
              setScanModalOpen(false)
            }}
            className="mt-4 w-full min-h-[48px] rounded-xl bg-[#2B1B17] text-[#FAF7F2] font-bold text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#D48A29]" />
            Simulasi Scan di Kasir (+15 Poin)
          </button>
        </div>
      </div>
    </div>
  )
}
