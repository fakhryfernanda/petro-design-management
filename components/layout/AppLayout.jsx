import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({ title, children, headerActions }) {
  return (
    <div className="flex min-h-screen bg-surface-container-lowest">
      <Sidebar />
      <main className="ml-sidebar-width flex-1 flex flex-col min-h-screen">
        <Header title={title}>{headerActions}</Header>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
