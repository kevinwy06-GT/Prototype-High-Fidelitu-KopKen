import React from 'react'
import { Car, Armchair, CheckCircle2, AlertTriangle, Ban } from 'lucide-react'
import { getSpace } from '../data/mockData'

export const SPACE_STYLE = {
  Tersedia: { cls: 'bg-[#DCFCE7] text-[#15803D]', Icon: CheckCircle2 },
  Terbatas: { cls: 'bg-[#FEF3C7] text-[#B45309]', Icon: AlertTriangle },
  Penuh: { cls: 'bg-[#FEE2E2] text-[#B91C1C]', Icon: Ban },
}

// Badge dual-coded: warna + ikon + teks. Tidak tampil jika gerai tidak punya fasilitas.
export default function SpaceBadge({ outlet, showCount = true }) {
  const space = getSpace(outlet)
  if (!space) return null
  const { cls, Icon } = SPACE_STYLE[space.status]
  const TypeIcon = space.type === 'parking' ? Car : Armchair
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${cls}`}>
      <TypeIcon className="w-3 h-3" />
      {space.label} {space.status}
      {showCount && space.status !== 'Penuh' ? ` • ${space.free} kosong` : ''}
      <Icon className="w-3 h-3" />
    </span>
  )
}
