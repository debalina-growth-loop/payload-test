import React from 'react'

import type { HeroSectionBlock as HeroSectionBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { RenderProductBlocks } from '@/blocks/RenderProductBlocks'

export const HeroSectionBlockComponent: React.FC<HeroSectionBlockProps> = ({
  blendImage,
  content,
  gradientAngle,
  gradientColors,
  media,
  type,
}) => {
  const heroType = type || 'video'
  const hasMedia = media && typeof media === 'object'
  const hasBlend = blendImage && typeof blendImage === 'object'

  const gradientStyle =
    heroType === 'gradient' && Array.isArray(gradientColors) && gradientColors.length >= 2
      ? {
          background: `linear-gradient(${gradientAngle ?? 135}deg, ${gradientColors
            .map((c) => c.color)
            .join(', ')})`,
        }
      : undefined

  // Full-bleed types (video/gradient) always start at the very top of the
  // screen — the header floats over them (fixed/glass), so pulling the hero up
  // by the header's height means it's never pushed down by header or breadcrumb.
  if (heroType === 'video' || heroType === 'gradient') {
    return (
      <div className="relative -mt-[10.4rem] flex min-h-screen flex-col justify-center overflow-hidden py-16 text-white">
        <div className="absolute inset-0 -z-20" style={gradientStyle}>
          {heroType === 'video' && hasMedia && (
            <Media
              resource={media}
              fill
              priority
              imgClassName="h-full w-full object-cover"
              videoClassName="h-full w-full object-cover"
            />
          )}
          {heroType === 'video' && <div className="absolute inset-0 bg-black/40" />}
        </div>

        {hasBlend && (
          <div className="absolute inset-x-0 top-0 -z-10 h-1/2 mix-blend-screen">
            <Media resource={blendImage} fill imgClassName="h-full w-full object-cover" />
          </div>
        )}

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

          {hasBlend && (
            <div className="pointer-events-none relative mt-6 h-48 w-full mix-blend-screen">
              <Media resource={blendImage} fill imgClassName="h-full w-full object-cover" />
            </div>
          )}
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
