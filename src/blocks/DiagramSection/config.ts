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
      label: 'Diagram / image',
      required: true,
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
