import type { BlocksField } from 'payload'

import { Archive } from './ArchiveBlock/config'
import { ButtonBlock } from './ButtonBlock/config'
import { CallToAction } from './CallToAction/config'
import { Content } from './Content/config'
import { FooterBlock } from './FooterBlock/config'
import { FormBlock } from './Form/config'
import { HeaderBlock } from './HeaderBlock/config'
import { LinksBlock } from './LinksBlock/config'
import { MediaBlock } from './MediaBlock/config'
import { StackBlock } from './Stack/config'
import { LogoMarquee } from './LogoMarquee/config'
import { TextVideo } from './TextVideo/config'
import { FeatureTabs } from './FeatureTabs/config'
import { CtaBanner } from './CtaBanner/config'
import { UpdatesCards } from './UpdatesCards/config'
import { Spotlight } from './Spotlight/config'
import { StatsBanner } from './StatsBanner/config'
import { TestimonialCards } from './TestimonialCards/config'
import { Differentiators } from './Differentiators/config'
import { DiagramSection } from './DiagramSection/config'
import { ResourceHub } from './ResourceHub/config'
import { PlatformCarousel } from './PlatformCarousel/config'
import { StyledText } from './StyledText/config'
import { AnnouncementBanner } from './AnnouncementBanner/config'
import { BreadcrumbBlock } from './Breadcrumb/config'
import { FeatureChecklist } from './FeatureChecklist/config'
import { HeroSectionBlock } from './HeroSection/config'
import { IntegrationsList } from './IntegrationsList/config'
import { SectionHeading } from './SectionHeading/config'
import { SpecsTable } from './SpecsTable/config'
import { TrustBadges } from './TrustBadges/config'

// Formerly "product-only" blocks — kept in their own group purely for
// picker organization. They're available everywhere (Pages, Products,
// Templates, and inside Stack/Hero), same as every other block here.
const groupedProductBlocks = [
  BreadcrumbBlock,
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

// THE single source of truth for every block type in the system. Every
// blocks field (Pages, Products, PageTemplates, and — via `leafBlocks` below —
// Stack's and Hero's own nested content) is built from this one array, so a
// new block only ever needs to be added here to be available everywhere.
export const allBlocks = [
  HeaderBlock,
  FooterBlock,
  CallToAction,
  ButtonBlock,
  LinksBlock,
  StackBlock,
  HeroSectionBlock,
  Content,
  MediaBlock,
  Archive,
  FormBlock,
  LogoMarquee,
  TextVideo,
  FeatureTabs,
  CtaBanner,
  UpdatesCards,
  Spotlight,
  StatsBanner,
  TestimonialCards,
  Differentiators,
  DiagramSection,
  ResourceHub,
  PlatformCarousel,
  StyledText,
  ...groupedProductBlocks,
]

// Blocks excluded from nested pickers (Stack's `items`, Hero's `content`):
// - `stack` / `heroSection` — blocks that themselves hold a nested `blocks`
//   field. Payload's config traversal walks a block's `blocks` array
//   recursively with no cycle detection, so if two container blocks could
//   contain each other (or themselves), that's an infinite loop — a real
//   crash (stack overflow) when generating types/GraphQL schema, not just a
//   theoretical risk.
// - `headerBlock` / `footerBlock` — page-level chrome. extractChromeBlocks
//   only ever looks for them at the *top* of a Pages/Products/Templates
//   layout array, so one nested inside a Stack or Hero would just silently
//   render as nothing (blockComponents maps them to a no-op) — confusing,
//   not useful.
// This is the one deliberate exception to "all blocks everywhere" — it
// applies automatically to any future block of either kind too, as long as
// its slug is added to this set.
const NOT_NESTABLE_SLUGS = new Set(['stack', 'heroSection', 'headerBlock', 'footerBlock'])

export const leafBlocks = allBlocks.filter((block) => !NOT_NESTABLE_SLUGS.has(block.slug))

function nestedBlocksField(block: (typeof allBlocks)[number], fieldName: string) {
  return block.fields.find(
    (field): field is BlocksField => 'name' in field && field.name === fieldName,
  )
}

const stackItemsField = nestedBlocksField(StackBlock, 'items')
if (stackItemsField) {
  stackItemsField.blocks = leafBlocks
}

const heroContentField = nestedBlocksField(HeroSectionBlock, 'content')
if (heroContentField) {
  heroContentField.blocks = leafBlocks
}
