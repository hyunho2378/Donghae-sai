import { useState } from 'react'

const KEY = 'goun_bookmarks'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function useBookmark(itemType, itemId) {
  const [store, setStore] = useState(load)

  const isBookmarked = !!(itemId && (store[itemType] || []).includes(itemId))

  const toggle = () => {
    if (!itemId) return
    setStore((prev) => {
      const list = prev[itemType] || []
      const next = list.includes(itemId)
        ? list.filter((x) => x !== itemId)
        : [...list, itemId]
      const updated = { ...prev, [itemType]: next }
      save(updated)
      return updated
    })
  }

  return { isBookmarked, toggle }
}

export function getBookmarkIds(itemType) {
  return load()[itemType] || []
}
