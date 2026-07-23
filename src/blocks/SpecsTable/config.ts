import type { Block } from 'payload'

export const SpecsTable: Block = {
  slug: 'specsTable',
  interfaceName: 'SpecsTableBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Specifications',
    },
    {
      name: 'specs',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
      minRows: 1,
    },
  ],
  labels: {
    plural: 'Specs Tables',
    singular: 'Specs Table',
  },
}
