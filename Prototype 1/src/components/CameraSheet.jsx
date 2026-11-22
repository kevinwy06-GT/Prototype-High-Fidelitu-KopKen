import React from 'react'
import { X, ShieldCheck, RefreshCw, MapPin, Info } from 'lucide-react'
import { OUTLETS, getSpace } from '../data/mockData'
import { useApp } from '../context/AppContext'
import CameraScene from './CameraScene'
import SpaceBadge from './SpaceBadge'

export default function CameraSheet() {
  const { cameraOutletId, setCameraOutletId, selectedOutletId, setSelectedOutletId, showToast } = useApp()
  const outlet = OUTLETS.find((o) => o.id === cameraOutletId)
  const space = getSpace(outlet)
  if (!outlet || !space) return null

  const isSelected = outlet.id === selectedOutletId
  const title = space.type === 'parking' ? 'Kamera Area Parkir' : 'Kamera Area Meja'
  const headline =
    space.status === 'Penuh'
      ? `Semua ${space.noun} sedang terisi`
      : `${space.free} dari ${space.total} ${space.noun} masih kosong`

  return (
    <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-black/50 animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-t-3xl max-h-[92%] flex flex-col animate-slide-up overflow-hidden">
        <div className="px-4 pt-3 pb-3 bg-white border-b border-[#E7DFD5] flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#2B1B17]">{title}</h2>
            <p className="text-xs text-[#6B5A53] flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" /> {outlet.name}
            </p>
          </div>
          <button
            onClick={() => setCameraOutletId(null)}
            aria-label="Tutup kamera"
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#F3ECE3] text-[#2B1B17]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
          <CameraScene space={space} cameraLabel={space.camera} />

          <div className="p-3.5 rounded-2xl bg-white border border-[#E7DFD5]">
            <p className="text-base font-extrabold text-[#2B1B17] tabular-nums">{headline}</p>
            <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
              <SpaceBadge outlet={outlet} showCount={false} />
              <span className="text-[11px] text-[#6B5A53] flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Diperbarui tiap ±5 detik
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-[#F3ECE3] flex items-center gap-4 text-xs text-[#2B1B17]">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-3 rounded-sm border-2 border-dashed border-[#1E7E4E] bg-[#E6F4EC]" /> Kosong
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-3 rounded-sm border-2 border-solid border-[#B91C1C] bg-[#FEE2E2]" /> Terisi
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#EFE7DD] text-[11px] text-[#4A3A34] space-y-1.5">
            <p className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1E7E4E]" />
              <span>
                Tampilan dibuat dari hasil deteksi kamera. Video tidak disimpan dan wajah tidak ditampilkan.
              </span>
            </p>
            <p className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Akurasi dapat berkurang karena cahaya, cuaca, atau halangan pada area kamera. Data dalam prototype ini adalah simulasi.
              </span>
            </p>
          </div>

          <button
            onClick={() => {
              if (!isSelected) {
                setSelectedOutletId(outlet.id)
                showToast(`Gerai diubah ke ${outlet.name}`, 'info')
              }
              setCameraOutletId(null)
            }}
            className="w-full min-h-[48px] rounded-2xl bg-[#C83228] text-white font-bold text-sm active:scale-[0.99] transition-transform"
          >
            {isSelected ? 'Kembali' : 'Pilih Gerai Ini'}
          </button>
        </div>
      </div>
    </div>
  )
}
