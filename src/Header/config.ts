import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'text', type: 'text', admin: { description: 'Shown when no logo image is set.' } },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 12,
      admin: { initCollapsed: true, components: { RowLabel: '@/Header/RowLabel#RowLabel' } },
      fields: [
        link({ appearances: false }), // the top-level link (label + destination)
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          admin: { initCollapsed: true, description: 'Add sub-links to turn this into a dropdown.' },
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call-to-action button',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        link({
          appearances: false,
          overrides: { admin: { condition: (_, { enabled } = {}) => Boolean(enabled) } },
        }),
      ],
    },
  ],
  hooks: { afterChange: [revalidateHeader] },
}