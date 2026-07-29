import React, { Fragment } from 'react'

import { BreadcrumbBlockComponent } from '@/blocks/Breadcrumb/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { HeroSectionBlockComponent } from '@/blocks/HeroSection/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { FeatureChecklistBlock } from '@/blocks/FeatureChecklist/Component'
import { TrustBadgesBlock } from '@/blocks/TrustBadges/Component'
import { SpecsTableBlock } from '@/blocks/SpecsTable/Component'
import { IntegrationsListBlock } from '@/blocks/IntegrationsList/Component'
import { AnnouncementBannerBlock } from '@/blocks/AnnouncementBanner/Component'
import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'
import { StyledTextBlock } from '@/blocks/StyledText/Component'

const blockComponents = {
  // Header/Footer are page-level chrome, extracted out before reaching this
  // component (see extractChromeBlocks) — these entries exist only to satisfy
  // the type/lookup below if one somehow slips through unfiltered.
  headerBlock: () => null,
  footerBlock: () => null,
  breadcrumb: BreadcrumbBlockComponent,
  heroSection: HeroSectionBlockComponent,
  content: ContentBlock,
  cta: CallToActionBlock,
  mediaBlock: MediaBlock,
  featureChecklist: FeatureChecklistBlock,
  trustBadges: TrustBadgesBlock,
  specsTable: SpecsTableBlock,
  integrationsList: IntegrationsListBlock,
  announcementBanner: AnnouncementBannerBlock,
  sectionHeading: SectionHeadingBlock,
  styledText: StyledTextBlock,
}

// Blocks that manage their own full-bleed layout/spacing and shouldn't get the
// default `my-16` stacking margin every other block gets.
const NO_WRAPPER_BLOCKS = new Set(['headerBlock', 'footerBlock', 'breadcrumb', 'heroSection'])

// Renders both a Product's top-level `layout` and a Hero block's narrower
// nested `content` array, so this is intentionally looser than either exact
// generated union — each block is dispatched dynamically by `blockType` below.
type AnyProductBlock = { blockType: string; id?: string | null }

export const RenderProductBlocks: React.FC<{
  blocks: AnyProductBlock[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = (blockComponents as Record<string, React.FC<any>>)[blockType]

            if (Block) {
              const content = <Block {...block} disableInnerContainer />

              if (NO_WRAPPER_BLOCKS.has(blockType)) {
                return <Fragment key={index}>{content}</Fragment>
              }

              return (
                <div className="my-16" key={index}>
                  {content}
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
