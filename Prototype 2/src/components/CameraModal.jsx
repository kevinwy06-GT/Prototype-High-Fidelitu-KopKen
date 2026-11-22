import React from 'react'
import { X, ShieldCheck, RefreshCw, Info, Check } from 'lucide-react'
import { OUTLETS, getSpace } from '../data/mockData'
import { useApp } from '../context/AppContext'
import CameraScene from './CameraScene'
import SpaceBadge from './SpaceBadge'

export default function CameraModal() {
  const { cameraOutletId, setCameraOutletId, selectedOutletId, setSelectedOutletId, showToast } = useApp()
  const outlet = OUTLETS.find((o) => o.id === cameraOutletId)
  const space = getSpace(outlet)
  if (!outlet || !space) return null

  const isSelected = outlet.id === selectedOutletId
  const title = space.type === 'parking' ? 'Kamera Parkir' : 'Kamera Meja'
  const headline =
    space.status === 'Penuh'
      ? `Semua ${space.noun} terisi`
      : `${space.free} dari ${space.total} ${space.noun} kosong`

  return (
    <div className="absolute inset-0 z-[60] bg-white flex flex-col animate-slide-up">
      <div className="px-4 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-[#141414]">{title}</h2>
          <p className="text-xs text-[#6B7280] truncate">{outlet.name.replace('Kopi Kenangan ', '')}</p>
        </div>
        <button
          onClick={() => setCameraOutletId(null)}
          aria-label="Tutup kamera"
          className="w-11 h-11 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#141414]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        <CameraScene space={space} cameraLabel={space.camera} />

        <div>
          <p className="text-xl font-extrabold text-[#141414] tabular-nums leading-tight">{headline}</p>
          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
            <SpaceBadge outlet={outlet} showCount={false} />
            <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Diperbarui tiap ±5 detik
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-[#141414]">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded-sm border-2 border-dashed border-[#15803D] bg-[#DCFCE7]" /> Kosong
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded-sm border-2 border-solid border-[#B91C1C] bg-[#FEE2E2]" /> Terisi
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#F6F6F7] text-[11px] text-[#4B5563] space-y-1.5">
          <p className="flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#15803D]" />
            <span>Tampilan dibuat dari hasil deteksi kamera. Video tidak disimpan dan wajah tidak ditampilkan.</span>
          </p>
          <p className="flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Akurasi dapat berkurang karena cahaya, cuaca, atau halangan. Data prototype ini adalah simulasi.</span>
          </p>
        </div>
      </div>

      <div className="shrink-0 p-4 border-t border-[#E5E7EB] bg-white">
        <button
          onClick={() => {
            if (!isSelected) {
              setSelectedOutletId(outlet.id)
              showToast(`Gerai aktif: ${outlet.name}`, 'info')
            }
            setCameraOutletId(null)
          }}
          className="w-full min-h-[52px] rounded-full bg-[#141414] text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" /> Gerai ini sudah dipilih
            </>
          ) : (
            'Pilih Gerai Ini'
          )}
        </button>
      </div>
    </div>
  )
}
