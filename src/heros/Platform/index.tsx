'use client'

import React from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { NetworkAnimation } from '@/components/NetworkAnimation'

// Brand colours (change these to rebrand)
const CORAL = '#FF7A64'
// Dark navy backdrop used across the platform hero
const HERO_BG = 'linear-gradient(105deg, #01242f, #0c2731, #263037, #012430)'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

/**
 * Platform hero — dark background with a simple constellation graphic on the left,
 * left text with an inline coral highlight word, subtitle, up to two buttons, and a
 * right-side AI graphic. Reuses the shared hero fields (prefix, highlights, subtitle,
 * illustration, background, links).
 */
export const PlatformHero: React.FC<Page['hero']> = (props) => {
  const { prefix, highlights, subtitle, illustration, links } = props || {}
  const phrases = (highlights ?? []).map((h) => h.text).filter(Boolean) as string[]
  const illustrationUrl = mediaUrl(illustration)

  return (
    <section
      className="relative -mt-16 flex min-h-screen items-center overflow-hidden"
      style={{ background: HERO_BG }}
    >
      {/* Shared SVG constellation on the left */}
      <NetworkAnimation side="left" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-8 px-6 pb-16 pt-28 lg:grid-cols-2 lg:pt-24">
        {/* LEFT: text */}
        <div className="max-w-[640px]">
          {(prefix || phrases.length > 0) && (
            <h1 className="text-[2.63rem] font-semibold leading-[1.3] text-white lg:text-[3.75rem] lg:leading-[1.25]">
              {prefix}
              {phrases.length > 0 && (
                <>
                  {prefix ? ' ' : ''}
                  <span style={{ color: CORAL }}>{phrases.join(' ')}</span>
                </>
              )}
            </h1>
          )}

          {subtitle && (
            <p className="mt-[30px] max-w-[570px] text-[20px] leading-[1.6] text-white/70">
              {subtitle}
            </p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-[36px] flex flex-wrap gap-[15px]">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className={
                    i === 0
                      ? 'rounded-full border-2 border-transparent bg-[#FF7A64] px-7 py-[0.6rem] text-[1.13rem] font-bold text-white transition-transform hover:scale-[1.03]'
                      : 'rounded-full border-2 border-white/80 bg-transparent px-7 py-[0.6rem] text-[1.13rem] font-bold text-white transition-colors hover:bg-white hover:text-[#06222c]'
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: AI graphic */}
        <div className="flex justify-center lg:justify-end">
          {illustrationUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={illustrationUrl}
              alt=""
              width={544}
              height={547}
              className="mx-auto h-auto w-full max-w-[544px]"
            />
          )}
        </div>
      </div>
    </section>
  )
}
