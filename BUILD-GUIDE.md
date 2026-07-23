# Build a FarEye‑style Marketing Site with Payload CMS — from scratch

This guide starts from the **stock Payload website template** (where you are now) and
takes you A→Z to a homepage with:

- a **navbar** whose items, **dropdown menus**, **logo** and **CTA button** are all editable in the admin
- a **hero** with **left‑side text** (rotating headline + subtitle + buttons), a **right‑side image**, and a **background image**

You will do a little bit of **code** (to add fields the stock template doesn't have) and
then everything else is done from the **admin editor**.

---

## 0) The mental model — how Payload works

Payload is **config‑driven**. There are 3 layers, and they always flow the same way:

```
  CODE (fields)            ADMIN (editor)            FRONTEND (Next.js)
  src/**/config.ts   -->   /admin forms       -->    Server Components fetch
  define the fields        you type content          the data and render React
                           saved to MongoDB
```

- **Collections** = repeatable documents → `Pages`, `Posts`, `Media`, `Users` (in `src/collections`).
- **Globals** = single documents → `Header`, `Footer` (in `src/Header`, `src/Footer`).
- After you change any `config.ts`, run `pnpm payload generate:types` so the code stays type‑safe.
- The frontend reads data with Payload's **Local API**:
  - Globals: `getCachedGlobal('header', 2)()`
  - Collections: `payload.find({ collection: 'pages', where: { slug: {...} } })`

**Rule of thumb:** if you want the admin to control something, it must first exist as a **field** in a config file.

---

## 1) Run the project & create your admin user

```bash
pnpm install      # first time only
pnpm dev
```

Open **http://localhost:3000/admin** → create your first user. That's your CMS login.
The public site is **http://localhost:3000**.

---

## 2) What the stock template already gives you

- **Pages** collection: each page has a **Hero** (types: none / high / medium / low impact) and a **Layout** of blocks (Content, Media, Call‑to‑Action, Archive, Form).
- **Header** global: a simple list of nav links (no dropdowns yet).
- **Media** collection: uploaded images/files.
- Routing: `/` shows the page with slug `home`; `/anything` shows the page with that slug (`src/app/(frontend)/[slug]/page.tsx`).

The two things it does **not** have (so we'll add them): **nav dropdowns** and a **left‑text / right‑image hero**.

---

## 3) CODE STEP 1 — Add a "Marketing" hero (left text + right image + bg)

### 3.1 Add the fields — `src/heros/config.ts`

Open the file and replace its contents with this (it keeps the original types and adds `marketing`):

```ts
import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Marketing (left text + right image)', value: 'marketing' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },

    // ---- Marketing hero fields (only show when type = marketing) ----
    {
      name: 'prefix',
      type: 'text',
      label: 'Headline prefix (static first line, e.g. "How to")',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Rotating highlights (the coloured line that cycles)',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtitle',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },
    {
      name: 'illustration',
      type: 'upload',
      relationTo: 'media',
      label: 'Right‑side image',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Background lines image (optional)',
      admin: { condition: (_, { type } = {}) => type === 'marketing' },
    },

    // ---- Original hero fields (hidden for marketing) ----
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
      admin: { condition: (_, { type } = {}) => type !== 'marketing' },
    },
    linkGroup({ overrides: { maxRows: 2 } }), // the CTA buttons (shared by all types)
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: { condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type) },
    },
  ],
  label: false,
}
```

> `condition` shows/hides a field in the admin based on the selected `type`.
> `linkGroup` (already in the project) gives you the **buttons** array.

### 3.2 Create the component — `src/heros/Marketing/index.tsx`

Create this new file:

```tsx
'use client'

import React, { useEffect, useState } from 'react'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'

// Brand colours (change these to rebrand)
const CORAL = '#FF7A64'
const INK = '#012A36'
const HERO_BG = 'linear-gradient(220deg, #fff9ee 0%, #f3fff9 100%, #ecf9ff 100%)'
const CORAL_GRADIENT = 'linear-gradient(180deg, #FF8A72 0%, #F15C40 100%)'

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as any).url === 'string'
    ? (m as any).url
    : null

export const MarketingHero: React.FC<Page['hero']> = (props) => {
  const { prefix, highlights, subtitle, illustration, background, links } = props || {}
  const phrases = (highlights ?? []).map((h) => h.text).filter(Boolean) as string[]
  const illustrationUrl = mediaUrl(illustration)
  const backgroundUrl = mediaUrl(background)

  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (phrases.length <= 1) return
    const t = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 3000)
    return () => clearInterval(t)
  }, [phrases.length])

  return (
    <section
      className="relative -mt-[5.25rem] flex min-h-screen items-center overflow-hidden"
      style={{ background: HERO_BG }}
    >
      {backgroundUrl && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            top: '-10rem',
            backgroundImage: `url(${backgroundUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            backgroundSize: 'contain',
          }}
        />
      )}

      <div className="relative z-10 mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-8 px-6 pb-16 pt-28 lg:grid-cols-2 lg:pt-24">
        {/* LEFT: text */}
        <div className="max-w-[640px]">
          {prefix && (
            <h1 className="text-[2.63rem] font-semibold leading-[1.25] lg:text-[3.75rem]" style={{ color: INK }}>
              {prefix}
            </h1>
          )}

          {phrases.length > 0 && (
            <div className="relative flex h-[5.6rem] items-center overflow-hidden lg:h-[9.5rem]">
              <span
                key={idx}
                className="block bg-clip-text text-[2.63rem] font-semibold leading-[1.25] text-transparent lg:text-[3.75rem]"
                style={{ backgroundImage: CORAL_GRADIENT, animation: 'heroSlideUp .5s ease' }}
              >
                {phrases[idx]}
              </span>
            </div>
          )}

          {subtitle && (
            <p className="mt-[30px] max-w-[570px] text-[1.13rem] leading-[1.7]" style={{ color: 'rgba(1,42,54,.62)' }}>
              {subtitle}
            </p>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-[30px] flex flex-wrap gap-[15px]">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...link}
                  appearance="inline"
                  className={
                    i === 0
                      ? 'rounded-full border-2 border-transparent bg-[#FF7A64] px-6 py-[0.55rem] text-[1.13rem] font-bold text-white'
                      : 'rounded-full border-2 border-[#FF7A64] bg-transparent px-6 py-[0.55rem] text-[1.13rem] font-bold text-[#FF7A64]'
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: image */}
        <div className="flex justify-center lg:justify-end">
          {illustrationUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={illustrationUrl} alt="" className="h-auto w-full max-w-[600px]" />
          )}
        </div>
      </div>

      <style>{`@keyframes heroSlideUp{from{opacity:0;transform:translateY(70px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  )
}
```

### 3.3 Register it — `src/heros/RenderHero.tsx`

Add the two marked lines:

```tsx
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { MarketingHero } from '@/heros/Marketing'   // <-- add

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  marketing: MarketingHero,                          // <-- add
}
```

---

## 4) CODE STEP 2 — Add dropdown nav + logo + CTA to the Header

### 4.1 Add the fields — `src/Header/config.ts`

Replace the file with:

```ts
import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'text', type: 'text', admin: { description: 'Shown when no logo image is set.' } },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 12,
      admin: { initCollapsed: true, components: { RowLabel: '@/Header/RowLabel#RowLabel' } },
      fields: [
        link({ appearances: false }), // the top-level link (label + destination)
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          admin: { initCollapsed: true, description: 'Add sub-links to turn this into a dropdown.' },
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Call-to-action button',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        link({
          appearances: false,
          overrides: { admin: { condition: (_, { enabled } = {}) => Boolean(enabled) } },
        }),
      ],
    },
  ],
  hooks: { afterChange: [revalidateHeader] },
}
```

### 4.2 Create the navbar component — `src/components/marketing/Navbar.tsx`

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import type { Header, Page, Post } from '@/payload-types'

const CORAL = '#FF7A64'

type Item = { label: string; href: string; children?: { label: string; href: string }[] }
type LinkShape = {
  type?: 'reference' | 'custom' | null
  label?: string | null
  url?: string | null
  reference?: { relationTo: 'pages' | 'posts'; value: string | number | Page | Post } | null
}

function href(link?: LinkShape | null): string {
  if (!link) return '#'
  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value?.slug) {
    const prefix = link.reference.relationTo !== 'pages' ? `/${link.reference.relationTo}` : ''
    return `${prefix}/${link.reference.value.slug}`
  }
  return link.url || '#'
}

function items(data?: Header | null): Item[] {
  return (data?.navItems ?? []).map((it) => ({
    label: it.link?.label || '',
    href: href(it.link as LinkShape),
    children: it.children?.length
      ? it.children.map((c) => ({ label: c.link?.label || '', href: href(c.link as LinkShape) }))
      : undefined,
  }))
}

function DesktopItem({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'))
  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href={item.href}
        className="flex items-center gap-1 py-2 text-[1.05rem] font-semibold text-gray-800 hover:text-[#FF7A64]"
        style={active ? { color: CORAL } : undefined}
      >
        {item.label}
        {item.children?.length ? (
          <ChevronDown className="mt-0.5 h-4 w-4" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        ) : null}
      </Link>
      {item.children?.length && open ? (
        <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
          <ul className="overflow-hidden rounded-xl border border-gray-100 bg-white py-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]">
            {item.children.map((c, i) => (
              <li key={i}>
                <Link href={c.href} className="block px-6 py-2.5 text-[1.02rem] font-medium text-gray-700 hover:bg-[#FDEDE8] hover:text-[#FF7A64]">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

export const Navbar: React.FC<{ data?: Header | null }> = ({ data }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const list = items(data)
  const logo = data?.logo
  const logoUrl = logo && typeof logo.image === 'object' && logo.image?.url ? logo.image.url : null
  const cta = data?.ctaButton
  const showCta = cta && cta.enabled !== false && cta.link?.label

  return (
    <div className="sticky top-0 z-50 px-4 pt-3">
      <header className="mx-auto flex max-w-[1360px] items-center justify-between rounded-2xl bg-white px-6 py-3.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)] md:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[1.55rem] font-bold text-gray-900">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={logo?.text || 'Logo'} className="h-9 w-auto" />
          ) : (
            logo?.text || 'Logo'
          )}
        </Link>

        <nav className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {list.map((item, i) => <DesktopItem key={i} item={item} />)}
          </ul>
        </nav>

        {showCta && (
          <Link
            href={href(cta!.link as LinkShape)}
            className="hidden rounded-full px-6 py-2.5 text-[1.05rem] font-bold text-white xl:inline-block"
            style={{ backgroundColor: CORAL }}
          >
            {cta!.link!.label}
          </Link>
        )}

        <button className="xl:hidden" aria-label="Menu" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="mx-auto mt-2 max-w-[1360px] rounded-2xl bg-white p-4 shadow-lg xl:hidden">
          <ul className="flex flex-col divide-y divide-gray-100">
            {list.map((item, i) => (
              <li key={i} className="py-1">
                <Link href={item.href} className="block py-2.5 text-lg font-semibold" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {item.children?.map((c, j) => (
                  <Link key={j} href={c.href} className="block py-1.5 pl-4 text-base text-gray-600" onClick={() => setMobileOpen(false)}>
                    {c.label}
                  </Link>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### 4.3 Feed CMS data into it — `src/Header/Component.tsx`

Replace with:

```tsx
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { Navbar } from '@/components/marketing/Navbar'

export async function Header() {
  const headerData: HeaderType = await getCachedGlobal('header', 2)()
  return <Navbar data={headerData} />
}
```

> The layout (`src/app/(frontend)/layout.tsx`) already renders `<Header />`, so nothing else to wire.
> Depth `2` makes Payload populate the linked Pages/images so the navbar can build the URLs.

---

## 5) CODE STEP 3 (optional) — the exact FarEye font

The site uses the **Outfit** font. To match it, edit `src/app/(frontend)/layout.tsx`:

```tsx
import { Outfit } from 'next/font/google'
const outfit = Outfit({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-outfit' })
```

Add `outfit.variable` to the `<html className={...}>` list, and set the body font:

```tsx
<body style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
```

---

## 6) Regenerate types & run

```bash
pnpm payload generate:types
pnpm dev
```

If `pnpm dev` was already running, it hot‑reloads. TypeScript now knows about the new fields.

---

## 7) ADMIN STEPS — build the actual page (no code)

### 7.1 Upload images first — **Collections → Media → Create New**
Upload your right‑side image, background lines, and logo (see URLs in section 8).

### 7.2 Configure the navbar — **Globals → Header**
1. **Logo**: upload an image, or just type **text** (e.g. `FarEye`).
2. **Nav Items** → **Add** one row per menu item:
   - Open **Link** → choose **Internal link** (pick a Page) or **Custom URL**, set **Label** (e.g. `Products`).
   - For a dropdown, open **Dropdown items** → **Add** child links (Ship, Route, Plan…).
3. **Call‑to‑action button**: tick **enabled**, set link + label (e.g. `Let's Talk`).
4. **Save**.

### 7.3 Build the home hero — **Collections → Pages → Create New**
1. **Title** `Home`, **Slug** `home`.
2. **Hero** tab → **Type = Marketing (left text + right image)**. Fill:
   | Field | Appears as |
   |---|---|
   | Headline prefix | left, static first line ("How to") |
   | Rotating highlights (add rows) | left, cycling coloured line |
   | Subtitle | left, grey paragraph |
   | Links (add up to 2) | left, the buttons |
   | Right‑side image | the picture on the right |
   | Background lines image | faint lines behind everything |
3. **Publish** → open **http://localhost:3000/**.

### 7.4 Create the destination pages (so nav links work)
For every nav link, create a **Page** with a matching **slug**:
- `Platform` → slug `platform`, `Pilot` → slug `pilot`, etc.
- Dropdown items too: `Ship` → slug `ship`, `Route` → slug `route`…
- Give each page its own Hero and/or Layout blocks.
- Back in **Header**, point each nav link at the page via **Internal link** so the URL always matches.
- **Publish** each page.

> Slugs are single words → URLs like `/platform`, `/route`. (Nested URLs like `/products/route`
> are possible later with the "nested docs" plugin — ask when you want that; keep it simple for now.)

---

## 8) Image URLs (FarEye's own assets — for local learning only)

Download these (right‑click → Save, or `curl`), then upload them in **Media**:

| What | URL |
|---|---|
| Right‑side hero image (desktop) | https://fareye.com/uploads/generic/Homepage-hero-desktop.webp |
| Right‑side hero image (mobile) | https://fareye.com/uploads/generic/Homepage-hero-mobile.webp |
| Background wavy lines | https://fareye.com/assets/images/watermark--hero-wavy-lines.png |
| FarEye logo | https://fareye.com/uploads/generic/images/Logo_FarEye.png |

`curl` example:
```bash
curl -o hero.webp  "https://fareye.com/uploads/generic/Homepage-hero-desktop.webp"
curl -o lines.png  "https://fareye.com/assets/images/watermark--hero-wavy-lines.png"
curl -o logo.png   "https://fareye.com/uploads/generic/images/Logo_FarEye.png"
```

> ⚠️ These are FarEye's copyrighted images. Fine for learning on your machine; replace them
> with your own artwork before publishing anything public.

---

## 9) Rebrand / where the design lives

- **Colours** live at the top of `src/heros/Marketing/index.tsx` and `src/components/marketing/Navbar.tsx`
  (`CORAL`, `INK`, `HERO_BG`, `CORAL_GRADIENT`). Change them once to re‑theme.
- **Font**: section 5.
- Want colours/font editable from the admin too? Add a **"Site Settings" global** with colour fields —
  same pattern as the Header global.

---

## 10) Cheat‑sheet — which knob controls what

| You want to change… | Go to… |
|---|---|
| Logo | Globals → Header → Logo |
| Menu items / dropdowns | Globals → Header → Nav Items (+ Dropdown items) |
| "Let's Talk" button | Globals → Header → Call‑to‑action button |
| Left headline / rotating text / subtitle / buttons | Pages → (your page) → Hero |
| Right‑side image / background image | Pages → (your page) → Hero → uploads |
| A menu link's destination page's content | Pages → (that page) |
| Brand colours / font | code: `Marketing/index.tsx`, `Navbar.tsx`, `layout.tsx` |

That's the whole loop: **add a field in code → fill it in the admin → it renders on the site.**
```
