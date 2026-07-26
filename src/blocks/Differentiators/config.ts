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
      name: 'theme',
      type: 'select',
      label: 'Theme',
      defaultValue: 'light',
      options: [
        { label: 'Light (card grid)', value: 'light' },
        { label: 'Dark (accordion + swapping image)', value: 'dark' },
      ],
      admin: {
        description:
          'Dark theme shows a network background, a clickable accordion on the left and a swapping image on the right (like "What sets FarEye Apart?").',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small line above heading, optional)',
    },
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
      label: 'Feature illustration (light theme only, optional, shown on the left)',
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right-side image (dark theme — shown when this card is active)',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Or right-side image URL (dark theme)',
        },
      ],
    },
  ],
}
