import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  OUTLETS,
  VOUCHERS,
  DEFAULT_REGULAR_ORDERS,
  INITIAL_HISTORY,
  calculateVoucherDiscount,
} from '../data/mockData'

const AppContext = createContext(null)
const STORAGE_KEY = 'kk_p2_state_v1'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const saved = loadSaved()

  // Prototype 2: 3 streamlined tabs ('order' | 'promo' | 'me')
  const [activeTab, setActiveTab] = useState('order')
  const [selectedOutletId, setSelectedOutletId] = useState(saved?.selectedOutletId || OUTLETS[0].id)
  const [serviceType, setServiceType] = useState(saved?.serviceType || 'pickup')
  const [scheduleSlot, setScheduleSlot] = useState(saved?.scheduleSlot || 'now')
  const [cart, setCart] = useState(saved?.cart || [])
  const [appliedVoucherId, setAppliedVoucherId] = useState(saved?.appliedVoucherId || null)
  const [regularOrders, setRegularOrders] = useState(saved?.regularOrders || DEFAULT_REGULAR_ORDERS)
  const [activeOrder, setActiveOrder] = useState(saved?.activeOrder || null)
  const [orderHistory, setOrderHistory] = useState(saved?.orderHistory || INITIAL_HISTORY)
  const [points, setPoints] = useState(saved?.points ?? 145)
  const [focusMode, setFocusMode] = useState(saved?.focusMode || false)
  const [deliveryAddress, setDeliveryAddress] = useState(
    saved?.deliveryAddress || 'Jl. Siwalankerto Permai Blok C-12, Surabaya'
  )

  // Full-screen routes & Drawers
  const [customizingItem, setCustomizingItem] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [outletModalOpen, setOutletModalOpen] = useState(false)
  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false)
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const selectedOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0]
  const appliedVoucher = VOUCHERS.find((v) => v.id === appliedVoucherId) || null

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  const deliveryFee = serviceType === 'delivery' && cart.length > 0 ? 8000 : 0
  const discount = calculateVoucherDiscount(appliedVoucher, subtotal, serviceType)
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount)

  // Compute best eligible voucher automatically for Auto-Suggest Best Voucher (P2 differentiator!)
  const bestVoucher = VOUCHERS.reduce((best, v) => {
    const sav = calculateVoucherDiscount(v, subtotal, serviceType)
    if (sav <= 0) return best
    if (!best || sav > best.saving) return { voucher: v, saving: sav }
    return best
  }, null)

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          selectedOutletId,
          serviceType,
          scheduleSlot,
          cart,
          appliedVoucherId,
          regularOrders,
          activeOrder,
          orderHistory,
          points,
          focusMode,
          deliveryAddress,
        })
      )
    } catch {
      // ignore
    }
  }, [
    selectedOutletId,
    serviceType,
    scheduleSlot,
    cart,
    appliedVoucherId,
    regularOrders,
    activeOrder,
    orderHistory,
    points,
    focusMode,
    deliveryAddress,
  ])

  // Auto-advance Live Queue every 6 seconds
  useEffect(() => {
    if (!activeOrder || activeOrder.stage >= 3) return
    const timer = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev || prev.stage >= 3) return prev
        if (prev.currentBaristaNumber < prev.myQueueNumber) {
          const nextNum = prev.currentBaristaNumber + 1
          const remaining = Math.max(0, prev.myQueueNumber - nextNum)
          const isNowMaking = nextNum === prev.myQueueNumber
          return {
            ...prev,
            currentBaristaNumber: nextNum,
            stage: isNowMaking ? 2 : 1,
            estMinutes: isNowMaking ? 1 : remaining * 2,
          }
        }
        showToast(`Pesanan #${prev.myQueueNumber} terverifikasi SIAP diambil!`, 'success')
        return {
          ...prev,
          stage: 3,
          estMinutes: 0,
          verifiedByBarista: true,
        }
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [activeOrder?.id, activeOrder?.stage])

  function showToast(message, type = 'info') {
    setToast({ id: Date.now(), message, type })
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  function addToCart(entry) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.key === entry.key)
      if (idx > -1) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (entry.qty || 1) }
        return copy
      }
      return [...prev, { ...entry, qty: entry.qty || 1 }]
    })
    showToast(`${entry.name} masuk keranjang`, 'success')
  }

  function updateCartQty(key, delta) {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    )
  }

  function removeCartItem(key) {
    setCart((prev) => prev.filter((i) => i.key !== key))
    showToast('Item dihapus', 'info')
  }

  function saveRegularOrder(orderObj) {
    setRegularOrders((prev) => {
      const exists = prev.some((r) => r.name === orderObj.name && r.size === orderObj.size && r.sugar === orderObj.sugar)
      if (exists) return prev
      return [{ ...orderObj, id: 'reg-' + Date.now() }, ...prev]
    })
    showToast('Disimpan ke Pesanan Reguler', 'success')
  }

  function reorderRegular(reg) {
    if (selectedOutlet.outOfStockIds.includes(reg.menuId)) {
      showToast(`${reg.name} sedang habis di ${selectedOutlet.name}`, 'error')
      return
    }
    const summaryParts = [reg.size, reg.ice, reg.sugar, ...(reg.toppings || [])].filter(Boolean)
    addToCart({
      key: `${reg.menuId}-${summaryParts.join('|')}`,
      menuId: reg.menuId,
      name: reg.name,
      image: reg.image,
      summary: summaryParts.join(' • '),
      unitPrice: reg.unitPrice,
      qty: 1,
    })
    setCheckoutOpen(true)
  }

  function applyVoucher(voucher) {
    if (!voucher) {
      setAppliedVoucherId(null)
      return
    }
    setAppliedVoucherId(voucher.id)
    showToast(`Voucher ${voucher.code} aktif!`, 'success')
  }

  function placeOrder({ paymentMethod }) {
    const myQueue = 22
    const startBarista = 20
    const newOrder = {
      id: 'KK-' + Math.floor(8900 + Math.random() * 900),
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      outletId: selectedOutlet.id,
      outletName: selectedOutlet.name,
      serviceType,
      scheduleSlot,
      paymentMethod,
      items: cart.map((c) => ({ ...c })),
      subtotal,
      discount,
      deliveryFee,
      total: grandTotal,
      myQueueNumber: myQueue,
      currentBaristaNumber: startBarista,
      stage: 1,
      estMinutes: (myQueue - startBarista) * 2 + 1,
      pickupCode: 'B-' + myQueue,
      verifiedByBarista: false,
    }
    const earned = Math.max(5, Math.floor(grandTotal / 1000))
    setActiveOrder(newOrder)
    setPoints((p) => p + earned)
    setCart([])
    setAppliedVoucherId(null)
    setCheckoutOpen(false)
    setQueueDrawerOpen(true)
    showToast(`Pesanan #${myQueue} masuk antrean (+${earned} Poin)`, 'success')
  }

  function completeActiveOrder() {
    if (!activeOrder) return
    setOrderHistory((prev) => [
      {
        id: activeOrder.id,
        date: 'Baru saja, ' + activeOrder.createdAt,
        outletName: activeOrder.outletName,
        serviceType: activeOrder.serviceType,
        status: 'Selesai',
        items: activeOrder.items,
        total: activeOrder.total,
        discount: activeOrder.discount,
        pointsEarned: Math.max(5, Math.floor(activeOrder.total / 1000)),
      },
      ...prev,
    ])
    setActiveOrder(null)
    setQueueDrawerOpen(false)
    showToast('Pesanan selesai diambil!', 'success')
  }

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedOutlet,
        selectedOutletId,
        setSelectedOutletId,
        serviceType,
        setServiceType,
        scheduleSlot,
        setScheduleSlot,
        cart,
        addToCart,
        updateCartQty,
        removeCartItem,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        appliedVoucher,
        applyVoucher,
        bestVoucher,
        regularOrders,
        saveRegularOrder,
        reorderRegular,
        activeOrder,
        placeOrder,
        completeActiveOrder,
        orderHistory,
        points,
        setPoints,
        focusMode,
        setFocusMode,
        deliveryAddress,
        setDeliveryAddress,
        customizingItem,
        setCustomizingItem,
        checkoutOpen,
        setCheckoutOpen,
        outletModalOpen,
        setOutletModalOpen,
        queueDrawerOpen,
        setQueueDrawerOpen,
        scanModalOpen,
        setScanModalOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
