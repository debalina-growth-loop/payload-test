import Link from 'next/link'
import React from 'react'

import type { BreadcrumbBlock as BreadcrumbBlockProps } from '@/payload-types'

// Overlays at the top of the page, right below where the header ends, instead
// of taking up normal document flow — so it never pushes a full-bleed Hero
// block down.
export const BreadcrumbBlockComponent: React.FC<BreadcrumbBlockProps> = ({ label, section }) => {
  return (
    <div className="absolute inset-x-0 top-20 z-20">
      <nav aria-label="Breadcrumb" className="container">
        <span className="inline-flex items-center gap-1 text-lg text-white">
          <Link className="hover:text-white/80" href="/">
            Home
          </Link>
          <span>/</span>
          <span>{section || 'Products'}</span>
          <span>/</span>
          <span>{label}</span>
        </span>
      </nav>
    </div>
  )
}
