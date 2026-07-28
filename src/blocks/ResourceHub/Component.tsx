'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { ResourceHubBlock } from '@/payload-types'
import { NetworkAnimation } from '@/components/NetworkAnimation'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const BG: Record<string, string> = {
  darkGradient: 'linear-gradient(180deg,#07222B 0%,#0A2E3A 100%)',
  darkNavy: '#012A36',
  black: '#0B0B0B',
}

const Arrow = () => (
  <svg className="ml-3 w-[21px] translate-y-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 12">
    <path
      d="M21.8 5.1 17.5.8c-.5-.5-1.3-.5-1.8 0-.2.2-.4.6-.4.9 0 .3.1.7.4.9l2 2H1.8C1.1 4.7.5 5.3.5 6s.6 1.3 1.3 1.3h15.9l-2 2c-.5.5-.5 1.3 0 1.8.3.3.6.4.9.4.3 0 .7-.1.9-.4l4.2-4.2c.3-.2.4-.6.4-.9 0-.3-.1-.6-.3-.9z"
      fill="currentColor"
    />
  </svg>
)

type Card = NonNullable<ResourceHubBlock['sideCards']>[number]

export const ResourceHubComponent: React.FC<ResourceHubBlock> = ({
  eyebrow,
  heading,
  background,
  featuredCards,
  sideCards,
}) => {
  const featured = featuredCards ?? []
  const cards = sideCards ?? []
  const [video, setVideo] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const bg = BG[background || 'darkGradient'] ?? BG.darkGradient

  // Visual "Watch" / "Read More" label (the whole card is the click target)
  const ActionLabel = ({ card }: { card: Card }) => {
    if (!card || card.action === 'none') return null
    const label = card.actionLabel || (card.action === 'read' ? 'Read More' : 'Watch')
    return (
      <span className="mt-[30px] inline-flex items-center text-[18px] font-bold text-[#FF7A64] transition-opacity group-hover:opacity-80">
        {label}
        <Arrow />
      </span>
    )
  }

  // Makes the whole card clickable: an <a> for "Read More", a button-like div for "Watch"
  const CardWrap = ({
    card,
    className,
    children,
  }: {
    card: Card
    className: string
    children: React.ReactNode
  }) => {
    const pointer = card.action !== 'none' ? 'cursor-pointer' : ''
    const cls = `group ${className} ${pointer} transition-colors hover:border-white/25`
    if (card.action === 'read') {
      return (
        <a href={card.linkUrl || '#'} className={cls}>
          {children}
        </a>
      )
    }
    if (card.action === 'watch') {
      return (
        <div
          role="button"
          tabIndex={0}
          onClick={() => card.videoUrl && setVideo(card.videoUrl)}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && card.videoUrl) {
              e.preventDefault()
              setVideo(card.videoUrl)
            }
          }}
          className={cls}
        >
          {children}
        </div>
      )
    }
    return <div className={cls}>{children}</div>
  }

  const glass =
    'rounded-2xl border border-white/10 bg-[linear-gradient(8deg,#fff0,#fff2,#fff3)] shadow-[0_0_2rem_rgba(0,0,0,0.13)] backdrop-blur-md'

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden" style={{ background: bg }}>
      <NetworkAnimation side="right" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-[60px] md:px-8 lg:py-[90px]">
        {/* Header */}
        {(eyebrow || heading) && (
          <div className="mb-[60px] text-center">
            {eyebrow && <p className="mb-[20px] text-[1.25rem] text-white/80">{eyebrow}</p>}
            {heading && (
              <h2
                className="bg-clip-text text-[2rem] font-bold text-transparent lg:text-[3rem]"
                style={{ backgroundImage: 'linear-gradient(90deg,#FF9A8B,#FF7A64)' }}
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* LEFT: featured cards (slide in from the left) */}
          {featured.length > 0 && (
            <div
              className={`flex w-full flex-col gap-8 transition-all duration-700 ease-out lg:w-1/2 ${
                shown ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
            >
              {featured.map((card, i) => {
                const img = mediaUrl(card.image) || card.imageUrl || null
                return (
                  <CardWrap key={i} card={card} className={`flex flex-col overflow-hidden ${glass}`}>
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={card.title || ''} className="w-full rounded-2xl" />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-[1.5rem] font-bold text-[#FF7A64]">{card.title}</h3>
                      {card.body && (
                        <p className="mt-2 text-[18px] leading-snug text-white">{card.body}</p>
                      )}
                      <ActionLabel card={card} />
                    </div>
                  </CardWrap>
                )
              })}
            </div>
          )}

          {/* RIGHT: stacked side cards (slide in from the right) */}
          <div
            className={`flex w-full flex-col gap-8 transition-all duration-700 ease-out lg:w-1/2 ${
              shown ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
          >
            {cards.map((card, i) => {
              const img = mediaUrl(card.image) || card.imageUrl || null
              return (
                <CardWrap
                  key={i}
                  card={card}
                  className={`flex flex-col items-stretch sm:flex-row ${glass}`}
                >
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={card.title || ''}
                      className="w-full rounded-2xl object-cover sm:w-[230px] sm:shrink-0"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[1.5rem] font-bold text-[#FF7A64]">{card.title}</h3>
                    {card.body && (
                      <p className="mt-2 text-[18px] leading-snug text-white">{card.body}</p>
                    )}
                    <ActionLabel card={card} />
                  </div>
                </CardWrap>
              )
            })}
          </div>
        </div>
      </div>

      {/* Video modal */}
      {video && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setVideo(null)}
        >
          <div className="relative w-full max-w-[960px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setVideo(null)}
              aria-label="Close"
              className="absolute -top-10 right-0 cursor-pointer text-3xl leading-none text-white hover:opacity-80"
            >
              ×
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={video}
                title="Video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
