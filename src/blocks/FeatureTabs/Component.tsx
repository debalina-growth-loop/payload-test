'use client'

import React, { useState } from 'react'

import type { FeatureTabsBlock } from '@/payload-types'

import RichText from '@/components/RichText'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

export const FeatureTabsComponent: React.FC<FeatureTabsBlock> = ({ heading, tabs }) => {
  const list = tabs ?? []
  const [active, setActive] = useState(0)

  if (list.length === 0) return null

  const cur = list[Math.min(active, list.length - 1)]
  const img = mediaUrl(cur.image)

  return (
    <section className="w-full py-[40px] lg:py-[60px]">
      <div className="mx-auto max-w-[1160px] px-6">
        {heading && (
          <h2 className="mb-12 text-center text-[1rem] font-semibold text-[#012A36] lg:text-[2.60rem]">
            {heading}
          </h2>
        )}

        {/* Tab pills */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {list.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-8 py-3.5 text-[1.05rem] font-bold text-[#012A36] transition-colors ${
                active === i ? 'bg-[#CFE6F0]' : 'bg-[#EAF4F8] hover:bg-[#D9EBF2]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Selected tab content */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-stretch">
          {/* Left: text + stats (fills the image height, stats pinned to the bottom) */}
          <div className="flex w-full flex-col lg:w-5/12">
            {cur.subheading && (
              <h3 className="mb-[30px] text-[20px] font-bold text-[#012A36]">{cur.subheading}</h3>
            )}
            {cur.body && (
              <RichText
                className="mb-5 text-[1.10rem] leading-[1.8]"
                data={cur.body}
                enableGutter={false}
              />
            )}
            {cur.linkLabel && cur.linkUrl && (
              <a
                href={cur.linkUrl}
                className="mb-6 inline-flex w-fit items-center gap-2 text-[1.05rem] font-bold text-[#FF7A64] hover:underline"
              >
                {cur.linkLabel}
                <svg className="w-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 12">
                  <path
                    d="M21.8 5.1 17.5.8c-.5-.5-1.3-.5-1.8 0-.2.2-.4.6-.4.9 0 .3.1.7.4.9l2 2H1.8C1.1 4.7.5 5.3.5 6s.6 1.3 1.3 1.3h15.9l-2 2c-.5.5-.5 1.3 0 1.8.3.3.6.4.9.4.3 0 .7-.1.9-.4l4.2-4.2c.3-.2.4-.6.4-.9 0-.3-.1-.6-.3-.9z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}
            {Array.isArray(cur.stats) && cur.stats.length > 0 && (
              <div className="mt-auto flex flex-col">
                {cur.stats.map((s, i) => {
                  const match = String(s.value ?? '').match(/^([\d.,]+)(.*)$/)
                  const num = match ? match[1] : s.value
                  const suffix = match ? match[2] : ''
                  return (
                    <div key={i} className={`flex items-start ${i > 0 ? '-mt-2' : ''}`}>
                      {/* navy box — in front, digits big + small superscript suffix */}
                      <div className="relative z-20 flex h-[68px] min-w-[124px] shrink-0 items-center justify-center rounded-lg bg-[#0B2233] px-4">
                        <span
                          className="text-[2.3rem] font-extrabold leading-none"
                          style={{ color: '#F15C40' }}
                        >
                          {num}
                          {suffix && (
                            <span className="align-top text-[0.5em] font-extrabold">{suffix}</span>
                          )}
                        </span>
                      </div>
                      {/* grey box — dropped down so it bridges the gap to the next card, behind navy */}
                      <div className="relative z-10 -ml-4 mt-[26px] flex min-h-[60px] max-w-[230px] items-center rounded-lg bg-[#E9E9E9] py-3 pl-7 pr-4">
                        <span className="text-[0.95rem] font-bold leading-snug text-[#012A36]">
                          {s.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right: big image (capped a little smaller, aligned right) */}
          <div className="flex w-full justify-center lg:w-7/12 lg:justify-end">
            {img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt={cur.subheading || cur.label || ''}
                className="w-full max-w-[600px] rounded-[10px]"
                style={{ boxShadow: '-22px 0 38px -20px rgba(1, 42, 54, 0.22)' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
