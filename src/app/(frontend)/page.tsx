import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { extractChromeBlocks } from '@/utilities/extractChromeBlocks'
import { SiteChrome } from '@/components/SiteChrome'
import PageClient from './[slug]/page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()

  let page: RequiredDataFromCollectionSlug<'pages'> | null = await queryHome()

  // Fallback until a page with slug "home" exists in the admin
  if (!page) page = homeStatic

  const { hero, layout, hideHeader, hideFooter } = page
  const { header, footer, rest } = extractChromeBlocks(layout, { hideHeader, hideFooter })

  return (
    <SiteChrome header={header} footer={footer}>
      <main>
        <PageClient />
        <PayloadRedirects disableNotFound url="/" />
        {draft && <LivePreviewListener />}

        {/* Hero renders flush to the top so it sits behind the floating navbar */}
        <RenderHero {...hero} />

        {/* Body blocks (empty for a hero-only homepage). Last block hugs the footer. */}
        <div className="[&>div:last-child]:mb-0">
          <RenderBlocks blocks={rest} />
        </div>
      </main>
    </SiteChrome>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryHome()
  return generateMeta({ doc: page })
}

const queryHome = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: 'home' } },
  })

  return result.docs?.[0] || null
})
