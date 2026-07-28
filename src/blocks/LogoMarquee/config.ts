import type { Block, Option } from 'payload'

// 1x = normal baseline, up to 7x
const MULTIPLIER_OPTIONS: Option[] = [
  { label: '1x (Normal)', value: '1' },
  { label: '2x', value: '2' },
  { label: '3x', value: '3' },
  { label: '4x', value: '4' },
  { label: '5x', value: '5' },
  { label: '6x', value: '6' },
  { label: '7x', value: '7' },
]

export const LogoMarquee: Block = {
  slug: 'logoMarquee',
  interfaceName: 'LogoMarqueeBlock',
  labels: {
    singular: 'Logo Marquee',
    plural: 'Logo Marquees',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: { description: 'Optional. Leave empty to hide the coloured heading bar.' },
      defaultValue: "Trusted by the world's top brands",
    },
    {
      type: 'row',
      fields: [
        {
          name: 'speed',
          type: 'select',
          label: 'Scroll speed (higher = faster)',
          defaultValue: '1',
          admin: { width: '33%' },
          options: MULTIPLIER_OPTIONS,
        },
        {
          name: 'spacing',
          type: 'select',
          label: 'Spacing between images',
          defaultValue: '1',
          admin: { width: '33%' },
          options: MULTIPLIER_OPTIONS,
        },
        {
          name: 'size',
          type: 'select',
          label: 'Image size',
          defaultValue: '1',
          admin: { width: '33%' },
          options: MULTIPLIER_OPTIONS,
        },
      ],
    },
    {
      name: 'bordered',
      type: 'checkbox',
      label: 'Show each image in a bordered card (award badges)',
      defaultValue: false,
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      labels: { singular: 'Logo', plural: 'Logos' },
      minRows: 1,
      admin: {
        initCollapsed: true,
        description: 'Upload each client logo. They scroll automatically.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
