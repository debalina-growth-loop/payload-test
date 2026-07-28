import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const CtaBanner: Block = {
  slug: 'ctaBanner',
  interfaceName: 'CtaBannerBlock',
  labels: {
    singular: 'CTA Banner',
    plural: 'CTA Banners',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading (optional)',
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'buttons',
        label: 'Buttons',
        maxRows: 3,
      },
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background wavy lines (optional)',
      admin: { description: 'Falls back to a plain pink background if empty.' },
    },
  ],
}
