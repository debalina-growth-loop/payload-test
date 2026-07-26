import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  UnorderedListFeature,
  OrderedListFeature,
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
      name: 'theme',
      type: 'select',
      label: 'Theme',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark (glassmorphic tabs + glowing card)', value: 'dark' },
      ],
      admin: {
        description:
          'Dark theme uses the glass tab bar, gradient heading and a glowing dark card (like "See FarEye AI in Action").',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow (small line above heading, optional)',
    },
    {
      name: 'listIndent',
      type: 'select',
      label: 'Bullet indent (dark theme)',
      defaultValue: 'flush',
      options: [
        { label: 'Flush left (no space)', value: 'flush' },
        { label: 'Small indent', value: 'small' },
        { label: 'Medium indent', value: 'medium' },
      ],
      admin: { description: 'Controls the left spacing of bullet lists in the dark card.' },
    },
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
              UnorderedListFeature(),
              OrderedListFeature(),
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
              name: 'name',
              type: 'text',
              label: 'Stat name (bold label, dark theme only — optional)',
              admin: { placeholder: 'e.g. Customer Service' },
            },
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
