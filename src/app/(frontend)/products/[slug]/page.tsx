// Mounts the same page-by-slug rendering used at the top-level `/[slug]` route
// under `/products/*`, since Products dropdown links (Header global) point here
// and there is no dedicated "Products" landing page to nest these under.
export { default, generateMetadata } from '../../[slug]/page'
