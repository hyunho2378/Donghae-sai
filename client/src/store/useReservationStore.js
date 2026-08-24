import { create } from 'zustand'

export const useReservationStore = create((set) => ({
  stayId: null,
  packageId: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  totalPrice: 0,
  status: 'idle',
  setStay: (stayId) => set({ stayId, packageId: null }),
  setPackage: (packageId) => set({ packageId, stayId: null }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  setTotalPrice: (totalPrice) => set({ totalPrice }),
  setStatus: (status) => set({ status }),
  reset: () =>
    set({
      stayId: null,
      packageId: null,
      checkIn: null,
      checkOut: null,
      guests: 1,
      totalPrice: 0,
      status: 'idle'
    })
}))
