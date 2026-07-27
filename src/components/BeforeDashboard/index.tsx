import { PagesOverview } from './PagesOverview'
import './index.scss'

const baseClass = 'before-dashboard'

export default async function BeforeDashboard() {
  return (
    <div className={baseClass}>
      <PagesOverview />
    </div>
  )
}
