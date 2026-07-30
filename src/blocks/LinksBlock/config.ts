import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const LinksBlock: Block = {
  slug: 'linksBlock',
  interfaceName: 'LinksBlockType',
  labels: {
    singular: 'Links',
    plural: 'Links',
  },
  fields: [
    linkGroup({
      appearances: ['default', 'outline', 'active'],
      overrides: {
        maxRows: 6,
      },
    }),
  ],
}
