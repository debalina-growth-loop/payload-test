import type { Block } from 'payload'

export const StackBlock: Block = {
  slug: 'stack',
  interfaceName: 'StackBlock',
  labels: {
    singular: 'Stack',
    plural: 'Stacks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'direction',
          type: 'select',
          label: 'Direction',
          defaultValue: 'column',
          options: [
            { label: 'Column (stacked)', value: 'column' },
            { label: 'Row (side by side)', value: 'row' },
          ],
          admin: { width: '34%' },
        },
        {
          name: 'gap',
          type: 'select',
          label: 'Gap',
          defaultValue: 'md',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Extra large', value: 'xl' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'wrap',
          type: 'checkbox',
          label: 'Wrap items',
          defaultValue: false,
          admin: {
            width: '33%',
            condition: (_, siblingData) => siblingData?.direction === 'row',
            description: 'Let items wrap onto multiple lines instead of shrinking to fit.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'align',
          type: 'select',
          label: 'Align (cross-axis)',
          defaultValue: 'stretch',
          options: [
            { label: 'Stretch', value: 'stretch' },
            { label: 'Start', value: 'start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'end' },
          ],
          admin: { width: '34%' },
        },
        {
          name: 'justify',
          type: 'select',
          label: 'Justify (main axis)',
          defaultValue: 'start',
          options: [
            { label: 'Start', value: 'start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'end' },
            { label: 'Space between', value: 'between' },
            { label: 'Space around', value: 'around' },
            { label: 'Space evenly', value: 'evenly' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'stackOnMobile',
          type: 'checkbox',
          label: 'Stack to column on mobile',
          defaultValue: true,
          admin: {
            width: '33%',
            condition: (_, siblingData) => siblingData?.direction === 'row',
            description: 'Below the tablet breakpoint, items stay in a column regardless of direction.',
          },
        },
      ],
    },
    {
      name: 'items',
      type: 'blocks',
      label: 'Blocks',
      admin: {
        initCollapsed: true,
        description:
          'Add any block — this Stack lays them out as a flexbox row or column and controls their spacing/alignment as a group.',
      },
      // Populated in allBlocks.ts with every non-container block — kept
      // empty here to avoid a circular import with that file.
      blocks: [],
    },
  ],
}
