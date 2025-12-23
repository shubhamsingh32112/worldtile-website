import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'
import GlobalBackground from '../components/GlobalBackground'

export default function AppShell() {
  return (
    <div className="relative h-screen w-full overflow-y-auto flex flex-col">
      {/* Background */}
      <GlobalBackground />

      {/* Top navigation */}
      <TopNav />
      
      {/* Main content container - mobile-first, responsive width */}
      {/* Mobile: full width, Desktop: max 1000px centered */}
      {/* Add top padding to account for fixed navbar */}
      <main className="flex-1 w-full max-w-full md:max-w-[1000px] mx-auto relative pt-16 z-10">
        <Outlet />
      </main>
    </div>
  )
}
