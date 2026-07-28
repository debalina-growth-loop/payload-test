import type { Block } from 'payload'

export const DiagramSection: Block = {
  slug: 'diagramSection',
  interfaceName: 'DiagramSectionBlock',
  labels: {
    singular: 'Diagram Section',
    plural: 'Diagram Sections',
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
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading (optional)',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Diagram / image (upload)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Or image URL',
      admin: { description: 'Used if no image is uploaded above.' },
    },
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
