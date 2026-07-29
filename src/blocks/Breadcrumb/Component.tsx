import Link from 'next/link'
import React from 'react'

import type { BreadcrumbBlock as BreadcrumbBlockProps } from '@/payload-types'

export const BreadcrumbBlockComponent: React.FC<BreadcrumbBlockProps> = ({ label }) => {
  return (
    <nav aria-label="Breadcrumb" className="container pb-4 pt-8 text-sm text-gray-500">
      <Link className="hover:text-gray-900" href="/">
        Home
      </Link>{' '}
      / <span>Products</span> / <span className="text-gray-900">{label}</span>
    </nav>
  )
}
