import { getPayload } from 'payload'
import config from '@payload-config'
import type { Block, Field } from 'payload'

import { AnnouncementBanner } from '@/blocks/AnnouncementBanner/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { Banner } from '@/blocks/Banner/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Code } from '@/blocks/Code/config'
import { Content } from '@/blocks/Content/config'
import { CtaBanner } from '@/blocks/CtaBanner/config'
import { DiagramSection } from '@/blocks/DiagramSection/config'
import { Differentiators } from '@/blocks/Differentiators/config'
import { FeatureChecklist } from '@/blocks/FeatureChecklist/config'
import { FeatureTabs } from '@/blocks/FeatureTabs/config'
import { FormBlock } from '@/blocks/Form/config'
import { IntegrationsList } from '@/blocks/IntegrationsList/config'
import { LogoMarquee } from '@/blocks/LogoMarquee/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { PlatformCarousel } from '@/blocks/PlatformCarousel/config'
import { ResourceHub } from '@/blocks/ResourceHub/config'
import { SectionHeading } from '@/blocks/SectionHeading/config'
import { SpecsTable } from '@/blocks/SpecsTable/config'
import { Spotlight } from '@/blocks/Spotlight/config'
import { StatsBanner } from '@/blocks/StatsBanner/config'
import { TestimonialCards } from '@/blocks/TestimonialCards/config'
import { TextVideo } from '@/blocks/TextVideo/config'
import { TrustBadges } from '@/blocks/TrustBadges/config'
import { UpdatesCards } from '@/blocks/UpdatesCards/config'

// The full block catalog — every block available anywhere in the site (Pages, Products).
// Pulled from the real block configs so this view can't drift out of sync with the code.
const ALL_BLOCKS: Block[] = [
  AnnouncementBanner,
  Archive,
  Banner,
  CallToAction,
  Code,
  Content,
  CtaBanner,
  DiagramSection,
  Differentiators,
  FeatureChecklist,
  FeatureTabs,
  FormBlock,
  IntegrationsList,
  LogoMarquee,
  MediaBlock,
  PlatformCarousel,
  ResourceHub,
  SectionHeading,
  SpecsTable,
  Spotlight,
  StatsBanner,
  TestimonialCards,
  TextVideo,
  TrustBadges,
  UpdatesCards,
]

type FieldSummary = {
  key: string
  label: string
  type: string
  children?: FieldSummary[]
}

// Flattens Payload's layout-only field types (row, collapsible, tabs) so the summary
// shows just the fields an editor can actually fill in, and recurses into
// groups/arrays/blocks so nested structure is visible too.
function describeFields(fields: Field[] | undefined, prefix = ''): FieldSummary[] {
  const out: FieldSummary[] = []

  for (const field of fields ?? []) {
    if (field.type === 'row' || field.type === 'collapsible') {
      out.push(...describeFields(field.fields, prefix))
      continue
    }

    if (field.type === 'tabs') {
      field.tabs.forEach((tab) => {
        out.push(...describeFields(tab.fields, prefix))
      })
      continue
    }

    const name = 'name' in field ? field.name : undefined
    const label =
      (typeof field.label === 'string' && field.label) || name || field.type

    const entry: FieldSummary = {
      key: `${prefix}${name || field.type}`,
      label,
      type: field.type,
    }

    if (field.type === 'group' || field.type === 'array') {
      entry.children = describeFields(field.fields, `${entry.key}.`)
    }

    if (field.type === 'blocks') {
      entry.children = field.blocks.map((b) => ({
        key: `${entry.key}.${b.slug}`,
        label: b.labels?.singular ? String(b.labels.singular) : b.slug,
        type: 'block',
      }))
    }

    out.push(entry)
  }

  return out
}

function FieldTree({ fields }: { fields: FieldSummary[] }) {
  if (fields.length === 0) return null

  return (
    <ul className="blocks-overview__field-tree">
      {fields.map((f) => (
        <li key={f.key}>
          <span className="blocks-overview__field-label">{f.label}</span>
          <span className="blocks-overview__field-type">{f.type}</span>
          {f.children && f.children.length > 0 && <FieldTree fields={f.children} />}
        </li>
      ))}
    </ul>
  )
}

type Usage = {
  collection: 'pages' | 'products'
  id: string | number
  title: string
}

function registerUsage(
  usageMap: Map<string, Usage[]>,
  collection: 'pages' | 'products',
  doc: { id: string | number; title?: string | null; layout?: Array<{ blockType: string }> | null },
) {
  for (const block of doc.layout ?? []) {
    if (!usageMap.has(block.blockType)) usageMap.set(block.blockType, [])
    usageMap.get(block.blockType)!.push({ collection, id: doc.id, title: doc.title || 'Untitled' })
  }
}

export async function BlocksList() {
  const payload = await getPayload({ config })

  const [{ docs: pages }, { docs: products }] = await Promise.all([
    payload.find({ collection: 'pages', depth: 0, draft: true, limit: 200 }),
    payload.find({ collection: 'products', depth: 0, draft: true, limit: 200 }),
  ])

  const usageMap = new Map<string, Usage[]>()
  pages.forEach((p) => registerUsage(usageMap, 'pages', p as never))
  products.forEach((p) => registerUsage(usageMap, 'products', p as never))

  const rows = ALL_BLOCKS.map((block) => ({
    slug: block.slug,
    label: block.labels?.singular ? String(block.labels.singular) : block.slug,
    fields: describeFields(block.fields),
    usages: usageMap.get(block.slug) ?? [],
  })).sort((a, b) => b.usages.length - a.usages.length || a.label.localeCompare(b.label))

  return (
    <div className="blocks-overview">
      <p className="blocks-overview__hint">
        Every block type available in the page/product builder — its fields (what you can
        control) and where it&apos;s currently used. Editing a block happens inside the page or
        product that contains it — click a usage below to jump straight to it.
      </p>
      <div className="blocks-overview__scroll">
        <table className="blocks-overview__table">
          <thead>
            <tr>
              <th>Block</th>
              <th>Slug</th>
              <th>Structure (what it controls)</th>
              <th>Used in</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug}>
                <td>{row.label}</td>
                <td>
                  <code>{row.slug}</code>
                </td>
                <td>
                  <details>
                    <summary>{row.fields.length} field{row.fields.length === 1 ? '' : 's'}</summary>
                    <FieldTree fields={row.fields} />
                  </details>
                </td>
                <td>
                  {row.usages.length === 0 ? (
                    <span className="blocks-overview__muted">Not used yet</span>
                  ) : (
                    <div className="blocks-overview__usages">
                      {row.usages.map((u, i) => (
                        <a
                          key={i}
                          href={`/admin/collections/${u.collection}/${u.id}`}
                          className="blocks-overview__usage-link"
                        >
                          {u.title}
                          <span className="blocks-overview__usage-collection">
                            {u.collection === 'pages' ? 'Page' : 'Product'}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
