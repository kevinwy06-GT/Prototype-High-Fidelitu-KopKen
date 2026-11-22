import React from 'react'
import { X, MapPin, Navigation, Users, Check, Clock, Video } from 'lucide-react'
import { OUTLETS, getSpace } from '../data/mockData'
import SpaceBadge from './SpaceBadge'
import { useApp } from '../context/AppContext'

export default function OutletModal() {
  const { outletModalOpen, setOutletModalOpen, selectedOutletId, setSelectedOutletId, setCameraOutletId, showToast } = useApp()

  if (!outletModalOpen) return null

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-slide-up">
      <div className="px-4 py-3.5 border-b border-[#E5E7EB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-[#141414]">Pilih Gerai</h2>
          <p className="text-xs text-[#6B7280]">Diurutkan berdasarkan jarak GPS terdekat</p>
        </div>
        <button
          onClick={() => setOutletModalOpen(false)}
          aria-label="Tutup"
          className="w-11 h-11 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#141414]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {OUTLETS.map((outlet) => {
          const isSelected = outlet.id === selectedOutletId
          const crowdColor =
            outlet.crowd === 'Sepi'
              ? 'bg-[#DCFCE7] text-[#15803D]'
              : outlet.crowd === 'Sedang'
              ? 'bg-[#FEF3C7] text-[#B45309]'
              : 'bg-[#FEE2E2] text-[#B91C1C]'

          const space = getSpace(outlet)
          return (
            <div
              key={outlet.id}
              className={`rounded-2xl border-2 transition-all ${
                isSelected ? 'border-[#141414] bg-[#FAFAFA]' : 'border-[#E5E7EB] bg-white'
              }`}
            >
            <button
              onClick={() => {
                setSelectedOutletId(outlet.id)
                setOutletModalOpen(false)
                showToast(`Gerai aktif: ${outlet.name}`, 'info')
              }}
              className="w-full text-left p-4 pb-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#141414]">{outlet.name}</span>
                    {outlet.isNearest && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#141414] text-white text-[10px] font-bold">
                        <Navigation className="w-2.5 h-2.5" /> Terdekat
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {outlet.area}
                  </p>
                </div>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-[#141414] text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#141414] tabular-nums">{outlet.distance}</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${crowdColor}`}>
                  <Users className="w-3 h-3" /> {outlet.crowd} • ±{outlet.estMinutes} mnt
                </span>
              </div>

              {space && (
                <div className="mt-2">
                  <SpaceBadge outlet={outlet} />
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {outlet.openHours}
                </span>
                <span>
                  {outlet.outOfStockIds.length === 0
                    ? 'Stok lengkap'
                    : `${outlet.outOfStockIds.length} menu habis`}
                </span>
              </div>
            </button>
            {space && (
              <button
                onClick={() => setCameraOutletId(outlet.id)}
                className="mx-4 mb-4 w-[calc(100%-2rem)] min-h-[44px] rounded-full bg-[#F3F4F6] text-[#141414] text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
              >
                <Video className="w-4 h-4 text-[#D62828]" />
                Lihat kamera {space.type === 'parking' ? 'parkir' : 'meja'}
              </button>
            )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
