import WalletPanel from './WalletPanel'
import './SidebarLayout.css'

export default function SidebarLayout({ children }) {
  return (
    <div className="sidebar-layout">
      <div className="sidebar-layout-main">{children}</div>
      <WalletPanel />
    </div>
  )
}
