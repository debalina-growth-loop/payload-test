'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { DifferentiatorsBlock } from '@/payload-types'
import { NetworkAnimation } from '@/components/NetworkAnimation'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

export const DifferentiatorsComponent: React.FC<DifferentiatorsBlock> = ({
  theme,
  eyebrow,
  heading,
  subheading,
  illustration,
  cards,
}) => {
  const list = cards ?? []
  const dark = theme === 'dark'

  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Reveal (slide in) when the section scrolls into view
  useEffect(() => {
    if (!dark) return
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [dark])

  /* ------------------------------- DARK THEME ------------------------------- */
  if (dark) {
    const cur = list[Math.min(active, list.length - 1)]
    const activeImg = cur ? mediaUrl(cur.image) || cur.imageUrl || null : null

    return (
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#07222B 0%,#0A2E3A 100%)' }}
      >
        <NetworkAnimation side="left" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-1 py-[60px] md:px-3 lg:py-[90px]">
          {/* Header */}
          {(eyebrow || heading) && (
            <div className="mb-[60px] text-center">
              {eyebrow && <p className="mb-[20px] text-[1.05rem] text-white/80">{eyebrow}</p>}
              {heading && (
                <h2
                  className="bg-clip-text text-[2rem] font-bold text-transparent lg:text-[3rem]"
                  style={{ backgroundImage: 'linear-gradient(90deg,#FF9A8B,#FF7A64)' }}
                >
                  {heading}
                </h2>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse items-center justify-between gap-10 lg:flex-row">
            {/* LEFT: accordion (slides in from the left) */}
            <div
              className={`w-full transition-all duration-700 ease-out lg:w-1/2 ${
                shown ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
              }`}
            >
              {list.map((card, i) => {
                const isActive = i === active
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`mb-[30px] block w-full cursor-pointer rounded-2xl border border-white/10 p-5 text-left backdrop-blur-md transition-all ${
                      isActive
                        ? 'bg-[linear-gradient(8deg,#fff0,#fff2,#fff3)] shadow-[0_0_2rem_rgba(0,0,0,0.13)]'
                        : 'hover:bg-[linear-gradient(8deg,#fff0,#fff2,#fff3)]'
                    }`}
                  >
                    <h3
                      className={`text-[1.38rem] font-bold transition-colors ${
                        isActive ? 'text-[#FF7A64]' : 'text-white/50 group-hover:text-[#FF7A64]'
                      }`}
                    >
                      {card.title}
                    </h3>
                    {card.description && (
                      <p
                        className={`mt-2 text-[1.15rem] leading-snug transition-opacity ${
                          isActive ? 'text-white opacity-100' : 'text-white opacity-50'
                        }`}
                      >
                        {card.description}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>

            {/* RIGHT: swapping image (slides in from the right) */}
            <div
              className={`flex w-full justify-center transition-all duration-700 ease-out lg:w-1/2 ${
                shown ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
              }`}
            >
              {activeImg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={activeImg}
                  src={activeImg}
                  alt={cur?.title || ''}
                  className="h-auto w-full max-w-[330px] rounded-[8px] drop-shadow-[0_25px_60px_rgba(255,122,100,0.35)]"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ------------------------------- LIGHT THEME ------------------------------ */
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
