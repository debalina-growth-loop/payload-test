'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import type { Header, Page, Post } from '@/payload-types'

const CORAL = '#FF7A64'

type Item = { label: string; href: string; children?: { label: string; href: string }[] }
type LinkShape = {
  type?: 'reference' | 'custom' | null
  label?: string | null
  url?: string | null
  reference?: { relationTo: 'pages' | 'posts'; value: string | number | Page | Post } | null
}

function href(link?: LinkShape | null): string {
  if (!link) return '#'
  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value?.slug) {
    const prefix = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}/${link.reference.value.slug}`
  }
  return link.url || '#'
}

function items(data?: Header | null): Item[] {
  return (data?.navItems ?? []).map((it) => ({
    label: it.link?.label || '',
    href: href(it.link as LinkShape),
    children: it.children?.length
      ? it.children.map((c) => ({ label: c.link?.label || '', href: href(c.link as LinkShape) }))
      : undefined,
  }))
}

function DesktopItem({ item, dark }: { item: Item; dark?: boolean }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
  const hasChildren = Boolean(item.children?.length)

  return (
    <li
      className="relative"
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      {/* Active-tab indicator: coral line spanning the label width */}
      {active && (
        <span className="absolute -top-1 left-0 right-0 h-[3px] rounded-full bg-[#FF7A64]" />
      )}
      <Link
        href={item.href}
        aria-expanded={hasChildren ? open : undefined}
        aria-haspopup={hasChildren ? 'true' : undefined}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
        className={`flex items-center gap-1 py-2 text-[1.05rem] font-semibold hover:text-[#FF7A64] ${
          active
            ? dark
              ? 'text-white'
              : 'text-[#FF7A64]'
            : dark
              ? 'text-white/90'
              : 'text-gray-800'
        }`}
      >
        {item.label}
        {item.children?.length ? (
          <ChevronDown className="mt-0.5 h-4 w-4" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        ) : null}
      </Link>
      {item.children?.length && open ? (
        <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
          <ul className="overflow-hidden rounded-xl border border-gray-100 bg-white py-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]">
            {item.children.map((c, i) => (
              <li key={i}>
                <Link href={c.href} className="block px-6 py-2.5 text-[1.02rem] font-medium text-gray-700 hover:bg-[#FDEDE8] hover:text-[#FF7A64]">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

// Routes that use the dark, transparent navbar (overlaying a dark hero).
// Add more paths here to give other pages the dark treatment.
const DARK_NAV_ROUTES = ['/platform']

export const Navbar: React.FC<{ data?: Header | null }> = ({ data }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const dark = DARK_NAV_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const list = items(data)
  const logo = data?.logo
  const logoUrl = logo && typeof logo.image === 'object' && logo.image?.url ? logo.image.url : null
  const cta = data?.ctaButton
  const showCta = cta && cta.enabled !== false && cta.link?.label

  return (
    // Light routes: sticky white card (takes flow space).
    // Dark routes: fixed, so the navbar OVERLAYS the dark hero behind it.
    <div className={`z-50 px-4 ${dark ? 'fixed inset-x-0 top-0' : 'sticky top-0'}`}>
      <header
        className={`mx-auto max-w-[1360px] rounded-2xl border transition-colors duration-300 ${
          dark ? '' : 'border-transparent bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)]'
        }`}
        // Dark routes: FarEye's frosted white-glass navbar (from the inspected styles)
        style={
          dark
            ? {
                background: 'linear-gradient(8deg, #fff0, #fff2, #fff3)',
                border: '1px solid #fff2',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                boxShadow: '0 0 2rem #0002',
              }
            : undefined
        }
      >
        <div
          className={`flex items-center justify-between px-6 transition-all duration-300 md:px-8 ${
            scrolled ? 'py-2' : 'py-3.5'
          }`}
        >
          <Link
            href="/"
            aria-label="Home"
            className="inline-flex items-center text-[1.55rem] font-bold text-gray-900"
          >
            {logoUrl ? (
              // On scroll, crop the width so only the left icon of the logo shows
              <span
                className={`block overflow-hidden transition-all duration-300 ${
                  scrolled ? 'w-9' : 'w-auto'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={logo?.text || 'Logo'}
                  className="h-9 w-auto max-w-none object-left transition-all duration-300"
                  // On the dark navbar, render the logo pure white to match the dark hero
                  style={dark ? { filter: 'brightness(0) invert(1)' } : undefined}
                />
              </span>
            ) : (
              <span className={`${scrolled ? 'hidden' : 'inline'} ${dark ? 'text-white' : ''}`}>
                {logo?.text || 'Logo'}
              </span>
            )}
          </Link>

          <nav className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {list.map((item, i) => (
                <DesktopItem key={i} item={item} dark={dark} />
              ))}
            </ul>
          </nav>

          {showCta && (
            <Link
              href={href(cta!.link as LinkShape)}
              className={`hidden rounded-full px-6 py-2.5 text-[1.05rem] font-bold xl:inline-block ${
                dark ? 'text-[#06222c]' : 'text-white'
              }`}
              style={{ backgroundColor: CORAL }}
            >
              {cta!.link!.label}
            </Link>
          )}

          <button
            className={`xl:hidden ${dark ? 'text-white' : ''}`}
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="mx-auto max-w-[1360px] px-6 pb-4 xl:hidden">
            <ul className={`flex flex-col divide-y ${dark ? 'divide-white/10' : 'divide-gray-100'}`}>
              {list.map((item, i) => (
                <li key={i} className="py-1">
                  <Link
                    href={item.href}
                    className={`block py-2.5 text-lg font-semibold ${dark ? 'text-white' : ''}`}
                    onClick={(e) => {
                      if (item.children?.length) {
                        e.preventDefault()
                        return
                      }
                      setMobileOpen(false)
                    }}
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((c, j) => (
                    <Link
                      key={j}
                      href={c.href}
                      className={`block py-1.5 pl-4 text-base ${dark ? 'text-white/70' : 'text-gray-600'}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  )
}