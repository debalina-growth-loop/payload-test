'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

// Full-bleed autoplaying background video, hero text pinned to the left,
// call-to-action buttons pinned to the bottom of the section.
export const VideoHero: React.FC<Page['hero']> = ({ backgroundVideo, richText, links }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex min-h-screen flex-col overflow-hidden text-white"
      data-theme="dark"
    >
      <div className="absolute inset-0 -z-10">
        {backgroundVideo && typeof backgroundVideo === 'object' && (
          <Media
            resource={backgroundVideo}
            videoClassName="h-full w-full object-cover"
            className="h-full w-full"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container flex flex-1 items-center pt-[10.4rem]">
        <div className="max-w-[36.5rem]">
          {richText && <RichText data={richText} enableGutter={false} />}
        </div>
      </div>

      {Array.isArray(links) && links.length > 0 && (
        <div className="container pb-16">
          <ul className="flex flex-wrap gap-4">
            {links.map(({ link }, i) => (
              <li key={i}>
                <CMSLink {...link} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
