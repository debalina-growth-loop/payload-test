import { getPayload } from 'payload'
import config from '@payload-config'
import { Pill } from '@payloadcms/ui/elements/Pill'

import type { Header } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import './index.scss'

const baseClass = 'pages-overview'

const BLOCK_LABELS: Record<string, string> = {
  archive: 'Archive',
  banner: 'Banner',
  cta: 'Call to Action',
  code: 'Code',
  content: 'Content',
  ctaBanner: 'CTA Banner',
  diagramSection: 'Diagram',
  differentiators: 'Differentiators',
  featureTabs: 'Feature Tabs',
  formBlock: 'Form',
  logoMarquee: 'Logo Marquee',
  mediaBlock: 'Media',
  platformCarousel: 'Platform Carousel',
  resourceHub: 'Resource Hub',
  spotlight: 'Spotlight',
  statsBanner: 'Stats Banner',
  testimonialCards: 'Testimonials',
  textVideo: 'Text + Video',
  updatesCards: 'Updates Cards',
}

// Nav links (Header global) can point a page at a different path than its raw
// slug — e.g. the Products dropdown links `ship` to `/products/ship`, not `/ship`.
// Cross-check the header nav so the URL shown here is the one that actually works.
function findNavUrl(header: Header | null, pageId: string | number, slug?: string | null): string | null {
  if (!header?.navItems) return null

  const allLinks = header.navItems.flatMap((item) => [item.link, ...(item.children?.map((c) => c.link) ?? [])])

  for (const link of allLinks) {
    if (!link) continue
    if (link.type === 'reference' && link.reference?.relationTo === 'pages') {
      const refValue = link.reference.value
      const refId = typeof refValue === 'object' ? refValue?.id : refValue
      if (String(refId) === String(pageId)) return link.url || null
    }
    if (link.type === 'custom' && slug && link.url?.endsWith(`/${slug}`)) {
      return link.url
    }
  }

  return null
}

function defaultUrl(slug?: string | null): string {
  if (!slug || slug === 'home') return '/'
  return `/${slug}`
}

export async function PagesOverview() {
  const payload = await getPayload({ config })
  const serverURL = getServerSideURL()

  const [{ docs: pages }, header] = await Promise.all([
    payload.find({
      collection: 'pages',
      depth: 0,
      draft: true,
      limit: 200,
      sort: '-updatedAt',
    }),
    payload.findGlobal({ slug: 'header', depth: 0 }),
  ])

  if (!pages.length) return null

  return (
    <div className={baseClass}>
      <h4>{`Pages (${pages.length})`}</h4>
      <div className={`${baseClass}__scroll`}>
        <table className={`${baseClass}__table`}>
          <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th>Status</th>
              <th>Hero</th>
              <th>Blocks</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => {
              const url = findNavUrl(header, page.id, page.slug) || defaultUrl(page.slug)
              const blocks = page.layout ?? []
              const heroType = page.hero?.type && page.hero.type !== 'none' ? page.hero.type : null

              return (
                <tr key={page.id}>
                  <td>{page.title || <em>Untitled</em>}</td>
                  <td>
                    <code>{url}</code>
                  </td>
                  <td>
                    <Pill
                      size="small"
                      pillStyle={page._status === 'published' ? 'success' : 'light-gray'}
                    >
                      {page._status}
                    </Pill>
                  </td>
                  <td>{heroType || <span className={`${baseClass}__muted`}>—</span>}</td>
                  <td>
                    {blocks.length === 0 ? (
                      <span className={`${baseClass}__muted`}>—</span>
                    ) : (
                      blocks.map((b) => BLOCK_LABELS[b.blockType] || b.blockType).join(', ')
                    )}
                  </td>
                  <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
                  <td className={`${baseClass}__actions`}>
                    <a href={`${serverURL}${url}`} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                    <a href={`/admin/collections/pages/${page.id}`}>Edit</a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
