'use client'

import { useState, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ImagePlus, Loader2, Upload } from 'lucide-react'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUploader({ images, onChange, maxImages = 15 }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<{ name: string; status: 'uploading' | 'done' | 'error' }[]>([])
  const [previewIndex, setPreviewIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFiles = useCallback(async (files: File[]) => {
    const allowed = files.filter(f => f.type.startsWith('image/'))
    const remaining = maxImages - images.length
    const toUpload = allowed.slice(0, remaining)
    if (toUpload.length === 0) return

    setUploading(true)
    setProgress(toUpload.map(f => ({ name: f.name, status: 'uploading' })))

    const newUrls: string[] = []

    for (let i = 0; i < toUpload.length; i++) {
      const file = toUpload[i]
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok || !data.url) throw new Error(data.error || 'Upload failed')

        newUrls.push(data.url)
        setProgress(p => p.map((x, idx) => idx === i ? { ...x, status: 'done' } : x))
      } catch (err) {
        console.error('Upload failed:', err)
        setProgress(p => p.map((x, idx) => idx === i ? { ...x, status: 'error' } : x))
      }
    }

    const updated = [...images, ...newUrls]
    onChange(updated)
    if (newUrls.length > 0) setPreviewIndex(images.length)
    setUploading(false)
    setTimeout(() => setProgress([]), 3000)
  }, [images, maxImages, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (images.length >= maxImages) return
    uploadFiles(Array.from(e.dataTransfer.files))
  }, [uploadFiles, images.length, maxImages])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const removeImage = (i: number) => {
    const updated = images.filter((_, idx) => idx !== i)
    onChange(updated)
    setPreviewIndex(Math.max(0, Math.min(previewIndex, updated.length - 1)))
  }

  const moveImage = (from: number, to: number) => {
    const imgs = [...images]
    const [moved] = imgs.splice(from, 1)
    imgs.splice(to, 0, moved)
    onChange(imgs)
    setPreviewIndex(to)
  }

  const atMax = images.length >= maxImages

  return (
    <div className="space-y-4">

      {/* ── Main preview ── */}
      {images.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden bg-gray-100 h-64 group">
          <img
            src={images[previewIndex]}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400' }}
          />
          {previewIndex === 0 && (
            <span className="absolute top-3 left-3 bg-[#0c2749] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              Cover Photo
            </span>
          )}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {previewIndex + 1} / {images.length}
          </div>
          {/* Always-visible delete on current image */}
          <button type="button" onClick={() => removeImage(previewIndex)}
            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-xl shadow transition-colors"
            title="Remove this photo">
            <X size={14} />
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => setPreviewIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => setPreviewIndex(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Thumbnail strip ── */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <div key={url + i}
              className={`relative flex-shrink-0 w-16 h-14 rounded-xl overflow-hidden cursor-pointer transition-all ${
                i === previewIndex ? 'ring-2 ring-[#0c2749]' : 'opacity-60 hover:opacity-95'
              }`}
              onClick={() => setPreviewIndex(i)}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              {/* Always-visible delete X */}
              <button type="button" onClick={e => { e.stopPropagation(); removeImage(i) }}
                className="absolute top-0.5 right-0.5 bg-red-500 hover:bg-red-600 text-white rounded-md p-0.5 shadow transition-colors z-10"
                title="Remove">
                <X size={9} />
              </button>
              {/* Reorder arrows */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-0.5 pb-0.5 opacity-0 hover:opacity-100 transition-opacity">
                <button type="button" onClick={e => { e.stopPropagation(); i > 0 && moveImage(i, i - 1) }}
                  disabled={i === 0}
                  className="bg-black/60 text-white rounded px-1 text-[10px] disabled:opacity-20">‹</button>
                <button type="button" onClick={e => { e.stopPropagation(); i < images.length - 1 && moveImage(i, i + 1) }}
                  disabled={i === images.length - 1}
                  className="bg-black/60 text-white rounded px-1 text-[10px] disabled:opacity-20">›</button>
              </div>
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#0c2749]/80 text-white text-[9px] text-center py-0.5 font-bold">
                  COVER
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Drop zone ── */}
      <div
        onDragOver={e => { e.preventDefault(); if (!atMax) setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !atMax && !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
          atMax
            ? 'border-gray-100 bg-gray-50 cursor-default'
            : dragging
              ? 'border-[#0c2749] bg-blue-50 scale-[1.01] cursor-copy'
              : uploading
                ? 'border-blue-200 bg-blue-50 cursor-wait'
                : 'border-gray-200 hover:border-[#0c2749] hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileInput} />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={26} className="text-[#0c2749] animate-spin" />
            <p className="text-sm font-medium text-[#0c2749]">Uploading photos...</p>
            <div className="flex flex-col gap-1 mt-1 w-full max-w-xs mx-auto">
              {progress.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {p.status === 'uploading' && <Loader2 size={10} className="animate-spin text-blue-400 flex-shrink-0" />}
                  {p.status === 'done' && <span className="text-green-500 flex-shrink-0">✓</span>}
                  {p.status === 'error' && <span className="text-red-500 flex-shrink-0">✗</span>}
                  <span className="truncate text-gray-500">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : atMax ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Upload size={18} className="text-amber-400" />
            </div>
            <p className="text-sm font-medium text-amber-600">15 / 15 photos</p>
            <p className="text-gray-400 text-xs">Remove a photo above to upload a new one</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              {images.length === 0
                ? <ImagePlus size={20} className="text-[#0c2749]" />
                : <Upload size={20} className="text-[#0c2749]" />}
            </div>
            <p className="font-semibold text-gray-700 text-sm">
              {dragging ? 'Drop to upload' : images.length === 0 ? 'Drag & drop photos here' : 'Drag & drop to add more'}
            </p>
            <p className="text-gray-400 text-xs">or click to browse · JPG, PNG, WebP</p>
            <p className="text-gray-300 text-xs">{images.length} / {maxImages} photos used</p>
          </div>
        )}
      </div>

      {/* Post-upload status */}
      {!uploading && progress.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {progress.map((p, i) => (
            <span key={i} className={`text-xs px-2 py-1 rounded-full ${
              p.status === 'done' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
            }`}>
              {p.status === 'done' ? '✓' : '✗'} {p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
