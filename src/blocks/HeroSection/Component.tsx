import React from 'react'

import type { HeroSectionBlock as HeroSectionBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { RenderProductBlocks } from '@/blocks/RenderProductBlocks'

export const HeroSectionBlockComponent: React.FC<HeroSectionBlockProps> = ({
  content,
  media,
  type,
}) => {
  const heroType = type || 'video'
  const hasMedia = media && typeof media === 'object'

  if (heroType === 'video') {
    return (
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden py-16 text-white">
        <div className="absolute inset-0 -z-10">
          {hasMedia && (
            <Media
              resource={media}
              fill
              priority
              imgClassName="h-full w-full object-cover"
              videoClassName="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container">
          <div className="max-w-xl">
            <RenderProductBlocks blocks={content ?? []} />
          </div>
        </div>
      </div>
    )
  }

  if (heroType === 'split') {
    return (
      <div className="container grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="order-2 lg:order-1">
          {hasMedia && (
            <Media
              resource={media}
              imgClassName="h-auto w-full rounded-2xl object-cover"
              videoClassName="h-auto w-full rounded-2xl object-cover"
            />
          )}
        </div>
        <div className="order-1 lg:order-2">
          <RenderProductBlocks blocks={content ?? []} />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-16">
      <div className="max-w-xl">
        <RenderProductBlocks blocks={content ?? []} />
      </div>
    </div>
  )
}
