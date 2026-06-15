// src/components/SafeImage.js
'use client'
import Image from 'next/image'
import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

export default function SafeImage({
  src,
  alt = 'Image',
  fill = false,
  sizes,
  width,
  height,
  style = {},
  quality = 75,
  priority = false,
  ...props
}) {
  const [error, setError] = useState(false)

  // ✅ Auto-generate default sizes if fill is used and no sizes provided
  const safeSizes = fill
    ? sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : sizes

  // Fallback for missing/broken images
  if (!src || error) {
    return (
      <div
        style={{
          ...style,
          width: fill ? '100%' : width || '100%',
          height: fill ? '100%' : height || '100%',
          background: 'rgba(62,44,35,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(62,44,35,0.3)',
          position: fill ? 'absolute' : 'relative',
          inset: fill ? 0 : 'auto',
        }}
      >
        <ImageIcon size={40} />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={safeSizes}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      quality={quality}
      priority={priority}
      style={style}
      onError={() => setError(true)}
      {...props}
    />
  )
}