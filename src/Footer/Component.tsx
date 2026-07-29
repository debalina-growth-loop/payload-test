import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

// Brand social icons (light circle + dark glyph) matching the reference
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <svg className="h-[34px] w-[34px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 37">
      <g transform="translate(1 1.501)" fill="none" fillRule="evenodd">
        <circle stroke="#F2FBFC" strokeWidth="2" fill="#F2FBFC" cx="17" cy="17" r="17" />
        <path
          d="M12.133 10.493c0 .958-.77 1.734-1.72 1.734s-1.72-.776-1.72-1.734c0-.956.77-1.733 1.72-1.733s1.72.777 1.72 1.733Zm.014 3.12H8.68v11.094h3.467V13.613Zm5.534 0h-3.445v11.094h3.446v-5.824c0-3.238 4.18-3.502 4.18 0v5.824h3.458v-7.024c0-5.464-6.186-5.265-7.64-2.576v-1.494Z"
          fill="#012A36"
          fillRule="nonzero"
        />
      </g>
    </svg>
  ),
  twitter: (
    <svg className="h-[34px] w-[34px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 37">
      <g transform="translate(1 1.501)" fill="none" fillRule="evenodd">
        <circle stroke="#F2FBFC" strokeWidth="2" fill="#F2FBFC" cx="17" cy="17" r="17" />
        <path
          d="M25.32 12.16a6.952 6.952 0 0 1-1.96.524 3.35 3.35 0 0 0 1.5-1.842c-.659.381-1.39.659-2.168.808a3.45 3.45 0 0 0-2.492-1.051c-2.204 0-3.823 2.005-3.325 4.087a9.775 9.775 0 0 1-7.036-3.478c-.895 1.496-.464 3.454 1.056 4.445a3.465 3.465 0 0 1-1.546-.417c-.037 1.543 1.096 2.985 2.738 3.307a3.506 3.506 0 0 1-1.542.056c.434 1.323 1.695 2.285 3.19 2.312a6.99 6.99 0 0 1-5.055 1.38 9.844 9.844 0 0 0 5.233 1.495c6.339 0 9.92-5.22 9.703-9.903a6.857 6.857 0 0 0 1.704-1.723Z"
          fill="#012A36"
          fillRule="nonzero"
        />
      </g>
    </svg>
  ),
  facebook: (
    <svg className="h-[34px] w-[34px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 37">
      <g transform="translate(1 1.501)" fill="none" fillRule="evenodd">
        <circle stroke="#F2FBFC" strokeWidth="2" fill="#F2FBFC" cx="17" cy="17" r="17" />
        <path
          d="M14.92 14.613h-2.08v2.774h2.08v8.32h3.467v-8.32h2.525l.248-2.774h-2.773v-1.155c0-.663.133-.925.773-.925h2V9.067h-2.64c-2.493 0-3.6 1.097-3.6 3.2v2.346Z"
          fill="#012A36"
          fillRule="nonzero"
        />
      </g>
    </svg>
  ),
  youtube: (
    <svg className="h-[34px] w-[34px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 37">
      <g transform="translate(1 1.501)" fill="none" fillRule="evenodd">
        <circle stroke="#F2FBFC" strokeWidth="2" fill="#F2FBFC" cx="17" cy="17" r="17" />
        <g fillRule="nonzero">
          <path
            d="M27.955 11.504a2.863 2.863 0 0 0-2.014-2.015C24.153 9 17 9 17 9s-7.153 0-8.941.47a2.922 2.922 0 0 0-2.014 2.034c-.47 1.788-.47 5.496-.47 5.496s0 3.727.47 5.496a2.864 2.864 0 0 0 2.014 2.015C9.866 25 17 25 17 25s7.153 0 8.941-.47a2.863 2.863 0 0 0 2.014-2.015c.47-1.788.47-5.496.47-5.496s.02-3.727-.47-5.515Z"
            fill="#012A36"
          />
          <path fill="#FFF" d="M14.722 20.426 20.67 17l-5.948-3.426z" />
        </g>
      </g>
    </svg>
  ),
}

const mediaUrl = (m: unknown): string | null =>
  typeof m === 'object' && m !== null && 'url' in m && typeof (m as { url?: string }).url === 'string'
    ? ((m as { url: string }).url as string)
    : null

// Footer background presets (all dark so the light text stays legible)
const BG_COLORS: Record<string, string> = {
  navy: '#012A36',
  teal: '#03323F',
  black: '#111111',
  blue: '#0A1E3F',
  plum: '#2A1533',
}

export async function Footer({ variant }: { variant?: 'default' | 'glass' } = {}) {
  const data: FooterType = await getCachedGlobal('footer', 2)()

  const logo = data?.logo
  const logoUrl = logo && typeof logo.image === 'object' ? mediaUrl(logo.image) : null
  const cta = data?.ctaLink
  const columns = data?.columns || []
  const subscribe = data?.subscribe
  const legalLinks = data?.legalLinks || []
  const social = data?.social
  const solidBg = BG_COLORS[data?.backgroundColor || 'navy'] ?? BG_COLORS.navy
  // Glass: translucent + blurred so whatever sits above (e.g. a dark hero) shows through.
  const footerStyle =
    variant === 'glass'
      ? {
          backgroundColor: `${solidBg}99`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }
      : { backgroundColor: solidBg }

  const socials = [
    { url: social?.linkedin, key: 'linkedin', label: 'LinkedIn' },
    { url: social?.twitter, key: 'twitter', label: 'Twitter' },
    { url: social?.facebook, key: 'facebook', label: 'Facebook' },
    { url: social?.youtube, key: 'youtube', label: 'YouTube' },
  ].filter((s) => s.url)

  return (
    <footer className="mt-auto w-full text-white" style={footerStyle}>
      <div className="mx-auto max-w-[1440px] pl-36 pr-26 py-[84px]">
        {/* Top: logo + CTA */}
        <div className="mb-[52px] flex flex-wrap items-center justify-between gap-6">
          <Link href="/" aria-label="Home" className="text-[1.9rem] font-bold">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={logo?.text || 'Logo'} className="h-[52px] w-auto" />
            ) : (
              logo?.text || 'FarEye'
            )}
          </Link>
          {cta?.label && (
            <CMSLink
              {...cta}
              appearance="inline"
              className="rounded-full bg-[#FF7A64] px-6 py-2.5 text-[1rem] font-bold text-[#012A36]"
            />
          )}
        </div>

        {/* Main: link columns spread across + wide subscribe on the right */}
        <div className="flex flex-wrap justify-between gap-x-11 gap-y-12">
          {columns.map((col, i) => (
            <div key={i} className="min-w-[150px]">
              <div className="mb-6 text-[17px] font-bold text-[#FF7A64]">{col.title}</div>
              <ul className="space-y-[18px] text-[16px]">
                {(col.links || []).map(({ link }, j) => (
                  <li key={j}>
                    <CMSLink {...link} appearance="inline" className="hover:underline" />
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* subscribe + legal + social */}
          <div className="w-full lg:w-[500px] ml-5">
            {subscribe?.heading && (
              <div className="mb-10">
                <div className="mb-6 text-[17px] font-bold text-[#FF7A64]">{subscribe.heading}</div>
                <form className="w-full" action="#" method="post">
                  <input
                    type="email"
                    required
                    placeholder={subscribe.placeholder || 'Work Mail*'}
                    className="w-full rounded-full border border-white/10 bg-white px-6 py-2 text-[1rem] text-[#012A36] placeholder:text-[#6B7B83] outline-none"
                  />
                  {(subscribe.consentText || subscribe.privacyLink?.label) && (
                    <p className="mt-3 text-[15px]">
                      {subscribe.consentText}{' '}
                      {subscribe.privacyLink?.label && (
                        <CMSLink
                          {...subscribe.privacyLink}
                          appearance="inline"
                          className="underline"
                        />
                      )}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="mt-5 rounded-full bg-[#FF7A64] px-7 py-2 text-[1.05rem] font-bold text-[#012A36]"
                  >
                    {subscribe.buttonLabel || 'Subscribe Now'}
                  </button>
                </form>
              </div>
            )}

            {legalLinks.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-x-6 gap-y-3 text-[14px]">
                {legalLinks.map(({ link }, i) => (
                  <CMSLink key={i} {...link} appearance="inline" className="hover:underline" />
                ))}
              </div>
            )}

            {socials.length > 0 && (
              <div className="flex gap-[22px] lg:justify-end">
                {socials.map(({ url, key, label }, i) => (
                  <a
                    key={i}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-block transition-opacity hover:opacity-80"
                  >
                    {SOCIAL_ICONS[key]}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-black/20 text-[14px] px-36">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-8 py-4">
          <div>{data?.copyrightText}</div>
          <div>{data?.rightsText}</div>
        </div>
      </div>
    </footer>
  )
}
