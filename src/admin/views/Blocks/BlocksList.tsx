import { getPayload } from 'payload'
import config from '@payload-config'
import type { Field } from 'payload'

import { allBlocks } from '@/blocks/allBlocks'

// Blocks that don't stack as normal content — they're page-level chrome or
// the hero section — grouped separately from everyday content blocks.
const LAYOUT_BLOCK_SLUGS = new Set(['headerBlock', 'footerBlock', 'breadcrumb', 'heroSection'])

function groupFor(block: (typeof allBlocks)[number]): string {
  const explicitGroup = (block.admin as { group?: string } | undefined)?.group
  if (explicitGroup) return explicitGroup
  if (LAYOUT_BLOCK_SLUGS.has(block.slug)) return 'Layout & hero blocks'
  return 'Content blocks'
}

// Fixed display order so the catalog reads top-to-bottom the way you'd build
// a page: chrome/hero first, then everyday content, then product-only extras.
const GROUP_ORDER = ['Layout & hero blocks', 'Content blocks', 'Product blocks']

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
    const label = (typeof field.label === 'string' && field.label) || name || field.type

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

  const rows = allBlocks.map((block) => ({
    slug: block.slug,
    label: block.labels?.singular ? String(block.labels.singular) : block.slug,
    group: groupFor(block),
    fields: describeFields(block.fields),
    usages: usageMap.get(block.slug) ?? [],
  }))

  const groups = new Map<string, typeof rows>()
  rows.forEach((row) => {
    if (!groups.has(row.group)) groups.set(row.group, [])
    groups.get(row.group)!.push(row)
  })

  const orderedGroups = [
    ...GROUP_ORDER.filter((g) => groups.has(g)),
    ...Array.from(groups.keys()).filter((g) => !GROUP_ORDER.includes(g)),
  ]

  return (
    <div className="blocks-overview">
      <p className="blocks-overview__hint">
        Every block type available across the page/product builder — pulled directly from the
        shared block list, so this can&apos;t drift out of sync with what&apos;s actually
        selectable. Editing a block happens inside the page or product that contains it — click a
        usage below to jump straight to it.
      </p>

      {orderedGroups.map((groupName) => {
        const groupRows = groups
          .get(groupName)!
          .sort((a, b) => b.usages.length - a.usages.length || a.label.localeCompare(b.label))

        return (
          <div className="blocks-overview__group" key={groupName}>
            <h4>{`${groupName} (${groupRows.length})`}</h4>
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
                  {groupRows.map((row) => (
                    <tr key={row.slug}>
                      <td>{row.label}</td>
                      <td>
                        <code>{row.slug}</code>
                      </td>
                      <td>
                        <details>
                          <summary>
                            {row.fields.length} field{row.fields.length === 1 ? '' : 's'}
                          </summary>
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
      })}
    </div>
  )
}
