import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = CTABlockProps & { disableInnerContainer?: boolean }

export const CallToActionBlock: React.FC<Props> = ({ disableInnerContainer, links, richText }) => {
  const content = (
    <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-start md:gap-12">
      {richText && (
        <div className="max-w-[48rem]">
          <RichText className="mb-0" data={richText} enableGutter={false} />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        {(links || []).map(({ link }, i) => (
          <CMSLink key={i} {...link} />
        ))}
      </div>
    </div>
  )

  if (disableInnerContainer) return content

  return <div className="container">{content}</div>
}
