import type { BlocksField } from 'payload'

import { pageBlocks } from './pageBlocks'
import { StackBlock } from './Stack/config'
import { AnnouncementBanner } from './AnnouncementBanner/config'
import { BreadcrumbBlock } from './Breadcrumb/config'
import { FeatureChecklist } from './FeatureChecklist/config'
import { HeroSectionBlock } from './HeroSection/config'
import { IntegrationsList } from './IntegrationsList/config'
import { SectionHeading } from './SectionHeading/config'
import { SpecsTable } from './SpecsTable/config'
import { TrustBadges } from './TrustBadges/config'

// Product-only blocks, tagged so the combined picker below stays scannable.
const productOnlyBlocks = [
  BreadcrumbBlock,
  HeroSectionBlock,
  AnnouncementBanner,
  SectionHeading,
  FeatureChecklist,
  TrustBadges,
  SpecsTable,
  IntegrationsList,
].map((block) => ({
  ...block,
  admin: { ...block.admin, group: 'Product blocks' },
}))

// Shared with `PageTemplates` and `Products` so a template can be built from
// either page blocks or product blocks, and either collection can apply it.
// StackBlock is already included via `pageBlocks` (it's a general-purpose
// layout primitive, available on plain Pages too, not product-only).
export const templateBlocks = [...pageBlocks, ...productOnlyBlocks]

// Stack's `items` field is defined with an empty `blocks: []` in its own
// config (to avoid a circular import with this file) — now that the full set
// is assembled, wire it in here. Excludes Stack itself: Payload's config
// traversal walks a block's `blocks` array recursively with no cycle
// detection, so a block referencing itself causes infinite recursion
// (stack overflow) when generating types/GraphQL schema. No self-nesting.
const stackItemsField = StackBlock.fields.find(
  (field): field is BlocksField => 'name' in field && field.name === 'items',
)
if (stackItemsField) {
  stackItemsField.blocks = templateBlocks.filter((block) => block.slug !== 'stack')
}
