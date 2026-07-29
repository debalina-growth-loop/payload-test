type ChromeVariant = 'default' | 'glass'

type ChromeState = {
  show: boolean
  variant?: ChromeVariant
}

type ChromeBlockType = 'headerBlock' | 'footerBlock'
type AnyLayoutBlock = { blockType: string }

type ExtractedChrome<T extends AnyLayoutBlock> = {
  header: ChromeState
  footer: ChromeState
  rest: Exclude<T, { blockType: ChromeBlockType }>[]
}

// Header/Footer blocks are page-level chrome, not stacked content — wherever an
// editor drops them in the blocks list (on Pages or Products), they always render
// at the very top/bottom of the page. This pulls them out of the array so the
// remaining blocks render normally via RenderBlocks/RenderProductBlocks, and
// resolves whether the header/footer should show at all (a Header/Footer block
// always wins over the "hide" toggles, since adding one is an explicit choice to
// show a custom-styled one).
export function extractChromeBlocks<T extends AnyLayoutBlock>(
  layout: T[] | null | undefined,
  options?: { hideHeader?: boolean | null; hideFooter?: boolean | null },
): ExtractedChrome<T> {
  const blocks: T[] = layout ?? []

  const headerBlock = blocks.find((b) => b.blockType === 'headerBlock') as
    | { variant?: ChromeVariant | null }
    | undefined
  const footerBlock = blocks.find((b) => b.blockType === 'footerBlock') as
    | { variant?: ChromeVariant | null }
    | undefined

  const rest = blocks.filter(
    (b): b is Exclude<T, { blockType: ChromeBlockType }> =>
      b.blockType !== 'headerBlock' && b.blockType !== 'footerBlock',
  )

  return {
    header: {
      show: Boolean(headerBlock) || !options?.hideHeader,
      variant: headerBlock?.variant ?? undefined,
    },
    footer: {
      show: Boolean(footerBlock) || !options?.hideFooter,
      variant: footerBlock?.variant ?? undefined,
    },
    rest,
  }
}
