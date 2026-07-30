import React from 'react'

import type { ButtonBlockType as ButtonBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'

type Props = ButtonBlockProps & { disableInnerContainer?: boolean }

export const ButtonBlockComponent: React.FC<Props> = ({ disableInnerContainer, link }) => {
  if (!link) return null

  const content = <CMSLink {...link} />

  if (disableInnerContainer) return content

  return <div className="container">{content}</div>
}
