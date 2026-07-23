'use client'

import React, { useEffect, useState } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'

// Brand colours (change these to rebrand)
const CORAL = '#FF7A64'
const INK = '#012A36'
const HERO_BG = 'linear-gradient(220deg, #fff9ee 0%, #f3fff9 100%, #ecf9ff 100%)'
const CORAL_GRADIENT = 'linear-gradient(180deg, #FF8A72 0%, #F15C40 100%)'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as any).url === 'string'
    ? (m as any).url
    : null

export const MarketingHero: React.FC<Page['hero']> = (props) => {
  const { prefix, highlights, subtitle, illustration, background, links } = props || {}
  const phrases = (highlights ?? []).map((h) => h.text).filter(Boolean) as string[]
  const illustrationUrl = mediaUrl(illustration)
  const backgroundUrl = mediaUrl(background)

  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (phrases.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 3000)
    return () => clearInterval(t)
  }, [phrases.length])

  return (
    <section
      className="relative -mt-16 flex min-h-screen items-center overflow-hidden"
      style={{ background: HERO_BG }}
    >
      {backgroundUrl && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            top: '-10rem',
            backgroundImage: `url(${backgroundUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            backgroundSize: 'contain',
          }}
        />
      )}

      <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-8 px-6 pb-16 pt-28 lg:grid-cols-2 lg:pt-24">
        {/* LEFT: text */}
        <div className="max-w-[640px]">
          {prefix && (
            <h1 className="text-[2.63rem] font-semibold leading-[1.25] lg:text-[3.75rem]" style={{ color: INK }}>
              {prefix}
            </h1>
          )}

          {phrases.length > 0 && (
            <div className="relative flex h-[5.6rem] items-center overflow-hidden lg:h-[9.5rem]">
              <span
                key={idx}
                className="block bg-clip-text text-[2.63rem] font-semibold leading-[1.25] text-transparent lg:text-[3.75rem]"
                style={{ backgroundImage: CORAL_GRADIENT, animation: 'heroSlideUp .5s ease' }}
              >
                {phrases[idx]}
              </span>
            </div>
          )}

          {subtitle && (
            <p className="mt-[30px] max-w-[570px] text-[1.13rem] leading-[1.7]" style={{ color: 'rgba(1,42,54,.62)' }}>
              {subtitle}
            </p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-[30px] flex flex-wrap gap-[15px]">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className={
                    i === 0
                      ? 'rounded-full border-2 border-transparent bg-[#FF7A64] px-6 py-[0.55rem] text-[1.13rem] font-bold text-white'
                      : 'rounded-full border-2 border-[#FF7A64] bg-transparent px-6 py-[0.55rem] text-[1.13rem] font-bold text-[#FF7A64]'
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: image */}
        <div className="flex justify-center lg:justify-end">
          {illustrationUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={illustrationUrl} alt="" className="h-auto w-full max-w-[600px]" />
          )}
        </div>
      </div>

      <style>{`@keyframes heroSlideUp{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  )
}