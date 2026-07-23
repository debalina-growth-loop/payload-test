import React from 'react'

import type { Product } from '@/payload-types'

import { RenderProductBlocks } from '@/blocks/RenderProductBlocks'
import RichText from '@/components/RichText'
import { ProductHero } from './Hero'

// Lexical always returns a non-null root with at least one empty paragraph,
// so a plain truthy check can't tell "untouched field" from "has content."
const hasRichTextContent = (data: Product['description']): boolean => {
  if (!data?.root?.children?.length) return false

  return data.root.children.some((node) => {
    const children = (node as { children?: unknown }).children

    if (!Array.isArray(children)) return false

    return children.some(
      (child) => typeof (child as { text?: unknown }).text === 'string' && (child as { text: string }).text.trim().length > 0,
    )
  })
}

export const ProductTemplate: React.FC<Partial<Product>> = (product) => {
  const { ctas, description, heroImage, layout, tagline, title } = product

  return (
    <article className="pb-24">
      <ProductHero ctas={ctas} heroImage={heroImage} tagline={tagline} title={title} />

      {hasRichTextContent(description) && (
        <div className="container mt-16">
          <RichText data={description!} enableGutter={false} />
        </div>
      )}

      <RenderProductBlocks blocks={layout ?? []} />
    </article>
  )
}
