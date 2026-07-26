import type { Block } from 'payload'

// Shared card fields (featured + side cards use the same shape)
const cardFields = [
  {
    name: 'image',
    type: 'upload' as const,
    relationTo: 'media' as const,
    label: 'Image (upload)',
  },
  {
    name: 'imageUrl',
    type: 'text' as const,
    label: 'Or image URL',
  },
  {
    name: 'title',
    type: 'text' as const,
    label: 'Title',
    required: true,
  },
  {
    name: 'body',
    type: 'textarea' as const,
    label: 'Description',
  },
  {
    name: 'action',
    type: 'select' as const,
    label: 'Action',
    defaultValue: 'watch',
    options: [
      { label: 'Watch (opens video modal)', value: 'watch' },
      { label: 'Read More (link)', value: 'read' },
      { label: 'None', value: 'none' },
    ],
  },
  {
    name: 'actionLabel',
    type: 'text' as const,
    label: 'Action label',
    admin: { placeholder: 'e.g. Watch / Read More' },
  },
  {
    name: 'videoUrl',
    type: 'text' as const,
    label: 'Video embed URL (for Watch)',
    admin: { condition: (_: unknown, sibling: { action?: string }) => sibling?.action === 'watch' },
  },
  {
    name: 'linkUrl',
    type: 'text' as const,
    label: 'Link URL (for Read More)',
    admin: { condition: (_: unknown, sibling: { action?: string }) => sibling?.action === 'read' },
  },
]

export const ResourceHub: Block = {
  slug: 'resourceHub',
  interfaceName: 'ResourceHubBlock',
  labels: {
    singular: 'Resource Hub',
    plural: 'Resource Hubs',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small line above heading, optional)',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'The Intelligence Hub',
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background',
      defaultValue: 'darkGradient',
      options: [
        { label: 'Dark Gradient', value: 'darkGradient' },
        { label: 'Dark Navy', value: 'darkNavy' },
        { label: 'Black', value: 'black' },
      ],
    },
    {
      name: 'featuredCards',
      type: 'array',
      label: 'Featured cards (large, left column)',
      labels: { singular: 'Card', plural: 'Cards' },
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: cardFields,
    },
    {
      name: 'sideCards',
      type: 'array',
      label: 'Side cards (right column)',
      labels: { singular: 'Card', plural: 'Cards' },
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: cardFields,
    },
  ],
}
