import type { Block } from 'payload'

export const StyledText: Block = {
  slug: 'styledText',
  interfaceName: 'StyledTextBlock',
  labels: {
    singular: 'Styled Text',
    plural: 'Styled Text',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fontSize',
          type: 'select',
          label: 'Font size',
          defaultValue: 'lg',
          admin: { width: '25%' },
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Base', value: 'base' },
            { label: 'Large', value: 'lg' },
            { label: 'XL', value: 'xl' },
            { label: '2XL', value: '2xl' },
            { label: '3XL', value: '3xl' },
            { label: '4XL', value: '4xl' },
            { label: '5XL', value: '5xl' },
          ],
        },
        {
          name: 'fontFamily',
          type: 'select',
          label: 'Font family',
          defaultValue: 'sans',
          admin: { width: '25%' },
          options: [
            { label: 'Sans (default)', value: 'sans' },
            { label: 'Serif', value: 'serif' },
            { label: 'Mono', value: 'mono' },
          ],
        },
        {
          name: 'bold',
          type: 'checkbox',
          label: 'Bold',
          defaultValue: false,
          admin: { width: '25%' },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Text color',
          admin: {
            width: '25%',
            placeholder: '#FFFFFF',
            description: 'Hex color. Leave blank to inherit.',
          },
        },
      ],
    },
  ],
}
