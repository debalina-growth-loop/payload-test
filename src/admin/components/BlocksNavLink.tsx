import { Link } from '@payloadcms/ui'

export function BlocksNavLink() {
  return (
    <Link className="nav__link" href="/admin/blocks" prefetch={false}>
      <span className="nav__link-label">Blocks</span>
    </Link>
  )
}
