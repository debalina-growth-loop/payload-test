'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import type { UpdatesCardsBlock } from '@/payload-types'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

const Arrow = () => (
  <svg className="w-[21px] translate-y-px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 12">
    <path
      d="M21.8 5.1 17.5.8c-.5-.5-1.3-.5-1.8 0-.2.2-.4.6-.4.9 0 .3.1.7.4.9l2 2H1.8C1.1 4.7.5 5.3.5 6s.6 1.3 1.3 1.3h15.9l-2 2c-.5.5-.5 1.3 0 1.8.3.3.6.4.9.4.3 0 .7-.1.9-.4l4.2-4.2c.3-.2.4-.6.4-.9 0-.3-.1-.6-.3-.9z"
      fill="currentColor"
    />
  </svg>
)

// Flat by default (no border/shadow); shadow on left/right/bottom only on hover.
// Fixed ~360px card width (full on mobile, half on small screens).
const CARD_CLASS =
  'group flex h-full w-full flex-col overflow-hidden rounded-[8px] bg-white text-left transition-shadow duration-300 hover:shadow-[-10px_14px_28px_-12px_rgba(1,42,54,0.22),10px_14px_28px_-12px_rgba(1,42,54,0.22)] sm:w-[calc(50%-15px)] lg:w-[360px]'

export const UpdatesCardsComponent: React.FC<UpdatesCardsBlock> = ({ heading, cards }) => {
  const list = cards ?? []
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  if (list.length === 0) return null

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1188px] px-6 py-[40px] lg:py-[60px]">
        {heading && (
          <h2 className="mb-8 text-2xl font-bold text-[#012A36] lg:mb-14 lg:text-[2.63rem]">
            {heading}
          </h2>
        )}

        <div className="flex flex-wrap justify-center gap-[30px]">
          {list.map((card, i) => {
            const img = mediaUrl(card.image)
            const overlay = (card.overlayLines ?? []).filter((l) => l.text)
            const label = card.actionLabel || (card.action === 'watch' ? 'Watch' : 'Download')

            const inner = (
              <>
                {/* Image + optional overlay */}
                <div className="relative h-[240px] w-full shrink-0 bg-[#CFE0EA]">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                  {overlay.length > 0 && (
                    <>
                      <div className="absolute inset-0 bg-[#012A36]/45" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center">
                        {overlay.map((l, j) => (
                          <span
                            key={j}
                            className={`text-[1.4rem] font-bold leading-tight ${
                              l.highlight ? 'text-[#FF7A64]' : 'text-white'
                            }`}
                          >
                            {l.text}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Badges straddling the image edge:
                    wide light-pink pill (category, right-aligned) + solid "Case study" pill over its left */}
                {(card.badgeType || card.badgeCategory) && (
                  <div className="relative z-10 -translate-y-1/2 px-5">
                    <div className="relative">
                      {card.badgeCategory ? (
                        <>
                          {/* wide pill: white base + 50% pink overlay */}
                          <div className="relative overflow-hidden rounded-full">
                            <div className="absolute inset-0 bg-white" />
                            <div
                              className="absolute inset-0 opacity-50"
                              style={{ backgroundColor: '#f2e2ea' }}
                            />
                            <div className="relative px-[1.13rem] py-[0.65rem] text-right text-[0.88rem] font-medium leading-[1.25] text-[#012A36]">
                              {card.badgeCategory}
                            </div>
                          </div>
                          {card.badgeType && (
                            <div
                              className="absolute left-0 top-0 rounded-full px-[1.13rem] py-[0.65rem] text-[0.88rem] font-medium leading-[1.25] text-[#012A36]"
                              style={{ backgroundColor: '#f2e2ea' }}
                            >
                              {card.badgeType}
                            </div>
                          )}
                        </>
                      ) : (
                        card.badgeType && (
                          <div
                            className="inline-block rounded-full px-[1.13rem] py-[0.65rem] text-[0.88rem] font-medium leading-[1.25] text-[#012A36]"
                            style={{ backgroundColor: '#f2e2ea' }}
                          >
                            {card.badgeType}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Title + action */}
                <div className="flex flex-1 flex-col px-5 pb-8">
                  {card.title && (
                    <p className="mb-6 flex-grow text-[1.35rem] leading-snug text-[#012A36]">
                      {card.title}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-3 text-[1.1rem] font-bold text-[#012A36] transition-colors group-hover:text-[#FF7A64]">
                    {label}
                    <Arrow />
                  </span>
                </div>
              </>
            )

            // Watch -> button that opens the modal; Download -> link to URL
            if (card.action === 'watch') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => card.videoUrl && setActiveVideo(card.videoUrl)}
                  className={`${CARD_CLASS} cursor-pointer`}
                >
                  {inner}
                </button>
              )
            }
            return (
              <Link key={i} href={card.downloadUrl || '#'} className={CARD_CLASS}>
                {inner}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[900px]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-3xl leading-none text-white"
            >
              ×
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={activeVideo}
                title="Video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
