import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { pageBlocks } from '@/blocks/pageBlocks'

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
      name: 'layout',
      type: 'blocks',
      blocks: pageBlocks,
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
