import type { Block } from 'payload'

export const Differentiators: Block = {
  slug: 'differentiators',
  interfaceName: 'DifferentiatorsBlock',
  labels: {
    singular: 'Differentiators',
    plural: 'Differentiators',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section heading',
      defaultValue: 'What sets us apart?',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading (optional)',
    },
    {
      name: 'illustration',
      type: 'upload',
      relationTo: 'media',
      label: 'Feature illustration (optional, shown on the left)',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Feature cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: 'Icon / image (optional)',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
  ],
}
