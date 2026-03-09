'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
  title: string
}

export default function ImageSlider({ images, title }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Main slider */}
      <div className="relative w-full h-[55vh] md:h-[65vh] bg-gray-900 overflow-hidden group">
        <Image
          src={images[current]}
          alt={`${title} - photo ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority={current === 0}
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Zoom button */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ZoomIn size={18} />
        </button>

        {/* Prev / Next arrows — only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
            {current + 1} / {images.length}
          </div>
        )}

        {/* Back button */}
        <a
          href="/properties"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0c2749] px-4 py-2 rounded-xl flex items-center gap-2 font-medium text-sm hover:bg-white transition-colors shadow-sm"
        >
          <ChevronLeft size={16} /> All Properties
        </a>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="bg-gray-900 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-6xl mx-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                  i === current
                    ? 'ring-2 ring-white opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setLightbox(false)}
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full mx-8"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[current]}
              alt={`${title} - photo ${current + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-full max-h-[85vh] rounded-xl"
              unoptimized
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
