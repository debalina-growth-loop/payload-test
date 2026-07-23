'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ChevronDownIcon, SearchIcon } from 'lucide-react'

type NavItem = NonNullable<HeaderType['navItems']>[number]

const NavDropdown: React.FC<{ item: NavItem }> = ({ item }) => {
  const [open, setOpen] = useState(false)
  const children = item.children || []

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        className="flex items-center gap-1 text-sm"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {item.link?.label}
        <ChevronDownIcon className="w-4" />
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-30 min-w-[12rem] rounded border border-border bg-background py-2 shadow-md">
          {children.map(({ link }, i) => (
            <li key={i}>
              <CMSLink
                {...link}
                appearance="inline"
                className="block px-4 py-2 text-sm hover:bg-muted"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map((item, i) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0

        if (hasChildren) {
          return <NavDropdown key={i} item={item} />
        }

        return <CMSLink key={i} {...item.link} appearance="link" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
