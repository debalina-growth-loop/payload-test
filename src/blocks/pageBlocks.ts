import { Archive } from './ArchiveBlock/config'
import { CallToAction } from './CallToAction/config'
import { Content } from './Content/config'
import { FooterBlock } from './FooterBlock/config'
import { FormBlock } from './Form/config'
import { HeaderBlock } from './HeaderBlock/config'
import { MediaBlock } from './MediaBlock/config'
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

// Shared with `PageTemplates` so both collections stay in sync on which
// block types are available.
export const pageBlocks = [
  HeaderBlock,
  FooterBlock,
  CallToAction,
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
]
