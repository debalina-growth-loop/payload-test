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
      name: 'section',
      type: 'text',
      label: 'Section name',
      defaultValue: 'Products',
      admin: {
        description: 'Shown as the middle segment: Home / <this> / <breadcrumb name>.',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Breadcrumb name',
      admin: {
        description: 'Shown as the last segment: Home / <section> / <this>.',
      },
    },
  ],
}
