import React, { useEffect, useState } from 'react'

/**
 * Simulasi tampilan kamera/CCTV (top-down) + overlay hasil deteksi.
 * Prototype: tidak memakai video asli. Tampilan digambar dari data layout statis.
 * Hijau putus-putus = kosong, merah solid = terisi (dual-coded: warna + garis + label).
 */
const W = 340
const H = 250
const GREEN = '#4ADE80'
const RED = '#F87171'

function pad(n) {
  return String(n).padStart(2, '0')
}

function useClock() {
  const [sec, setSec] = useState(9 * 3600 + 45 * 60 + 12)
  useEffect(() => {
    const t = setInterval(() => setSec((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])
  return `${pad(Math.floor(sec / 3600) % 24)}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}`
}

function Car({ x, y, w, h, color }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill={color} />
      <rect x={x + w * 0.16} y={y + h * 0.22} width={w * 0.68} height={h * 0.2} rx={2} fill="#0F172A" opacity="0.75" />
      <rect x={x + w * 0.16} y={y + h * 0.62} width={w * 0.68} height={h * 0.14} rx={2} fill="#0F172A" opacity="0.6" />
    </g>
  )
}

function ParkingScene({ slots }) {
  const topN = Math.ceil(slots.length / 2)
  const rows = [slots.slice(0, topN), slots.slice(topN)]
  const gap = 5
  const margin = 12
  const slotH = 68
  const carColors = ['#94A3B8', '#CBD5E1', '#64748B', '#E2E8F0', '#475569']
  return (
    <g>
      <rect width={W} height={H} fill="#1F2430" />
      {/* lajur tengah */}
      <rect x={0} y={34 + slotH + 16} width={W} height={H - 2 * (34 + slotH + 16)} fill="#2A303C" />
      <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#64748B" strokeWidth={1.5} strokeDasharray="10 8" />
      {rows.map((row, r) => {
        const slotW = (W - margin * 2 - gap * (topN - 1)) / topN
        const y = r === 0 ? 34 : H - 34 - slotH
        return row.map((occupied, i) => {
          const x = margin + i * (slotW + gap)
          const n = r === 0 ? i + 1 : topN + i + 1
          const c = occupied ? RED : GREEN
          return (
            <g key={n}>
              <rect x={x} y={y} width={slotW} height={slotH} fill="none" stroke="#475569" strokeWidth={1} />
              {occupied && (
                <Car
                  x={x + slotW * 0.14}
                  y={y + 7}
                  w={slotW * 0.72}
                  h={slotH - 14}
                  color={carColors[(n * 7) % carColors.length]}
                />
              )}
              <rect
                x={x + 1.5}
                y={y + 1.5}
                width={slotW - 3}
                height={slotH - 3}
                rx={3}
                fill={occupied ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.10)'}
                stroke={c}
                strokeWidth={2}
                strokeDasharray={occupied ? '0' : '5 3'}
              />
              <text
                x={x + slotW / 2}
                y={r === 0 ? y + slotH + 11 : y - 4}
                fontSize={8.5}
                fontWeight={700}
                textAnchor="middle"
                fill={c}
                fontFamily="ui-monospace, monospace"
              >
                {occupied ? `P${n}` : `P${n}✓`}
              </text>
              {!occupied && (
                <text
                  x={x + slotW / 2}
                  y={y + slotH / 2 + 8}
                  fontSize={22}
                  fontWeight={800}
                  textAnchor="middle"
                  fill={GREEN}
                  opacity={0.85}
                  fontFamily="system-ui, sans-serif"
                >
                  P
                </text>
              )}
            </g>
          )
        })
      })}
    </g>
  )
}

function TableScene({ slots }) {
  const cols = Math.ceil(slots.length / 2)
  const margin = 10
  const cellW = (W - margin * 2) / cols
  const cellH = 84
  const startY = 34
  return (
    <g>
      <rect width={W} height={H} fill="#2B2420" />
      {/* garis lantai */}
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={0} y1={i * 24} x2={W} y2={i * 24} stroke="#352C26" strokeWidth={1} />
      ))}
      {slots.map((occupied, idx) => {
        const r = Math.floor(idx / cols)
        const c = idx % cols
        const cx = margin + c * cellW + cellW / 2
        const y = startY + r * (cellH + 6)
        const color = occupied ? RED : GREEN
        const tw = Math.min(40, cellW * 0.6)
        return (
          <g key={idx}>
            {/* kursi atas & bawah */}
            {[-1, 1].map((d) => (
              <rect
                key={d}
                x={cx - tw / 2 + 4}
                y={d === -1 ? y + 8 : y + cellH - 18}
                width={tw - 8}
                height={10}
                rx={3}
                fill={occupied ? '#F8A5A5' : '#6B5A4E'}
              />
            ))}
            <rect x={cx - tw / 2} y={y + 22} width={tw} height={cellH - 44} rx={5} fill="#7C5F4A" />
            {occupied && <circle cx={cx} cy={y + cellH / 2} r={4.5} fill="#FDE68A" opacity="0.9" />}
            <rect
              x={cx - cellW / 2 + 3}
              y={y}
              width={cellW - 6}
              height={cellH}
              rx={4}
              fill={occupied ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.10)'}
              stroke={color}
              strokeWidth={2}
              strokeDasharray={occupied ? '0' : '5 3'}
            />
            <text
              x={cx}
              y={y + cellH + 1}
              fontSize={8.5}
              fontWeight={700}
              textAnchor="middle"
              fill={color}
              fontFamily="ui-monospace, monospace"
            >
              {occupied ? `M${idx + 1}` : `M${idx + 1}✓`}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function CameraScene({ space, cameraLabel }) {
  const time = useClock()
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" role="img"
        aria-label={`Tampilan kamera: ${space.free} dari ${space.total} ${space.noun} kosong`}>
        {space.type === 'parking' ? <ParkingScene slots={space.slots} /> : <TableScene slots={space.slots} />}
      </svg>
      {/* efek scanline CCTV */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 1px, transparent 1px 3px)' }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.55)' }} />
      {/* HUD */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-bold font-mono">
        <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" /> LIVE
        <span className="text-white/60 font-medium">• {cameraLabel}</span>
      </div>
      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-mono tabular-nums">
        {time}
      </div>
      <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-mono">
        Deteksi: {space.total - space.free} terisi • {space.free} kosong
      </div>
    </div>
  )
}
