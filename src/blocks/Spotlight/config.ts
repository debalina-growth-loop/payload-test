import type { Block } from 'payload'

export const Spotlight: Block = {
  slug: 'spotlight',
  interfaceName: 'SpotlightBlock',
  labels: {
    singular: 'Spotlight Carousel',
    plural: 'Spotlight Carousels',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section heading',
      defaultValue: 'In The Spotlight',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Subheading (optional)',
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background colour',
      defaultValue: 'lightBlue',
      options: [
        { label: 'Light Blue', value: 'lightBlue' },
        { label: 'White', value: 'white' },
        { label: 'Pink', value: 'pink' },
        { label: 'Light Grey', value: 'grey' },
      ],
    },
    {
      name: 'cardType',
      type: 'select',
      label: 'Card type (applies to all cards)',
      defaultValue: 'structured',
      options: [
        { label: 'Structured (logo + text + Read More)', value: 'structured' },
        { label: 'Full image (single clickable image)', value: 'image' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      labels: { singular: 'Card', plural: 'Cards' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Card image (upload)',
          admin: {
            condition: (_data, _sibling, { blockData }) => blockData?.cardType === 'image',
            description: 'Upload OR paste an image URL below.',
          },
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Or image URL',
          admin: {
            condition: (_data, _sibling, { blockData }) => blockData?.cardType === 'image',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Publication logo',
          admin: {
            condition: (_data, _sibling, { blockData }) => blockData?.cardType !== 'image',
          },
        },
        {
          name: 'date',
          type: 'text',
          label: 'Date',
          admin: {
            condition: (_data, _sibling, { blockData }) => blockData?.cardType !== 'image',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Headline',
          admin: {
            condition: (_data, _sibling, { blockData }) => blockData?.cardType !== 'image',
          },
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Excerpt',
          admin: {
            condition: (_data, _sibling, { blockData }) => blockData?.cardType !== 'image',
          },
        },
        { name: 'url', type: 'text', label: 'Full story URL (opens on card / Read More)' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'seeAllLabel',
          type: 'text',
          label: 'See All button label',
          defaultValue: 'See All',
          admin: { width: '50%' },
        },
        {
          name: 'seeAllUrl',
          type: 'text',
          label: 'See All URL',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
