import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ButtonBlockComponent } from '@/blocks/ButtonBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { LinksBlockComponent } from '@/blocks/LinksBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { LogoMarqueeComponent } from '@/blocks/LogoMarquee/Component'
import { TextVideoComponent } from '@/blocks/TextVideo/Component'
import { FeatureTabsComponent } from '@/blocks/FeatureTabs/Component'
import { CtaBannerComponent } from '@/blocks/CtaBanner/Component'
import { UpdatesCardsComponent } from '@/blocks/UpdatesCards/Component'
import { SpotlightComponent } from '@/blocks/Spotlight/Component'
import { StatsBannerComponent } from '@/blocks/StatsBanner/Component'
import { TestimonialCardsComponent } from '@/blocks/TestimonialCards/Component'
import { DifferentiatorsComponent } from '@/blocks/Differentiators/Component'
import { DiagramSectionComponent } from '@/blocks/DiagramSection/Component'
import { ResourceHubComponent } from '@/blocks/ResourceHub/Component'
import { PlatformCarouselComponent } from '@/blocks/PlatformCarousel/Component'
import { BreadcrumbBlockComponent } from '@/blocks/Breadcrumb/Component'
import { HeroSectionBlockComponent } from '@/blocks/HeroSection/Component'
import { AnnouncementBannerBlock } from '@/blocks/AnnouncementBanner/Component'
import { SectionHeadingBlock } from '@/blocks/SectionHeading/Component'
import { FeatureChecklistBlock } from '@/blocks/FeatureChecklist/Component'
import { TrustBadgesBlock } from '@/blocks/TrustBadges/Component'
import { SpecsTableBlock } from '@/blocks/SpecsTable/Component'
import { IntegrationsListBlock } from '@/blocks/IntegrationsList/Component'
import { StyledTextBlock } from '@/blocks/StyledText/Component'
import { StackBlockComponent } from '@/blocks/Stack/Component'

// Single canonical slug -> component registry, shared by RenderBlocks,
// RenderProductBlocks, Stack and Hero Section (all of which need to dispatch
// any block type for their own nested content). `stack` and `heroSection` are
// getters, not plain values: Stack/Component.tsx and HeroSection's nested
// content renderer both import this registry too, so this file and theirs are
// mutually circular. A plain `stack: StackBlockComponent` would read the
// binding the instant this object literal is built — which, depending on
// which of the two modules happens to load first, can happen before the
// other has finished initializing (ReferenceError: before initialization).
// A getter defers that read until the block is actually rendered, by which
// point both modules have long since finished loading.
export const blockComponents = {
  // Header/Footer are page-level chrome, extracted out before reaching a
  // renderer (see extractChromeBlocks) — these entries exist only to satisfy
  // the lookup below if one somehow slips through unfiltered.
  headerBlock: () => null,
  footerBlock: () => null,
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  buttonBlock: ButtonBlockComponent,
  linksBlock: LinksBlockComponent,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  logoMarquee: LogoMarqueeComponent,
  textVideo: TextVideoComponent,
  featureTabs: FeatureTabsComponent,
  ctaBanner: CtaBannerComponent,
  updatesCards: UpdatesCardsComponent,
  spotlight: SpotlightComponent,
  statsBanner: StatsBannerComponent,
  testimonialCards: TestimonialCardsComponent,
  differentiators: DifferentiatorsComponent,
  diagramSection: DiagramSectionComponent,
  resourceHub: ResourceHubComponent,
  platformCarousel: PlatformCarouselComponent,
  breadcrumb: BreadcrumbBlockComponent,
  get heroSection() {
    return HeroSectionBlockComponent
  },
  announcementBanner: AnnouncementBannerBlock,
  sectionHeading: SectionHeadingBlock,
  featureChecklist: FeatureChecklistBlock,
  trustBadges: TrustBadgesBlock,
  specsTable: SpecsTableBlock,
  integrationsList: IntegrationsListBlock,
  styledText: StyledTextBlock,
  get stack() {
    return StackBlockComponent
  },
}
