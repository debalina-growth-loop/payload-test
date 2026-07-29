import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'

type ChromeVariant = 'default' | 'glass'
type ChromeState = { show?: boolean; variant?: ChromeVariant }

// Header/Footer used to be rendered once in the root layout. Now that a page can
// opt into its own via a Header/Footer block (with its own variant), or hide the
// default entirely, each route renders its own chrome instead, so it can vary
// per page.
export async function SiteChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode
  header?: ChromeState
  footer?: ChromeState
}) {
  const showHeader = header?.show ?? true
  const showFooter = footer?.show ?? true

  return (
    <>
      {showHeader && <Header variant={header?.variant} />}
      {children}
      {showFooter && <Footer variant={footer?.variant} />}
    </>
  )
}
