import React from 'react'

import type { TrustBadgesBlock as TrustBadgesBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const TrustBadgesBlock: React.FC<TrustBadgesBlockProps> = ({ heading, badges }) => {
  return (
    <div className="container">
      {heading && <p className="mb-4 text-sm text-muted-foreground">{heading}</p>}
      {Array.isArray(badges) && badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-6">
          {badges.map((badge, i) => {
            const logo = badge.logo

            if (!logo || typeof logo !== 'object') return null

            const content = <Media imgClassName="h-8 w-auto object-contain" resource={logo} />

            return (
              <div key={i}>
                {badge.url ? (
                  <a href={badge.url} rel="noopener noreferrer" target="_blank">
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
