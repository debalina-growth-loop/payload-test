import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { Navbar } from '@/components/marketing/Navbar'

export async function Header({ variant }: { variant?: 'default' | 'glass' } = {}) {
  const headerData: HeaderType = await getCachedGlobal('header', 2)()
  return <Navbar data={headerData} variant={variant} />
}