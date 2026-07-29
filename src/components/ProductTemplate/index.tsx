import React from 'react'

import type { Product } from '@/payload-types'

import { RenderProductBlocks } from '@/blocks/RenderProductBlocks'

export const ProductTemplate: React.FC<Partial<Product>> = ({ layout }) => {
  return (
    <article className="pb-24">
      <RenderProductBlocks blocks={layout ?? []} />
    </article>
  )
}
