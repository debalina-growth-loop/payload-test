'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

import type { Product } from '@/payload-types'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

type Props = Partial<Pick<Product, 'title' | 'tagline' | 'heroImage' | 'ctas'>>

export const ProductHero: React.FC<Props> = ({ ctas, heroImage, tagline, title }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div
      className="relative -mt-[10.4rem] flex min-h-[80vh] items-center text-white"
      data-theme="dark"
    >
      {heroImage && typeof heroImage === 'object' && (
        <Media
          className="absolute inset-0 -z-20"
          fill
          imgClassName="h-full w-full object-cover"
          videoClassName="h-full w-full object-cover"
          priority
          resource={heroImage}
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="container relative z-10 pt-[10.4rem]">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/80">
          <Link className="hover:text-white" href="/">
            Home
          </Link>{' '}
          / <span>Products</span> / <span className="text-white">{title}</span>
        </nav>

        <h1 className="mb-4 max-w-2xl">{title}</h1>
        {tagline && <p className="mb-8 max-w-xl text-lg font-medium">{tagline}</p>}

        {Array.isArray(ctas) && ctas.length > 0 && (
          <ul className="flex flex-wrap gap-4">
            {ctas.map(({ link }, i) => (
              <li key={i}>
                <CMSLink {...link} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
