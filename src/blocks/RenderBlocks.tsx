import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { LogoMarqueeComponent } from '@/blocks/LogoMarquee/Component'
import { TextVideoComponent } from '@/blocks/TextVideo/Component'
import { FeatureTabsComponent } from '@/blocks/FeatureTabs/Component'
import { CtaBannerComponent } from '@/blocks/CtaBanner/Component'
import { UpdatesCardsComponent } from '@/blocks/UpdatesCards/Component'
import { SpotlightComponent } from '@/blocks/Spotlight/Component'
import { StatsBannerComponent } from '@/blocks/StatsBanner/Component'
import { TestimonialCardsComponent } from '@/blocks/TestimonialCards/Component'
import { DifferentiatorsComponent } from '@/blocks/Differentiators/Component'
import { DiagramSectionComponent } from '@/blocks/DiagramSection/Component'
import { ResourceHubComponent } from '@/blocks/ResourceHub/Component'
import { PlatformCarouselComponent } from '@/blocks/PlatformCarousel/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  logoMarquee: LogoMarqueeComponent,
  textVideo: TextVideoComponent,
  featureTabs: FeatureTabsComponent,
  ctaBanner: CtaBannerComponent,
  updatesCards: UpdatesCardsComponent,
  spotlight: SpotlightComponent,
  statsBanner: StatsBannerComponent,
  testimonialCards: TestimonialCardsComponent,
  differentiators: DifferentiatorsComponent,
  diagramSection: DiagramSectionComponent,
  resourceHub: ResourceHubComponent,
  platformCarousel: PlatformCarouselComponent,
}

export const RenderBlocks: React.FC<{
  blocks: NonNullable<Page['layout']>
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
                <div key={index}>
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
