import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '../../fields/linkGroup'
import { link } from '../../fields/link'

// Recursively remove `required` so a link group becomes fully optional
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeOptional = (field: any) => {
  if (field && typeof field === 'object') {
    if ('required' in field) delete field.required
    if (Array.isArray(field.fields)) field.fields.forEach(makeOptional)
  }
  return field
}

export const TextVideo: Block = {
  slug: 'textVideo',
  interfaceName: 'TextVideoBlock',
  labels: {
    singular: 'Text + Video',
    plural: 'Text + Video',
  },
  fields: [
    // Optional centered heading above the two columns (e.g. "Success Stories")
    {
      type: 'row',
      fields: [
        {
          name: 'sectionHeading',
          type: 'text',
          label: 'Section heading (centered, optional)',
          admin: { width: '50%' },
        },
        {
          name: 'sectionSubheading',
          type: 'text',
          label: 'Section subheading (centered, optional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'mediaPosition',
      type: 'select',
      label: 'Video position',
      defaultValue: 'right',
      options: [
        { label: 'Right (text on left)', value: 'right' },
        { label: 'Left (text on right)', value: 'left' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body (add as many paragraphs/lines as you need)',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      appearances: false,
      overrides: { maxRows: 1 },
    }),
    {
      name: 'linkStyle',
      type: 'select',
      label: 'Link style',
      defaultValue: 'button',
      options: [
        { label: 'Button (outlined pill)', value: 'button' },
        { label: 'Underlined text link', value: 'underline' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo image (optional, shown below the text)',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'videoEmbedUrl',
          type: 'text',
          label: 'Video embed URL',
          admin: {
            width: '50%',
            description: 'Paste a YouTube / Wistia / Vimeo embed URL (used if no file uploaded).',
          },
        },
        {
          name: 'videoFile',
          type: 'upload',
          relationTo: 'media',
          label: 'Or upload a video file',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'background',
      type: 'select',
      label: 'Background',
      defaultValue: 'lightBlue',
      options: [
        { label: 'Light Blue', value: 'lightBlue' },
        { label: 'White', value: 'white' },
      ],
    },
    makeOptional(
      link({
        appearances: false,
        overrides: {
          name: 'bottomLink',
          label: 'Bottom centered link (optional)',
          admin: {
            description: 'Shown centered below the section, e.g. "View More Success Stories".',
          },
        },
      }),
    ),
  ],
}
