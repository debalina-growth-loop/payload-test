import React, { Fragment } from 'react'

import { ButtonBlockComponent } from '@/blocks/ButtonBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { FeatureChecklistBlock } from '@/blocks/FeatureChecklist/Component'
import { LinksBlockComponent } from '@/blocks/LinksBlock/Component'
import { StyledTextBlock } from '@/blocks/StyledText/Component'

// Deliberately separate from RenderProductBlocks: this only ever needs to
// render the block types Hero's own `content` field allows (StyledText,
// FeatureChecklist, CallToAction, Button, Links). Reusing the full
// RenderProductBlocks here would create a circular import (RenderProductBlocks
// -> HeroSection -> RenderProductBlocks), since RenderProductBlocks itself
// renders Hero blocks.
const heroContentComponents = {
  styledText: StyledTextBlock,
  featureChecklist: FeatureChecklistBlock,
  cta: CallToActionBlock,
  buttonBlock: ButtonBlockComponent,
  linksBlock: LinksBlockComponent,
}

type AnyHeroContentBlock = { blockType: string; id?: string | null }

export const RenderHeroContent: React.FC<{ blocks: AnyHeroContentBlock[] }> = ({ blocks }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const Block = (heroContentComponents as Record<string, React.FC<any>>)[block.blockType]
        if (!Block) return null

        return (
          <div className="my-4" key={index}>
            <Block {...block} disableInnerContainer />
          </div>
        )
      })}
    </Fragment>
  )
}
