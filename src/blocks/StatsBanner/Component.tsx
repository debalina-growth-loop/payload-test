import React from 'react'

import type { StatsBannerBlock } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const THEMES = {
  white: { bg: '#FFFFFF', text: '#012A36', sub: 'rgba(1,42,54,.7)', card: '#F4F8FA' },
  lightBlue: { bg: '#EAF4F8', text: '#012A36', sub: 'rgba(1,42,54,.7)', card: '#FFFFFF' },
  dark: { bg: '#06222c', text: '#FFFFFF', sub: 'rgba(255,255,255,.7)', card: 'rgba(255,255,255,.06)' },
} as const

/** Split a stat like "1.5Bn" into the leading number and a trailing unit/suffix. */
const splitValue = (value: string) => {
  const match = String(value ?? '').match(/^([\d.,]+)(.*)$/)
  return match ? { num: match[1], suffix: match[2] } : { num: value, suffix: '' }
}

export const StatsBannerComponent: React.FC<StatsBannerBlock> = ({
  heading,
  subheading,
  stats,
  buttons,
  background,
}) => {
  const theme = THEMES[(background as keyof typeof THEMES) || 'white'] || THEMES.white
  const list = stats ?? []

  return (
    <section className="w-full" style={{ backgroundColor: theme.bg }}>
      <div className="mx-auto max-w-[1160px] px-6 py-[60px] text-center lg:py-[90px]">
        <h2
          className="mx-auto max-w-[820px] text-[2rem] font-bold leading-[1.15] lg:text-[2.75rem]"
          style={{ color: theme.text }}
        >
          {heading}
        </h2>

        {subheading && (
          <p
            className="mx-auto mt-6 max-w-[720px] text-[1.13rem] leading-[1.7]"
            style={{ color: theme.sub }}
          >
            {subheading}
          </p>
        )}

        {list.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {list.map((s, i) => {
              const { num, suffix } = splitValue(s.value)
              return (
                <div
                  key={i}
                  className="flex min-w-[220px] flex-1 flex-col items-center rounded-2xl px-8 py-10"
                  style={{ backgroundColor: theme.card, maxWidth: 300 }}
                >
                  <span className="text-[3rem] font-extrabold leading-none lg:text-[3.5rem]" style={{ color: '#FF7A64' }}>
                    {num}
                    {suffix && <span className="text-[0.55em] align-top font-extrabold">{suffix}</span>}
                  </span>
                  <span className="mt-4 text-[1.05rem] font-semibold" style={{ color: theme.text }}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {Array.isArray(buttons) && buttons.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {buttons.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="inline"
                className={
                  link?.appearance === 'outline'
                    ? 'rounded-full border-2 border-[#FF7A64] px-7 py-3 text-[1.05rem] font-bold text-[#FF7A64] transition-colors hover:bg-[#FF7A64] hover:text-white'
                    : 'rounded-full bg-[#FF7A64] px-7 py-3 text-[1.05rem] font-bold text-white transition-transform hover:scale-[1.03]'
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
