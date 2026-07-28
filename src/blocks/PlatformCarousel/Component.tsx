'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import type { PlatformCarouselBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const CORAL = '#FF7A64'
const GRADIENT_TEXT: React.CSSProperties = {
  backgroundImage: 'linear-gradient(to right, #d5d5d9, #ff7964 60%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

const Arrow = () => (
  <svg className="ml-3 w-[21px] translate-y-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 12">
    <path
      d="M21.8 5.1 17.5.8c-.5-.5-1.3-.5-1.8 0-.2.2-.4.6-.4.9 0 .3.1.7.4.9l2 2H1.8C1.1 4.7.5 5.3.5 6s.6 1.3 1.3 1.3h15.9l-2 2c-.5.5-.5 1.3 0 1.8.3.3.6.4.9.4.3 0 .7-.1.9-.4l4.2-4.2c.3-.2.4-.6.4-.9 0-.3-.1-.6-.3-.9z"
      fill="currentColor"
    />
  </svg>
)

export const PlatformCarouselComponent: React.FC<PlatformCarouselBlock> = ({
  slides,
  autoplaySeconds,
}) => {
  const list = slides ?? []
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  activeRef.current = active

  // Track which slide is centered
  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index || 0)
            setActive(idx)
          }
        })
      },
      { root: scroller, threshold: 0.5 },
    )
    scroller.querySelectorAll('[data-index]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [list.length])

  // Autoplay (scrolls forward → content moves left), pauses on hover
  useEffect(() => {
    const scroller = scrollerRef.current
    const secs = autoplaySeconds ?? 4
    if (!scroller || list.length <= 1 || !secs || secs <= 0) return

    let timer: ReturnType<typeof setInterval> | null = null
    const step = () => {
      const next = (activeRef.current + 1) % list.length
      const slide = scroller.querySelector<HTMLElement>(`[data-index="${next}"]`)
      if (slide) scroller.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
    }
    const stop = () => {
      if (timer) clearInterval(timer)
      timer = null
    }
    const start = () => {
      stop()
      timer = setInterval(step, secs * 1000)
    }
    start()
    scroller.addEventListener('mouseenter', stop)
    scroller.addEventListener('mouseleave', start)
    return () => {
      stop()
      scroller.removeEventListener('mouseenter', stop)
      scroller.removeEventListener('mouseleave', start)
    }
  }, [list.length, autoplaySeconds])

  const goTo = (i: number) => {
    const scroller = scrollerRef.current
    const slide = scroller?.querySelector<HTMLElement>(`[data-index="${i}"]`)
    if (scroller && slide) scroller.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
  }

  if (list.length === 0) return null

  // Indicators only for slides that have a logo (skips stats / full-image / logo-grid)
  const indicators = list
    .map((slide, i) => ({ slide, i }))
    .filter(({ slide }) => mediaUrl(slide.indicatorLogo))

  return (
    <section className="w-full bg-[#06222c]">
      {/* Top coral accent — right half, rounded top-left corner (flat edge at bottom) */}
      <div className="flex justify-end">
        <div className="h-[40px] w-full rounded-tl-[60px] bg-[#FF7A64] lg:h-[76px] lg:w-1/2" />
      </div>

      {/* Full-bleed slides */}
      <div
        ref={scrollerRef}
        className="relative flex snap-x snap-mandatory overflow-x-hidden scroll-smooth"
      >
        {list.map((slide, i) => (
          <div
            key={i}
            data-index={i}
            className="relative min-h-[560px] w-full min-w-full shrink-0 snap-center overflow-hidden lg:min-h-[650px]"
          >
            {slide.type === 'stats' && <StatsSlide slide={slide} />}
            {slide.type === 'testimonial' && <TestimonialSlide slide={slide} />}
            {slide.type === 'logos' && <LogosSlide slide={slide} />}
            {slide.type === 'image' && <ImageSlide slide={slide} />}
          </div>
        ))}
      </div>

      {/* Coral indicator bar — centered, only when there are logo indicators */}
      {indicators.length > 0 && (
        <div className="relative z-10 -mt-14 flex justify-center px-4 lg:-mt-20">
          <div className="flex w-[84%] max-w-[1360px] items-center justify-center rounded-bl-[10px] rounded-br-[60px] rounded-tl-[60px] rounded-tr-[10px] bg-[#FF7A64] px-4 py-12 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)] lg:py-16">
            {indicators.map(({ slide, i }, k) => {
              const logo = mediaUrl(slide.indicatorLogo)!
              const isActive = i === active
              const divider = k < indicators.length - 1 ? 'border-r border-white/50' : ''
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`flex items-center justify-center px-6 lg:px-12 ${divider}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt=""
                    className="max-h-[42px] w-auto max-w-[160px] object-contain transition-transform duration-300"
                    style={{
                      filter: 'brightness(0) invert(1)',
                      transform: isActive ? 'scale(1.3)' : 'scale(1)',
                      opacity: isActive ? 1 : 0.8,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------------- Slide variants ---------------- */

type Slide = NonNullable<PlatformCarouselBlock['slides']>[number]

const StatsSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const bg = mediaUrl(slide.backgroundImage)
  return (
    <div
      className="flex h-full w-full items-center bg-cover bg-center"
      style={bg ? { backgroundImage: `url(${bg})` } : { backgroundColor: '#0a2531' }}
    >
      <div className="absolute inset-0 bg-[#06222c]/70" />
      <div className="relative grid w-full grid-cols-1 items-center gap-8 px-6 py-12 lg:grid-cols-12 lg:px-14">
        {/* Left */}
        <div className="lg:col-span-7 lg:border-r lg:border-white/15 lg:pr-10">
          {slide.heading && (
            <h2 className="mb-[30px] text-[2.63rem] font-bold leading-[1.15] lg:text-[3.75rem]" style={GRADIENT_TEXT}>
              {slide.heading}
            </h2>
          )}
          {slide.body && <p className="mb-[30px] max-w-[560px] text-[1.13rem] leading-[1.6] text-white">{slide.body}</p>}
          {slide.subheading && (
            <p className="mb-[30px] text-[1.25rem] font-bold text-white">{slide.subheading}</p>
          )}
          {slide.ctaLabel && (
            <Link
              href={slide.ctaUrl || '#'}
              className="inline-flex items-center text-[1.25rem] font-bold"
              style={{ color: CORAL }}
            >
              {slide.ctaLabel}
              <Arrow />
            </Link>
          )}
        </div>
        {/* Right: stats */}
        <div className="lg:col-span-5 lg:pl-10">
          {(slide.stats ?? []).map((s, i) => (
            <div key={i} className="mb-6">
              <p className="text-[2.25rem] font-extrabold leading-tight text-white">{s.value}</p>
              <p className="text-[2.25rem] font-extrabold leading-tight" style={{ color: CORAL }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TestimonialSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const img = mediaUrl(slide.image)
  return (
    <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
      {/* Left: image */}
      <div className="relative min-h-[280px] bg-[#0a2531] lg:min-h-full">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={slide.company || ''} className="h-full w-full object-cover" />
        )}
      </div>
      {/* Right: text */}
      <div className="flex flex-col justify-center bg-[#0a2028] px-8 py-12 text-white lg:px-14">
        {slide.company && (
          <h4 className="mb-4 text-[1.25rem] font-bold" style={{ color: CORAL }}>
            {slide.company}
          </h4>
        )}
        {slide.quote && <p className="text-[1.13rem] leading-[1.7]">“{slide.quote}”</p>}
        {(slide.authorName || slide.authorTitle) && (
          <p className="mt-[30px] text-[1.5rem] font-extrabold">
            {slide.authorName && (
              <span style={{ color: CORAL }}>
                {slide.authorName}
                {slide.authorTitle ? ', ' : ''}
              </span>
            )}
            {slide.authorTitle && <span className="text-white">{slide.authorTitle}</span>}
          </p>
        )}
        {(slide.metricValue || slide.metricLabel) && (
          <div className="mt-10">
            {slide.metricValue && (
              <p className="text-[2.25rem] font-extrabold leading-tight" style={{ color: CORAL }}>
                {slide.metricValue}
              </p>
            )}
            {slide.metricLabel && (
              <p className="text-[2.25rem] font-extrabold leading-tight text-white">{slide.metricLabel}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const LogosSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const bg = mediaUrl(slide.backgroundImage)
  const logos = slide.logos ?? []
  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center bg-cover bg-center px-6 py-14"
      style={bg ? { backgroundImage: `url(${bg})` } : { backgroundColor: '#0a2531' }}
    >
      <div className="absolute inset-0 bg-[#06222c]/55" />
      <div className="relative w-full max-w-[1120px]">
        {(slide.gridHeading || slide.gridHighlight) && (
          <h2 className="mb-10 text-center text-[1.5rem] font-bold text-white lg:text-[2rem]">
            {slide.gridHeading}
            {slide.gridHighlight && (
              <>
                {slide.gridHeading ? ' ' : ''}
                <span style={{ color: CORAL }}>{slide.gridHighlight}</span>
              </>
            )}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {logos.map((l, i) => {
            const img = mediaUrl(l.image)
            return (
              <div
                key={i}
                className="flex h-[88px] items-center justify-center rounded-xl bg-white/90 px-6 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)]"
              >
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="max-h-[52px] w-auto max-w-full object-contain" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const ImageSlide: React.FC<{ slide: Slide }> = ({ slide }) => {
  const img = mediaUrl(slide.image)
  if (!img) return null
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0a2531]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" className="h-full w-full object-cover" />
    </div>
  )
}
