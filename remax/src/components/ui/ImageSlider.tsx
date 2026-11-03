'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
  title: string
}

export default function ImageSlider({ images, title }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const prev = useCallback(() => {
    setSelectedIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setSelectedIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const lightboxPrev = useCallback(() => {
    setLightboxIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const lightboxNext = useCallback(() => {
    setLightboxIndex(i => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, lightboxPrev, lightboxNext])

  if (!images || images.length === 0) return null

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      {/* Main slider */}
      <div className="w-full">
        {/* Main image */}
        <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden group cursor-pointer"
          onClick={() => openLightbox(selectedIndex)}>
          <Image
            src={images[selectedIndex]}
            alt={`${title} — photo ${selectedIndex + 1} of ${images.length}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={selectedIndex === 0}
            unoptimized
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                <ChevronLeft size={20} />
              </button>
              <button onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 px-4 sm:px-6 max-w-6xl mx-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === selectedIndex ? 'border-[#0c2749]' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} — photo ${i + 1} of ${images.length}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10">
            <X size={20} />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); lightboxPrev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10">
                <ChevronLeft size={24} />
              </button>
              <button onClick={e => { e.stopPropagation(); lightboxNext() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10">
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4"
            onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex]}
              alt={`${title} — photo ${lightboxIndex + 1} of ${images.length}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}