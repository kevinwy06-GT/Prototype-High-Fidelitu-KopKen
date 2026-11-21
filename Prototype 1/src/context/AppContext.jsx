import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  OUTLETS,
  VOUCHERS,
  DEFAULT_REGULAR_ORDERS,
  INITIAL_HISTORY,
  calculateVoucherDiscount,
} from '../data/mockData'

const AppContext = createContext(null)
const STORAGE_KEY = 'kk_p1_state_v1'

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

  const [activeTab, setActiveTab] = useState('home')
  const [selectedOutletId, setSelectedOutletId] = useState(saved?.selectedOutletId || OUTLETS[0].id)
  const [serviceType, setServiceType] = useState(saved?.serviceType || 'pickup')
  const [cart, setCart] = useState(saved?.cart || [])
  const [appliedVoucherId, setAppliedVoucherId] = useState(saved?.appliedVoucherId || null)
  const [regularOrders, setRegularOrders] = useState(saved?.regularOrders || DEFAULT_REGULAR_ORDERS)
  const [activeOrder, setActiveOrder] = useState(saved?.activeOrder || null)
  const [orderHistory, setOrderHistory] = useState(saved?.orderHistory || INITIAL_HISTORY)
  const [points, setPoints] = useState(saved?.points ?? 145)
  const [simpleMode, setSimpleMode] = useState(saved?.simpleMode || false)
  const [deliveryAddress, setDeliveryAddress] = useState(
    saved?.deliveryAddress || 'Jl. Siwalankerto Permai Blok C-12, Surabaya'
  )

  // Modals & Bottom Sheets
  const [outletSheetOpen, setOutletSheetOpen] = useState(false)
  const [customizingItem, setCustomizingItem] = useState(null)
  const [voucherSheetOpen, setVoucherSheetOpen] = useState(false)
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const selectedOutlet = OUTLETS.find((o) => o.id === selectedOutletId) || OUTLETS[0]
  const appliedVoucher = VOUCHERS.find((v) => v.id === appliedVoucherId) || null

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  const deliveryFee = serviceType === 'delivery' && cart.length > 0 ? 8000 : 0
  const discount = calculateVoucherDiscount(appliedVoucher, subtotal, serviceType)
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          selectedOutletId,
          serviceType,
          cart,
          appliedVoucherId,
          regularOrders,
          activeOrder,
          orderHistory,
          points,
          simpleMode,
          deliveryAddress,
        })
      )
    } catch {
      // ignore storage quota error
    }
  }, [
    selectedOutletId,
    serviceType,
    cart,
    appliedVoucherId,
    regularOrders,
    activeOrder,
    orderHistory,
    points,
    simpleMode,
    deliveryAddress,
  ])

  // Auto-advance Live Queue simulation every 6 seconds when an active order is running
  useEffect(() => {
    if (!activeOrder || activeOrder.stage >= 3) return
    const timer = setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev || prev.stage >= 3) return prev
        if (prev.currentBaristaNumber < prev.myQueueNumber) {
          const nextNum = prev.currentBaristaNumber + 1
          const remaining = Math.max(0, prev.myQueueNumber - nextNum)
          const isNowBeingMade = nextNum === prev.myQueueNumber
          return {
            ...prev,
            currentBaristaNumber: nextNum,
            stage: isNowBeingMade ? 2 : 1,
            estMinutes: isNowBeingMade ? 1 : remaining * 2,
          }
        }
        // Finish making -> Ready to pick up!
        showToast('Pesanan #' + prev.myQueueNumber + ' benar-benar SIAP diambil di counter!', 'success')
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
    showToast(`${entry.name} ditambahkan ke keranjang`, 'success')
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
    showToast('Item dihapus dari keranjang', 'info')
  }

  function saveRegularOrder(orderObj) {
    setRegularOrders((prev) => {
      const exists = prev.some((r) => r.name === orderObj.name && r.size === orderObj.size && r.sugar === orderObj.sugar)
      if (exists) return prev
      return [{ ...orderObj, id: 'reg-' + Date.now() }, ...prev]
    })
    showToast('Tersimpan di Pesanan Reguler!', 'success')
  }

  function reorderRegular(reg) {
    const outOfStock = selectedOutlet.outOfStockIds.includes(reg.menuId)
    if (outOfStock) {
      showToast(`Maaf, ${reg.name} sedang habis di ${selectedOutlet.name}`, 'error')
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
    setCartOpen(true)
  }

  function applyVoucher(voucher) {
    if (!voucher) {
      setAppliedVoucherId(null)
      return
    }
    setAppliedVoucherId(voucher.id)
    showToast(`Voucher ${voucher.code} berhasil dipasang!`, 'success')
  }

  function placeOrder({ paymentMethod, scheduleSlot }) {
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
      stage: 1, // 1: Diterima/Antre, 2: Sedang Dirakit Barista, 3: Siap Diambil (Terverifikasi Barista)
      estMinutes: (myQueue - startBarista) * 2 + 1,
      pickupCode: 'A-' + myQueue,
      verifiedByBarista: false,
    }
    const earned = Math.max(5, Math.floor(grandTotal / 1000))
    setActiveOrder(newOrder)
    setPoints((p) => p + earned)
    setCart([])
    setAppliedVoucherId(null)
    setCartOpen(false)
    setActiveTab('orders')
    showToast(`Pembayaran berhasil! Kamu di antrean #${myQueue} (+${earned} Poin)`, 'success')
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
    showToast('Pesanan selesai diambil. Terima kasih!', 'success')
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
        regularOrders,
        saveRegularOrder,
        reorderRegular,
        activeOrder,
        placeOrder,
        completeActiveOrder,
        orderHistory,
        points,
        setPoints,
        simpleMode,
        setSimpleMode,
        deliveryAddress,
        setDeliveryAddress,
        outletSheetOpen,
        setOutletSheetOpen,
        customizingItem,
        setCustomizingItem,
        voucherSheetOpen,
        setVoucherSheetOpen,
        scanModalOpen,
        setScanModalOpen,
        cartOpen,
        setCartOpen,
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
