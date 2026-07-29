import type { Block } from 'payload'

import { CallToAction } from '../CallToAction/config'
import { FeatureChecklist } from '../FeatureChecklist/config'
import { StyledText } from '../StyledText/config'

export const HeroSectionBlock: Block = {
  slug: 'heroSection',
  interfaceName: 'HeroSectionBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Hero type',
      defaultValue: 'video',
      required: true,
      options: [
        { label: 'Background video/image (full-bleed)', value: 'video' },
        { label: 'Gradient fill (full-bleed)', value: 'gradient' },
        { label: 'Image left / content right', value: 'split' },
        { label: 'None — content only, no media', value: 'none' },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Background / side image or video',
      admin: {
        condition: (_, { type } = {}) => ['video', 'split'].includes(type),
        description:
          'For "Background": full-bleed behind the content. For "Image left": shown in the left column. Accepts an image or a video file.',
      },
    },
    {
      name: 'gradientAngle',
      type: 'number',
      label: 'Gradient angle (degrees)',
      defaultValue: 135,
      admin: {
        condition: (_, { type } = {}) => type === 'gradient',
        width: '50%',
        description: '0 = left to right, 90 = bottom to top, 180 = right to left.',
      },
    },
    {
      name: 'gradientColors',
      type: 'array',
      label: 'Gradient colors',
      labels: { singular: 'Color', plural: 'Colors' },
      minRows: 2,
      admin: {
        condition: (_, { type } = {}) => type === 'gradient',
        initCollapsed: true,
        description: 'At least 2 stops, in order. Hex values.',
      },
      fields: [
        {
          name: 'color',
          type: 'text',
          required: true,
          admin: { placeholder: '#012A36' },
        },
      ],
    },
    {
      name: 'blendImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Blend / accent image',
      admin: {
        condition: (_, { type } = {}) => ['video', 'gradient', 'split'].includes(type),
        description:
          'A decorative graphic (e.g. grid lines) blended into the top half of the hero. For "Background" types it overlays the top of the media; for "Image left" it sits below the right-side content.',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Content (left side)',
      admin: {
        initCollapsed: true,
        description: 'Heading, sub text, a checklist, or CTA buttons — add as many as you need.',
      },
      blocks: [StyledText, FeatureChecklist, CallToAction],
    },
  ],
}
