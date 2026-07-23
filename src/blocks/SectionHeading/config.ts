import type { Block } from 'payload'

import { BoldFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const SectionHeading: Block = {
  slug: 'sectionHeading',
  interfaceName: 'SectionHeadingBlock',
  fields: [
    {
      name: 'text',
      type: 'richText',
      editor: lexicalEditor({
        features: [BoldFeature(), FixedToolbarFeature()],
      }),
      label: 'Heading',
      required: true,
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      required: true,
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
        {
          label: 'Extra Large',
          value: 'xlarge',
        },
      ],
      required: true,
    },
  ],
  labels: {
    plural: 'Section Headings',
    singular: 'Section Heading',
  },
}
