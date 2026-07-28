import React from 'react'

import type { LogoMarqueeBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const mediaAlt = (m: unknown): string =>
  typeof m === 'object' && m !== null && 'alt' in m && typeof (m as { alt?: string }).alt === 'string'
    ? ((m as { alt: string }).alt as string)
    : ''

// All scales are indexed by multiplier step 1x..7x (1 = normal baseline)
const SPEED_SECONDS = [30, 20, 14, 10, 7, 5, 4] // higher x = faster (fewer seconds)
const SPACING_PX = [48, 72, 100, 130, 165, 205, 250] // higher x = wider gap
const LOGO_HEIGHT = [56, 68, 82, 98, 116, 136, 158] // plain logo height
const CARD_SIZE = [150, 172, 196, 222, 250, 280, 312] // bordered badge card

/** Parse a "1".."7" multiplier string into a 0-based array index, clamped. */
const step = (v?: string | null): number => Math.min(7, Math.max(1, parseInt(v || '1', 10) || 1)) - 1

export const LogoMarqueeComponent: React.FC<LogoMarqueeBlock> = ({
  heading,
  logos,
  speed,
  spacing,
  size,
  bordered,
}) => {
  const items = (logos ?? [])
    .map((l) => ({ url: mediaUrl(l.image), alt: mediaAlt(l.image) }))
    .filter((i): i is { url: string; alt: string } => Boolean(i.url))

  if (!heading && items.length === 0) return null

  // Duplicate the list so the marquee can loop seamlessly (translateX -50%)
  const loop = [...items, ...items]
  const duration = SPEED_SECONDS[step(speed)]
  const gap = SPACING_PX[step(spacing)]
  const sz = { logo: LOGO_HEIGHT[step(size)], card: CARD_SIZE[step(size)] }

  return (
    <section className="w-full overflow-hidden">
      {heading && (
        <h2
          className="py-3 text-center text-2xl font-bold text-white"
          style={{ backgroundColor: '#FF7A64' }}
        >
          {heading}
        </h2>
      )}

      {items.length > 0 && (
        <div className="flex min-h-[200px] items-center overflow-hidden py-16">
          <div
            className="flex w-max items-center"
            style={{ animation: `logoMarquee ${duration}s linear infinite`, gap: `${gap}px` }}
          >
            {loop.map((it, i) =>
              bordered ? (
                <div
                  key={i}
                  className="flex shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white p-4"
                  style={{ height: sz.card, width: sz.card }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.url}
                    alt={it.alt}
                    loading="lazy"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={it.url}
                  alt={it.alt}
                  loading="lazy"
                  className="w-auto shrink-0 object-contain"
                  style={{ height: sz.logo }}
                />
              ),
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes logoMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
