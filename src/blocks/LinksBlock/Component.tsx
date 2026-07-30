import React from 'react'

import type { LinksBlockType as LinksBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type Props = LinksBlockProps & { disableInnerContainer?: boolean }

export const LinksBlockComponent: React.FC<Props> = ({ disableInnerContainer, links }) => {
  const content = (
    <div className="flex flex-wrap items-center gap-4">
      {(links || []).map(({ link }, i) => (
        <CMSLink key={i} {...link} />
      ))}
    </div>
  )

  if (disableInnerContainer) return content

  return <div className="container">{content}</div>
}
