import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ImageGallery({ images = [], alt }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)

  if (images.length === 0) return null
  const main = images[0]
  const thumbs = images.slice(1, 5)

  const go = (dir) => setIdx((i) => (i + dir + images.length) % images.length)
  const openAt = (i) => { setIdx(i); setOpen(true) }

  return (
    <>
      <div className="md:grid md:grid-cols-[1.5fr_1fr] md:gap-2 md:rounded-2xl md:overflow-hidden">
        <button
          onClick={() => openAt(0)}
          className="block w-full aspect-[4/3] md:aspect-auto md:h-full
                     bg-bg-card overflow-hidden rounded-2xl md:rounded-none">
          <img src={main} alt={alt} className="w-full h-full object-cover" />
        </button>
        <div className="hidden md:grid grid-cols-2 gap-2">
          {thumbs.map((src, i) => (
            <button key={i} onClick={() => openAt(i + 1)}
                    className="block bg-bg-card overflow-hidden">
              <img src={src} alt={alt} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button aria-label="닫기" onClick={() => setOpen(false)}
                  className="absolute top-5 right-5 w-12 h-12 rounded-full
                             bg-white/10 hover:bg-white/20
                             inline-flex items-center justify-center transition-colors duration-150">
            <X size={24} className="text-white" />
          </button>
          <button aria-label="이전" onClick={() => go(-1)}
                  className="absolute left-5 w-12 h-12 rounded-full
                             bg-white/10 hover:bg-white/20
                             inline-flex items-center justify-center transition-colors duration-150">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <img src={images[idx]} alt={alt} className="max-w-[90vw] max-h-[85vh] object-contain" />
          <button aria-label="다음" onClick={() => go(1)}
                  className="absolute right-5 w-12 h-12 rounded-full
                             bg-white/10 hover:bg-white/20
                             inline-flex items-center justify-center transition-colors duration-150">
            <ChevronRight size={24} className="text-white" />
          </button>
          <div className="absolute bottom-5 font-pretendard font-medium text-[14px] text-white">
            {idx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
