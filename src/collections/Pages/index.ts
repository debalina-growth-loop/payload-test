import type { CollectionConfig } from 'payload'

import { APIError } from 'payload'
import type { Page } from '@/payload-types'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { allBlocks } from '@/blocks/allBlocks'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
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
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: allBlocks,
              // Optional so a page can be just a hero (e.g. the marketing homepage)
              // with no body blocks.
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
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
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
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
            or: [{ usableFor: { in: ['pages'] } }, { usableFor: { exists: false } }],
          },
          admin: {
            description: 'Optionally base this page on a reusable template.',
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
              "On: this page always renders the template's current blocks instead of its own. Off: use the button below to copy the template's blocks in once, then edit them independently.",
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

        // A template's block set is a superset of Pages['layout'] (it can also
        // hold product-only blocks) — Payload validates the actual write
        // against Pages' own configured block types at runtime.
        const updated = await req.payload.update({
          collection: 'pages',
          id,
          data: { layout: layout as Page['layout'] },
          req,
        })

        return Response.json({ layout: updated.layout })
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
