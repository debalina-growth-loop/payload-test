import React from 'react'

import type { CtaBannerBlock } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

/** Built-in monochrome wavy-lines watermark (used when no background image is uploaded). */
function WavyLines() {
  const lines = Array.from({ length: 30 })
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1920 560"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {lines.map((_, i) => {
        const y = -80 + i * 22
        return (
          <path
            key={i}
            d={`M-40 ${y + 150} C 520 ${y + 30}, 1200 ${y + 250}, 1960 ${y + 60}`}
            stroke="#D9C6CE"
            strokeWidth="1"
            opacity="0.55"
          />
        )
      })}
    </svg>
  )
}

export const CtaBannerComponent: React.FC<CtaBannerBlock> = ({
  heading,
  subheading,
  buttons,
  backgroundImage,
}) => {
  const bgUrl = mediaUrl(backgroundImage)

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: '#FDF2F0' }}>
      {bgUrl ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <WavyLines />
      )}

      <div className="relative mx-auto max-w-[1160px] px-6 py-[80px] text-center xl:pb-[100px] xl:pt-[134px]">
        <h2
          className="mx-auto max-w-[570px] text-[2.63rem] font-bold leading-[1.15] lg:text-[3rem]"
          style={{ color: '#012A36' }}
        >
          {heading}
        </h2>

        {subheading && (
          <p className="mx-auto mt-6 max-w-[620px] text-[1.13rem] leading-[1.7] text-[#012A36]/80">
            {subheading}
          </p>
        )}

        {Array.isArray(buttons) && buttons.length > 0 && (
          <div className="mt-[45px] flex flex-wrap justify-center gap-4">
            {buttons.map(({ link }, i) => (
              <CMSLink
                key={i}
                {...link}
                appearance="inline"
                className={
                  link?.appearance === 'outline'
                    ? 'rounded-full border-2 border-[#012A36] px-7 py-3 text-[1.05rem] font-bold text-[#012A36] transition-colors hover:bg-[#012A36] hover:text-white'
                    : 'rounded-full bg-[#FF7A64] px-7 py-3 text-[1.05rem] font-bold text-[#012A36] transition-transform hover:scale-[1.03]'
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
