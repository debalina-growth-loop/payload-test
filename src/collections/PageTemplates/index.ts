import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { allBlocks } from '@/blocks/allBlocks'

export const PageTemplates: CollectionConfig<'page-templates'> = {
  slug: 'page-templates',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Reusable block layouts that pages can copy from or stay synced with.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'usableFor',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Pages', value: 'pages' },
        { label: 'Products', value: 'products' },
      ],
      defaultValue: ['pages', 'products'],
      admin: {
        description: 'Which collections can pick this template.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: allBlocks,
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
