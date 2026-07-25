import React from 'react'

import type { DifferentiatorsBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

export const DifferentiatorsComponent: React.FC<DifferentiatorsBlock> = ({
  heading,
  subheading,
  illustration,
  cards,
}) => {
  const list = cards ?? []
  const illo = mediaUrl(illustration)

  return (
    <section className="w-full bg-[#F4F8FA]">
      <div className="mx-auto max-w-[1160px] px-6 py-[50px] lg:py-[80px]">
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

        <div className="mt-12 flex flex-col items-center gap-10 lg:flex-row lg:items-start">
          {illo && (
            <div className="w-full lg:w-5/12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={illo} alt="" className="mx-auto w-full max-w-[460px]" />
            </div>
          )}

          <div
            className={`grid w-full grid-cols-1 gap-6 sm:grid-cols-2 ${illo ? 'lg:w-7/12' : 'lg:grid-cols-3'}`}
          >
            {list.map((card, i) => {
              const icon = mediaUrl(card.icon)
              return (
                <div
                  key={i}
                  className="flex h-full flex-col rounded-2xl border border-[#012A36]/10 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(1,42,54,0.28)]"
                >
                  {icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={icon} alt="" className="mb-4 h-12 w-12 object-contain" />
                  )}
                  <h3 className="mb-2 text-[1.2rem] font-bold text-[#012A36]">{card.title}</h3>
                  {card.description && (
                    <p className="text-[1rem] leading-[1.6] text-[#012A36]/70">{card.description}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
