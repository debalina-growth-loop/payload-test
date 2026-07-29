import type { CollectionConfig } from 'payload'

import { APIError } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { templateBlocks } from '@/blocks/templateBlocks'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateProduct } from './hooks/revalidateProduct'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Used to generate the URL slug and shown in the admin list — not displayed on the page itself. Build the visible page from the blocks below.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              admin: {
                initCollapsed: true,
              },
              blocks: templateBlocks,
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        {
          name: 'hideHeader',
          type: 'checkbox',
          label: 'Hide header',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Skip the header entirely. Ignored if a Header block is in the layout.',
          },
        },
        {
          name: 'hideFooter',
          type: 'checkbox',
          label: 'Hide footer',
          defaultValue: false,
          admin: {
            width: '50%',
            description: 'Skip the footer entirely. Ignored if a Footer block is in the layout.',
          },
        },
      ],
    },
    slugField(),
    {
      name: 'template',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'templateRef',
          type: 'relationship',
          relationTo: 'page-templates',
          label: 'Page template',
          filterOptions: {
            or: [{ usableFor: { in: ['products'] } }, { usableFor: { exists: false } }],
          },
          admin: {
            description: 'Optionally base this product on a reusable template.',
          },
        },
        {
          name: 'syncWithTemplate',
          type: 'checkbox',
          label: 'Keep synced with template',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.templateRef),
            description:
              "On: this product always renders the template's current blocks instead of its own. Off: use the button below to copy the template's blocks in once, then edit them independently.",
          },
        },
        {
          name: 'applyTemplate',
          type: 'ui',
          admin: {
            condition: (_, siblingData) =>
              Boolean(siblingData?.templateRef) && !siblingData?.syncWithTemplate,
            components: {
              Field: '@/components/ApplyTemplateButton#ApplyTemplateButton',
            },
          },
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/:id/apply-template',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          throw new APIError('Unauthorized', 401)
        }

        const { id } = req.routeParams as { id: string }
        const data = (await req.json?.()) ?? {}
        const { templateId } = data as { templateId?: string }

        if (!templateId) {
          throw new APIError('templateId is required', 400)
        }

        const template = await req.payload.findByID({
          collection: 'page-templates',
          id: templateId,
          depth: 0,
          req,
        })

        const layout = (template.layout ?? []).map(({ id: _blockId, ...block }) => block)

        const updated = await req.payload.update({
          collection: 'products',
          id,
          data: { layout },
          req,
        })

        return Response.json({ layout: updated.layout })
      },
    },
  ],
  hooks: {
    afterChange: [revalidateProduct],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
