import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FeatureTabs: Block = {
  slug: 'featureTabs',
  interfaceName: 'FeatureTabsBlock',
  labels: {
    singular: 'Feature Tabs',
    plural: 'Feature Tabs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section heading',
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Tabs',
      labels: { singular: 'Tab', plural: 'Tabs' },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Tab label (pill)',
          required: true,
        },
        {
          name: 'subheading',
          type: 'text',
          label: 'Content heading',
        },
        {
          name: 'body',
          type: 'richText',
          label: 'Content text',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
        {
          name: 'stats',
          type: 'array',
          label: 'Highlight stats',
          labels: { singular: 'Stat', plural: 'Stats' },
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Value',
                  required: true,
                  admin: { width: '40%', placeholder: 'e.g. 75M+' },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                  admin: { width: '60%', placeholder: 'e.g. Kilometers Saved via Route Optimization' },
                },
              ],
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Right-side image',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkLabel',
              type: 'text',
              label: 'CTA label (optional)',
              admin: { width: '40%', placeholder: 'e.g. Learn More' },
            },
            {
              name: 'linkUrl',
              type: 'text',
              label: 'CTA URL (optional)',
              admin: { width: '60%' },
            },
          ],
        },
      ],
    },
  ],
}
