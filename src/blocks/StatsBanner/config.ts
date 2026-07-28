import type { Block } from 'payload'

import { linkGroup } from '../../fields/linkGroup'

export const StatsBanner: Block = {
  slug: 'statsBanner',
  interfaceName: 'StatsBannerBlock',
  labels: {
    singular: 'Stats Banner',
    plural: 'Stats Banners',
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
    {
      name: 'stats',
      type: 'array',
      label: 'Stat cards',
      labels: { singular: 'Stat', plural: 'Stats' },
      minRows: 1,
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Value',
              required: true,
              admin: { width: '40%', placeholder: 'e.g. 1.5Bn' },
            },
            {
              name: 'label',
              type: 'text',
              label: 'Label',
              required: true,
              admin: { width: '60%', placeholder: 'e.g. Deliveries' },
            },
          ],
        },
      ],
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        name: 'buttons',
        label: 'Buttons',
        maxRows: 2,
      },
    }),
    {
      name: 'background',
      type: 'select',
      label: 'Background',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Blue', value: 'lightBlue' },
        { label: 'Dark Navy', value: 'dark' },
      ],
    },
  ],
}
