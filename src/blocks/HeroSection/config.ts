import type { Block } from 'payload'

export const HeroSectionBlock: Block = {
  slug: 'heroSection',
  interfaceName: 'HeroSectionBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Hero type',
      defaultValue: 'video',
      required: true,
      options: [
        { label: 'Video background', value: 'video' },
        { label: 'Gradient background', value: 'gradient' },
        { label: 'Solid / transparent background', value: 'solid' },
      ],
      admin: {
        description: 'All three are full-bleed and support a blend/accent image.',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Background image or video',
      admin: {
        condition: (_, { type } = {}) => type === 'video',
        description: 'Full-bleed behind the content. Accepts an image or a video file.',
      },
    },
    {
      name: 'gradientAngle',
      type: 'number',
      label: 'Gradient angle (degrees)',
      defaultValue: 135,
      admin: {
        condition: (_, { type } = {}) => type === 'gradient',
        width: '50%',
        description: '0 = left to right, 90 = bottom to top, 180 = right to left.',
      },
    },
    {
      name: 'gradientColors',
      type: 'array',
      label: 'Gradient colors',
      labels: { singular: 'Color', plural: 'Colors' },
      minRows: 2,
      admin: {
        condition: (_, { type } = {}) => type === 'gradient',
        initCollapsed: true,
        description: 'At least 2 stops, in order. Hex values.',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
          admin: { placeholder: '#012A36' },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background color',
      admin: {
        condition: (_, { type } = {}) => type === 'solid',
        width: '50%',
        placeholder: '#012A36',
        description: 'Hex value. Leave blank for a transparent background.',
      },
    },
    {
      name: 'blendImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Blend / accent image',
      admin: {
        description: 'A decorative graphic (e.g. grid lines) blended into the top half of the hero.',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Content (left side)',
      admin: {
        initCollapsed: true,
        description: 'Add any block to build out the hero content — heading, checklist, CTA, etc.',
      },
      // Populated in allBlocks.ts with every non-container block (kept empty
      // here to avoid a circular import with that file).
      blocks: [],
    },
  ],
}
