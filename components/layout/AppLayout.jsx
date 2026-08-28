import Sidebar from './Sidebar'
import Header from './Header'
import BottomNav from './BottomNav'

export default function AppLayout({ title, children, headerActions }) {
  return (
    <div className="flex min-h-screen bg-surface-container-lowest">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen md:ml-sidebar-collapsed lg:ml-sidebar-width pb-[72px] md:pb-0 min-w-0 overflow-x-hidden">
        <Header title={title}>{headerActions}</Header>
        <div className="flex-1">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}