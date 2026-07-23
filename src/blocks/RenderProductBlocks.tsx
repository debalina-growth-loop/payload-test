import React, { Fragment } from 'react'

import type { Product } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { FeatureChecklistBlock } from '@/blocks/FeatureChecklist/Component'
import { TrustBadgesBlock } from '@/blocks/TrustBadges/Component'
import { SpecsTableBlock } from '@/blocks/SpecsTable/Component'
import { IntegrationsListBlock } from '@/blocks/IntegrationsList/Component'
import { AnnouncementBannerBlock } from '@/blocks/AnnouncementBanner/Component'
import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'

const blockComponents = {
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
  featureChecklist: FeatureChecklistBlock,
  trustBadges: TrustBadgesBlock,
  specsTable: SpecsTableBlock,
  integrationsList: IntegrationsListBlock,
  announcementBanner: AnnouncementBannerBlock,
  sectionHeading: SectionHeadingBlock,
}

export const RenderProductBlocks: React.FC<{
  blocks: NonNullable<Product['layout']>
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
