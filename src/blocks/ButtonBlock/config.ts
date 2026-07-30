import type { Block } from 'payload'

import { link } from '@/fields/link'

export const ButtonBlock: Block = {
  slug: 'buttonBlock',
  interfaceName: 'ButtonBlockType',
  labels: {
    singular: 'Button',
    plural: 'Buttons',
  },
  fields: [link({ appearances: ['default', 'outline', 'active'] })],
}
