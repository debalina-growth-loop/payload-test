import React from 'react'

import type { HeroSectionBlock as HeroSectionBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { RenderHeroContent } from './RenderHeroContent'

export const HeroSectionBlockComponent: React.FC<HeroSectionBlockProps> = ({
  backgroundColor,
  blendImage,
  content,
  gradientAngle,
  gradientColors,
  media,
  type,
}) => {
  // Unrecognized/legacy type values (e.g. the old "split"/"none" options)
  // fall back to "solid" so old saved data doesn't render broken.
  const heroType = type === 'video' || type === 'gradient' ? type : 'solid'
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

  const blendUrl =
    hasBlend && typeof blendImage === 'object'
      ? getMediaUrl(blendImage.url, blendImage.updatedAt)
      : undefined

  const solidStyle = heroType === 'solid' ? { backgroundColor: backgroundColor || 'transparent' } : undefined

  // All three types are full-bleed and always start at the very top of the
  // screen — the header floats over them (fixed/glass), so pulling the hero up
  // by the header's height means it's never pushed down by header or breadcrumb.
  return (
    <div
      className={`relative -mt-[10.4rem] flex min-h-screen flex-col justify-center overflow-hidden py-16 ${
        heroType === 'solid' ? '' : 'text-white'
      }`}
    >
      <div className="absolute inset-0 -z-20" style={gradientStyle ?? solidStyle}>
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

      {blendUrl && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            top: '-10rem',
            backgroundImage: `url(${blendUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            // `contain` shrinks to fit height, which can leave gaps on either
            // side depending on the image's aspect ratio. Forcing full width
            // guarantees it always reaches both edges of the screen; height
            // scales proportionally and any excess is clipped by the hero's
            // own `overflow-hidden`.
            backgroundSize: '100% auto',
          }}
        />
      )}

      <div className="container">
        <div className="max-w-xl">
          <RenderHeroContent blocks={content ?? []} />
        </div>
      </div>
    </div>
  )
}
