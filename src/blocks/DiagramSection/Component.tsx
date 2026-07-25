import React from 'react'

import type { DiagramSectionBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const THEMES = {
  white: { bg: '#FFFFFF', text: '#012A36', sub: 'rgba(1,42,54,.7)' },
  lightBlue: { bg: '#EAF4F8', text: '#012A36', sub: 'rgba(1,42,54,.7)' },
  dark: { bg: '#06222c', text: '#FFFFFF', sub: 'rgba(255,255,255,.7)' },
} as const

export const DiagramSectionComponent: React.FC<DiagramSectionBlock> = ({
  heading,
  subheading,
  image,
  background,
}) => {
  const img = mediaUrl(image)
  const theme = THEMES[(background as keyof typeof THEMES) || 'white'] || THEMES.white

  return (
    <section className="w-full" style={{ backgroundColor: theme.bg }}>
      <div className="mx-auto max-w-[1200px] px-6 py-[50px] text-center lg:py-[80px]">
        {heading && (
          <h2 className="mx-auto max-w-[860px] text-2xl font-bold leading-[1.15] lg:text-[2.6rem]" style={{ color: theme.text }}>
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mt-5 max-w-[720px] text-[1.13rem] leading-[1.7]" style={{ color: theme.sub }}>
            {subheading}
          </p>
        )}
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={heading || ''} className="mx-auto mt-12 h-auto w-full max-w-[1080px]" />
        )}
      </div>
    </section>
  )
}
