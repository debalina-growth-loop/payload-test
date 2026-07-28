import React from 'react'

import type { AnnouncementBannerBlock as AnnouncementBannerBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const AnnouncementBannerBlock: React.FC<AnnouncementBannerBlockProps> = ({
  heading,
  link,
}) => {
  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-3xl bg-[#E7F8F6] p-8 md:p-10">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          preserveAspectRatio="none"
          viewBox="0 0 800 200"
        >
          <path d="M0 40 Q 200 0 400 40 T 800 40" fill="none" stroke="#BFEAE6" strokeWidth="2" />
          <path
            d="M0 100 Q 200 60 400 100 T 800 100"
            fill="none"
            stroke="#BFEAE6"
            strokeWidth="2"
          />
          <path
            d="M0 160 Q 200 120 400 160 T 800 160"
            fill="none"
            stroke="#BFEAE6"
            strokeWidth="2"
          />
        </svg>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {heading && (
            <h3 className="max-w-2xl text-xl font-bold text-[#0B2B3C] md:text-2xl">{heading}</h3>
          )}
          {link?.label && (
            <CMSLink
              {...link}
              appearance="inline"
              className="shrink-0 rounded-full bg-[#FF7A64] px-6 py-3 text-center font-bold text-white hover:bg-[#ff6952]"
            />
          )}
        </div>
      </div>
    </div>
  )
}
