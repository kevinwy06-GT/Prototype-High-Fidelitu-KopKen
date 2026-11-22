import React from 'react'
import { X, MapPin, Navigation, Users, CheckCircle2, Clock, Video } from 'lucide-react'
import { OUTLETS, getSpace } from '../data/mockData'
import SpaceBadge from './SpaceBadge'
import { useApp } from '../context/AppContext'

function CrowdBadge({ crowd, estMinutes }) {
  const styles =
    crowd === 'Sepi'
      ? 'bg-[#E6F4EC] text-[#1E7E4E]'
      : crowd === 'Sedang'
      ? 'bg-[#FEF3C7] text-[#B45309]'
      : 'bg-[#FEE2E2] text-[#B91C1C]'

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      <Users className="w-3.5 h-3.5" />
      {crowd} • ±{estMinutes} mnt
    </span>
  )
}

export default function OutletSheet() {
  const { outletSheetOpen, setOutletSheetOpen, selectedOutletId, setSelectedOutletId, setCameraOutletId, showToast } = useApp()

  if (!outletSheetOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-t-3xl max-h-[84%] flex flex-col animate-slide-up overflow-hidden">
        <div className="px-4 pt-3 pb-3 bg-white border-b border-[#E7DFD5] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2B1B17]">Pilih Gerai Terdekat</h2>
            <p className="text-xs text-[#6B5A53]">Diurutkan otomatis dari lokasimu saat ini</p>
          </div>
          <button
            onClick={() => setOutletSheetOpen(false)}
            aria-label="Tutup"
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#F3ECE3] text-[#2B1B17]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
          {OUTLETS.map((outlet) => {
            const isSelected = outlet.id === selectedOutletId
            const space = getSpace(outlet)
            return (
              <div
                key={outlet.id}
                className={`rounded-2xl border-2 transition-all bg-white ${
                  isSelected ? 'border-[#C83228] shadow-sm' : 'border-transparent hover:border-[#D7C9BA]'
                }`}
              >
              <button
                onClick={() => {
                  setSelectedOutletId(outlet.id)
                  setOutletSheetOpen(false)
                  showToast(`Gerai diubah ke ${outlet.name}`, 'info')
                }}
                className="w-full text-left p-4 pb-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#2B1B17]">{outlet.name}</span>
                    {outlet.isNearest && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2B1B17] text-[#FAF7F2] text-[10px] font-bold">
                        <Navigation className="w-2.5 h-2.5" />
                        Terdekat
                      </span>
                    )}
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#C83228] shrink-0" />}
                </div>

                <p className="text-xs text-[#6B5A53] mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {outlet.area}
                </p>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#2B1B17] tabular-nums">{outlet.distance}</span>
                  <CrowdBadge crowd={outlet.crowd} estMinutes={outlet.estMinutes} />
                </div>

                {space && (
                  <div className="mt-2">
                    <SpaceBadge outlet={outlet} />
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-[#F3ECE3] flex items-center justify-between text-[11px] text-[#6B5A53]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Buka {outlet.openHours}
                  </span>
                  <span>
                    {outlet.outOfStockIds.length === 0
                      ? 'Semua menu tersedia'
                      : `${outlet.outOfStockIds.length} menu sedang habis`}
                  </span>
                </div>
              </button>
              {space && (
                <button
                  onClick={() => setCameraOutletId(outlet.id)}
                  className="mx-4 mb-4 w-[calc(100%-2rem)] min-h-[44px] rounded-xl border border-[#D7C9BA] text-[#2B1B17] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#F3ECE3] active:scale-[0.99] transition-all"
                >
                  <Video className="w-4 h-4 text-[#C83228]" />
                  Lihat kamera {space.type === 'parking' ? 'parkir' : 'meja'}
                </button>
              )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
