import React from 'react'
import { X, TicketPercent, CheckCircle2, AlertCircle } from 'lucide-react'
import { VOUCHERS, formatRp, calculateVoucherDiscount } from '../data/mockData'
import { useApp } from '../context/AppContext'

export default function VoucherSheet() {
  const { voucherSheetOpen, setVoucherSheetOpen, subtotal, serviceType, appliedVoucher, applyVoucher } = useApp()

  if (!voucherSheetOpen) return null

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/50 animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-t-3xl max-h-[82%] flex flex-col animate-slide-up overflow-hidden">
        <div className="px-4 py-3.5 bg-white border-b border-[#E7DFD5] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2B1B17]">Pilih Voucher Hemat</h2>
            <p className="text-xs text-[#6B5A53]">
              Subtotal saat ini: <strong className="tabular-nums text-[#2B1B17]">{formatRp(subtotal)}</strong>
            </p>
          </div>
          <button
            onClick={() => setVoucherSheetOpen(false)}
            aria-label="Tutup"
            className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#F3ECE3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto no-scrollbar">
          {VOUCHERS.map((v) => {
            const saving = calculateVoucherDiscount(v, subtotal, serviceType)
            const eligible = saving > 0
            const isSelected = appliedVoucher?.id === v.id
            const wrongService = v.serviceType !== 'all' && v.serviceType !== serviceType
            const needMore = Math.max(0, v.minSpend - subtotal)

            return (
              <div
                key={v.id}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-white border-[#C83228]'
                    : eligible
                    ? 'bg-white border-[#E7DFD5]'
                    : 'bg-[#F3EFEA] border-transparent opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-[#F8E2DF] text-[#C83228]">
                      <TicketPercent className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C83228]">{v.badge}</span>
                      <h3 className="text-sm font-bold text-[#2B1B17]">{v.title}</h3>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#1E7E4E] shrink-0" />}
                </div>

                <p className="text-xs text-[#6B5A53] mt-2">{v.subtitle}</p>

                <div className="mt-3 flex items-center justify-between gap-2">
                  {eligible ? (
                    <span className="text-xs font-bold text-[#1E7E4E] tabular-nums">
                      Hemat {formatRp(saving)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-[#B45309] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {wrongService
                        ? `Khusus layanan ${v.serviceType === 'pickup' ? 'Pick-up' : 'Delivery'}`
                        : `Tambah ${formatRp(needMore)} lagi`}
                    </span>
                  )}

                  <button
                    disabled={!eligible}
                    onClick={() => {
                      applyVoucher(isSelected ? null : v)
                      setVoucherSheetOpen(false)
                    }}
                    className={`min-h-[40px] px-4 rounded-xl text-xs font-bold transition-colors ${
                      !eligible
                        ? 'bg-[#DDD5CC] text-[#8A7D76] cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#F3ECE3] text-[#2B1B17]'
                        : 'bg-[#C83228] text-white'
                    }`}
                  >
                    {isSelected ? 'Lepas' : 'Pakai'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
