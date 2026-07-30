import React, { Fragment } from 'react'

import { blockComponents } from '@/blocks/blockComponents'

type AnyHeroContentBlock = { blockType: string; id?: string | null }

export const RenderHeroContent: React.FC<{ blocks: AnyHeroContentBlock[] }> = ({ blocks }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const Block = (blockComponents as Record<string, React.FC<any>>)[block.blockType]
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
