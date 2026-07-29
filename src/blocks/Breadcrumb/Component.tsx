import Link from 'next/link'
import React from 'react'

import type { BreadcrumbBlock as BreadcrumbBlockProps } from '@/payload-types'

// Overlays at the top of the page (below the header) instead of taking up
// normal document flow — so it never pushes a full-bleed Hero block down. The
// frosted pill background keeps it legible over any hero style behind it.
export const BreadcrumbBlockComponent: React.FC<BreadcrumbBlockProps> = ({ label }) => {
  return (
    <div className="absolute inset-x-0 top-[10.4rem] z-20">
      <nav aria-label="Breadcrumb" className="container">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
          <Link className="hover:text-white" href="/">
            Home
          </Link>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-white">{label}</span>
        </span>
      </nav>
    </div>
  )
}
