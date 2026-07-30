import React from 'react'

import type { StackBlock as StackBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import { blockComponents } from '@/blocks/blockComponents'

const GAP_CLASSES: Record<string, string> = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-10',
  xl: 'gap-16',
}

const ALIGN_CLASSES: Record<string, string> = {
  stretch: 'items-stretch',
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

const JUSTIFY_CLASSES: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const StackBlockComponent: React.FC<StackBlockProps> = ({
  direction,
  gap,
  align,
  justify,
  wrap,
  stackOnMobile,
  items,
}) => {
  const isRow = direction === 'row'

  return (
    <div
      className={cn(
        'flex',
        isRow ? (stackOnMobile === false ? 'flex-row' : 'flex-col md:flex-row') : 'flex-col',
        isRow && wrap && 'flex-wrap',
        GAP_CLASSES[gap || 'md'],
        ALIGN_CLASSES[align || 'stretch'],
        JUSTIFY_CLASSES[justify || 'start'],
      )}
    >
      {(items ?? []).map((block, index) => {
        const { blockType } = block
        const Block = (blockComponents as Record<string, React.FC<any>>)[blockType]
        if (!Block) return null

        return (
          <div className="min-w-0" key={index}>
            <Block {...block} disableInnerContainer />
          </div>
        )
      })}
    </div>
  )
}
