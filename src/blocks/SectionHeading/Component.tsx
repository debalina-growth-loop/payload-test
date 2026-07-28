import React, { Fragment } from 'react'

import type { SectionHeadingBlock as SectionHeadingBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

const alignmentClassNames = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
} as const

const sizeClassNames = {
  small: 'text-xl md:text-2xl',
  medium: 'text-2xl md:text-3xl',
  large: 'text-3xl md:text-4xl',
  xlarge: 'text-4xl md:text-5xl',
} as const

// Lexical text node format is a bitmask; bit 1 is bold.
// https://lexical.dev/docs/concepts/serialization#text-node
const IS_BOLD = 1

const renderHeadingText = (data: SectionHeadingBlockProps['text']) => {
  const paragraphs = data?.root?.children ?? []

  return paragraphs.map((paragraph, pIndex) => {
    const textNodes = (paragraph as { children?: unknown }).children

    if (!Array.isArray(textNodes)) return null

    return (
      <Fragment key={pIndex}>
        {pIndex > 0 && <br />}
        {textNodes.map((node, i) => {
          const text = (node as { text?: unknown }).text
          const format = (node as { format?: unknown }).format

          if (typeof text !== 'string') return null

          const isBold = typeof format === 'number' && (format & IS_BOLD) !== 0

          return isBold ? <strong key={i}>{text}</strong> : <Fragment key={i}>{text}</Fragment>
        })}
      </Fragment>
    )
  })
}

export const SectionHeadingBlock: React.FC<SectionHeadingBlockProps> = ({
  alignment,
  size,
  text,
}) => {
  return (
    <div className="container">
      <h2
        className={cn(
          alignmentClassNames[alignment ?? 'left'],
          sizeClassNames[size ?? 'medium'],
        )}
      >
        {renderHeadingText(text)}
      </h2>
    </div>
  )
}
