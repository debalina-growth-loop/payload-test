import React from 'react'
import Link from 'next/link'

import type { TestimonialCardsBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

export const TestimonialCardsComponent: React.FC<TestimonialCardsBlock> = ({
  heading,
  subheading,
  cards,
}) => {
  const list = cards ?? []
  if (list.length === 0) return null

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1160px] px-6 py-[40px] lg:py-[60px]">
        {heading && (
          <h2 className="text-center text-2xl font-bold text-[#012A36] lg:text-[2.6rem]">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mt-5 max-w-[720px] text-center text-[1.13rem] leading-[1.7] text-[#012A36]/70">
            {subheading}
          </p>
        )}

        <div className="mt-12 flex flex-wrap justify-center gap-[30px]">
          {list.map((card, i) => {
            const logo = mediaUrl(card.logo)
            const inner = (
              <div className="flex h-full w-full flex-col rounded-2xl border border-[#012A36]/10 bg-white p-8 text-left transition-shadow duration-300 hover:shadow-[0_20px_45px_-20px_rgba(1,42,54,0.28)]">
                {logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt="" className="mb-6 h-9 w-auto object-contain" />
                )}
                {card.quote && (
                  <p className="mb-6 flex-grow text-[1.1rem] leading-[1.7] text-[#012A36]/85">
                    “{card.quote}”
                  </p>
                )}
                {card.author && (
                  <p className="mb-6 text-[0.95rem] font-semibold text-[#012A36]/70">{card.author}</p>
                )}
                {(card.metricValue || card.metricLabel) && (
                  <div className="mt-auto border-t border-[#012A36]/10 pt-6">
                    {card.metricValue && (
                      <div className="text-[2.4rem] font-extrabold leading-none text-[#FF7A64]">
                        {card.metricValue}
                      </div>
                    )}
                    {card.metricLabel && (
                      <div className="mt-2 text-[1rem] font-semibold text-[#012A36]">
                        {card.metricLabel}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )

            const cls = 'w-full sm:w-[calc(50%-15px)] lg:w-[360px]'
            return card.url ? (
              <Link key={i} href={card.url} className={cls}>
                {inner}
              </Link>
            ) : (
              <div key={i} className={cls}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
