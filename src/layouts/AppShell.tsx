import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'

export default function AppShell() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Top navigation */}
      <TopNav />
      
      {/* Main content container - mobile-first, responsive width */}
      {/* Mobile: full width, Desktop: max 1000px centered */}
      {/* Add top padding to account for fixed navbar */}
      <main className="flex-1 w-full max-w-full md:max-w-[1000px] mx-auto relative pt-16">
        <Outlet />
      </main>
    </div>
  )
}
