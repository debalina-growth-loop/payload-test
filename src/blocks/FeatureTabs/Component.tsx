'use client'

import React, { useState } from 'react'

import type { FeatureTabsBlock } from '@/payload-types'

import RichText from '@/components/RichText'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const Arrow = () => (
  <svg className="w-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 12">
    <path
      d="M21.8 5.1 17.5.8c-.5-.5-1.3-.5-1.8 0-.2.2-.4.6-.4.9 0 .3.1.7.4.9l2 2H1.8C1.1 4.7.5 5.3.5 6s.6 1.3 1.3 1.3h15.9l-2 2c-.5.5-.5 1.3 0 1.8.3.3.6.4.9.4.3 0 .7-.1.9-.4l4.2-4.2c.3-.2.4-.6.4-.9 0-.3-.1-.6-.3-.9z"
      fill="currentColor"
    />
  </svg>
)

export const FeatureTabsComponent: React.FC<FeatureTabsBlock> = ({
  theme,
  eyebrow,
  heading,
  listIndent,
  tabs,
}) => {
  const list = tabs ?? []
  const [active, setActive] = useState(0)

  if (list.length === 0) return null

  const dark = theme === 'dark'
  const listMl =
    listIndent === 'medium' ? '[&_ul]:ml-8' : listIndent === 'small' ? '[&_ul]:ml-4' : '[&_ul]:ml-0'
  const cur = list[Math.min(active, list.length - 1)]
  const img = mediaUrl(cur.image)

  /* ------------------------------- DARK THEME ------------------------------- */
  if (dark) {
    return (
      <section
        className="w-full py-[60px] lg:py-[80px]"
        style={{ background: 'linear-gradient(180deg,#07222B 0%,#0A2E3A 100%)' }}
      >
        <div className="mx-auto max-w-[1320px] px-4 md:px-8">
          {/* Header */}
          {(eyebrow || heading) && (
            <div className="mb-10 text-center">
              {eyebrow && <p className="mb-2 text-[1.25rem] text-white/90">{eyebrow}</p>}
              {heading && (
                <h2
                  className="bg-clip-text text-[2rem] font-bold text-transparent lg:text-[2.7rem]"
                  style={{ backgroundImage: 'linear-gradient(90deg,#FF9A8B,#FF7A64)' }}
                >
                  {heading}
                </h2>
              )}
            </div>
          )}

          {/* Glassmorphic tab bar (single line, scrolls on small screens) */}
          <div
            className="mx-auto mb-8 flex w-fit max-w-full flex-nowrap justify-center gap-1.5 overflow-x-auto rounded-2xl border border-white/10 p-2 backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              background:
                'linear-gradient(8deg, rgba(255,255,255,0), rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
              boxShadow: '0 0 2rem rgba(0,0,0,0.2)',
            }}
          >
            {list.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative cursor-pointer overflow-hidden whitespace-nowrap rounded-lg border-b-2 px-4 py-2.5 text-[14px] uppercase tracking-wide transition-all before:pointer-events-none before:absolute before:inset-y-0 before:left-[-100%] before:z-0 before:w-full before:bg-[linear-gradient(90deg,transparent,rgba(255,121,100,0.2),transparent)] before:transition-[left] before:duration-500 before:content-[''] hover:before:left-full ${
                  active === i
                    ? '-translate-y-0.5 border-[#FF7A64] bg-[#FF7A64]/10 text-[#FF7A64]'
                    : 'border-transparent text-white hover:-translate-y-0.5 hover:border-[#FF7A64] hover:bg-[#FF7A64]/10 hover:text-[#FF7A64]'
                }`}
              >
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Glowing card */}
          <div
            className="flex flex-col items-center gap-10 rounded-[20px] border border-[#FF7A64] p-8 backdrop-blur-md lg:flex-row lg:p-10"
            style={{
              background: 'linear-gradient(135deg,#012a36,#0a3a47)',
              boxShadow:
                '0 0 20px rgba(255,122,100,0.2),0 0 60px rgba(255,122,100,0.1),inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Left: content */}
            <div className="w-full lg:max-w-[50%] lg:flex-1">
              {cur.subheading && (
                <h3 className="mb-5 text-[1.7rem] font-bold text-[#FF7A64] lg:text-[2.1rem]">
                  {cur.subheading}
                </h3>
              )}
              {cur.body && (
                <RichText
                  className={`mb-6 text-[1.2rem] leading-[1.6] text-[#cfd6d8] [&_a]:text-[#FF7A64] [&_li]:text-white [&_p]:mb-4 [&_strong]:text-white [&_ul]:mb-2 [&_ul]:list-inside [&_ul]:list-disc [&_ul]:pl-0 [&_ul]:leading-[1.8] ${listMl}`}
                  data={cur.body}
                  enableGutter={false}
                />
              )}
              {Array.isArray(cur.stats) && cur.stats.length > 0 && (
                <div
                  className={`grid gap-4 ${
                    cur.stats.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {cur.stats.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl border-l-4 border-[#FF7A64] bg-[#FF7A64]/10 p-5 transition-all duration-300 hover:translate-x-[5px] hover:bg-[#FF7A64]/20"
                    >
                      {s.name && (
                        <div className="mb-1 text-[1.05rem] font-bold text-white">{s.name}</div>
                      )}
                      <div className="text-[2.3rem] font-bold leading-none text-[#FF7A64]">
                        {s.value}
                      </div>
                      <div className="mt-2 text-[1.05rem] leading-snug text-white/80">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: image + CTA */}
            <div className="w-full text-center lg:max-w-[45%] lg:flex-1">
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={cur.subheading || cur.label || ''}
                  className="w-full rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
              )}
              {cur.linkLabel && cur.linkUrl && (
                <a
                  href={cur.linkUrl}
                  className="mt-[30px] inline-flex items-center gap-2 rounded-full bg-[#FF7A64] px-9 py-3.5 text-[1.1rem] font-bold text-white transition-transform hover:scale-[1.03]"
                >
                  {cur.linkLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ------------------------------- LIGHT THEME ------------------------------ */
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
                <Arrow />
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
