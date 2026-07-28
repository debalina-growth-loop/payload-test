'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import type { SpotlightBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    className={`w-[12px] ${dir === 'prev' ? 'rotate-90 -translate-x-px' : '-rotate-90 translate-x-px'}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 13 7"
  >
    <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="m1.338 1 5 5M11.338 1l-5 5" />
    </g>
  </svg>
)

// White torn-paper strip (jagged bottom) sat at the top of the grey panel
const TORN_D =
  'M0 0 H100 V5 L96 7.5 L92 4 L88 8 L84 4.5 L80 7 L76 4 L72 8 L68 4.5 L64 7.5 L60 4 L56 8 L52 4.5 L48 7 L44 4 L40 8 L36 4.5 L32 7.5 L28 4 L24 8 L20 4.5 L16 7 L12 4 L8 8 L4 4.5 L0 6 Z'
const TornEdge = () => (
  <svg
    className="pointer-events-none absolute inset-x-0 -top-px h-3 w-full"
    viewBox="0 0 100 12"
    preserveAspectRatio="none"
    fill="#ffffff"
    aria-hidden="true"
  >
    <path d={TORN_D} />
  </svg>
)

const BG_COLORS: Record<string, string> = {
  lightBlue: '#D6ECF2',
  white: '#ffffff',
  pink: '#FDF2F0',
  grey: '#F1F4F6',
}

const CARD_STEP = 390 // card width (360) + gap (30)
const AUTOPLAY_MS = 3000

export const SpotlightComponent: React.FC<SpotlightBlock> = ({
  heading,
  subheading,
  background,
  cardType,
  cards,
  seeAllLabel,
  seeAllUrl,
}) => {
  const list = cards ?? []
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // Autoplay: scroll one card left every few seconds. The list is rendered twice, so once
  // we pass the first copy we snap back by its width (invisible) for a seamless infinite loop.
  useEffect(() => {
    if (paused || list.length <= 1) return
    const id = setInterval(() => {
      const el = scroller.current
      if (!el) return
      const half = el.scrollWidth / 2 // width of one full copy of the list
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half // instant, unnoticeable (duplicate content lines up)
      }
      el.scrollBy({ left: CARD_STEP, behavior: 'smooth' })
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, list.length])

  if (list.length === 0) return null

  const scroll = (dir: number) =>
    scroller.current?.scrollBy({ left: dir * CARD_STEP, behavior: 'smooth' })
  const goTo = (i: number) =>
    scroller.current?.scrollTo({ left: i * CARD_STEP, behavior: 'smooth' })
  const onScroll = () => {
    if (scroller.current) {
      const i = Math.round(scroller.current.scrollLeft / CARD_STEP)
      setActive(((i % list.length) + list.length) % list.length)
    }
  }
  const bg = BG_COLORS[background || 'lightBlue'] ?? BG_COLORS.lightBlue
  // Render the list twice for a seamless infinite loop
  const loop = [...list, ...list]

  return (
    <section className="w-full py-[60px]" style={{ backgroundColor: bg }}>
      {(heading || subheading) && (
        <div className="mx-auto mb-[40px] max-w-[1360px] px-6 text-center lg:mb-[56px]">
            {heading && (
              <h2 className="text-2xl font-bold text-[#012A36] lg:text-[2.63rem]">{heading}</h2>
            )}
            {subheading && (
              <p className="mt-3 text-[1.25rem] font-bold text-[#012A36]">{subheading}</p>
            )}
          </div>
        )}

        {/* Cards row (horizontal scroll) */}
        <div
          ref={scroller}
          onScroll={onScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-[30px] overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loop.map((card, i) => {
            const href = card.url || '#'

            // Full-image card (uploaded image OR pasted image URL)
            if (cardType === 'image') {
              const imgUrl = mediaUrl(card.image) || card.imageUrl || null
              return (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-[360px] shrink-0 overflow-hidden rounded-[8px] shadow-sm transition-shadow duration-300 hover:shadow-[0_14px_30px_-10px_rgba(1,42,54,0.25)]"
                >
                  {imgUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imgUrl} alt={card.title || ''} className="w-full" loading="lazy" />
                  )}
                </Link>
              )
            }

            // Structured card (styled to match the uploaded-image cards)
            const logo = mediaUrl(card.logo)
            const fade = {
              maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
            }
            return (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-[360px] shrink-0 flex-col overflow-hidden rounded-[8px] bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_14px_30px_-10px_rgba(1,42,54,0.25)]"
              >
                {/* logo + date on white */}
                <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="" className="h-7 w-auto max-w-[150px] object-contain" />
                  ) : (
                    <span />
                  )}
                  {card.date && (
                    <span className="whitespace-pre-line text-right text-sm font-medium text-gray-500">
                      {card.date}
                    </span>
                  )}
                </div>

                {/* grey content panel with torn-paper top */}
                <div className="relative flex flex-1 flex-col bg-[#F0F0EE] px-6 pb-7 pt-7">
                  <TornEdge />
                  <div className="mb-4 h-[3px] w-10" style={{ backgroundColor: '#FF7A64' }} />

                  {card.title && (
                    <h3 className="text-[22px] font-bold leading-snug text-[#012A36]">
                      {card.title}
                    </h3>
                  )}

                  <div className="my-4 h-px w-full bg-black/10" />

                  {card.excerpt && (
                    <div className="max-h-[120px] overflow-hidden" style={fade}>
                      <p className="text-[0.95rem] leading-relaxed text-gray-500">{card.excerpt}</p>
                    </div>
                  )}

                  <span
                    className="mt-6 inline-block w-fit rounded-full px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: '#FF7A64' }}
                  >
                    Read More
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Coral pagination dots (left) + arrows (right) */}
        <div className="mx-auto mt-7 flex max-w-[1360px] items-center justify-between px-6">
          <div className="flex items-center gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active === i}
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full transition-all ${
                  active === i ? 'scale-110 bg-[#FF7A64]' : 'bg-[#FF7A64]/35 hover:bg-[#FF7A64]/60'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scroll(-1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#3B6C82] text-white transition-colors hover:bg-[#FF7A64]"
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scroll(1)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#3B6C82] text-white transition-colors hover:bg-[#FF7A64]"
            >
              <Chevron dir="next" />
            </button>
          </div>
        </div>

        {/* See All */}
        {seeAllLabel && (
          <div className="mt-8 px-6 text-center">
            <Link
              href={seeAllUrl || '#'}
              className="inline-block rounded-full px-8 py-3 text-[1.05rem] font-bold text-[#012A36] transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: '#FF7A64' }}
            >
              {seeAllLabel}
            </Link>
          </div>
        )}
    </section>
  )
}
