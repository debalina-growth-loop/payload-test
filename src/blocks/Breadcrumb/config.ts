import type { Block } from 'payload'

export const BreadcrumbBlock: Block = {
  slug: 'breadcrumb',
  interfaceName: 'BreadcrumbBlock',
  labels: {
    singular: 'Breadcrumb',
    plural: 'Breadcrumbs',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Breadcrumb name',
      admin: {
        description: 'Shown as the last segment: Home / Products / <this>.',
      },
    },
  ],
}
