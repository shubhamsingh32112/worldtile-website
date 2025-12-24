import { Outlet, useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'

export default function AppShell() {
  const location = useLocation()
  const isHomePage = location.pathname === '/' || location.pathname === '/home'
  const isBuyLandPage = location.pathname === '/buy-land'
  const noPadding = isHomePage || isBuyLandPage
  
  return (
    <div
      id="app-scroll-container"
      className="relative h-screen w-full overflow-y-auto flex flex-col bg-black"
    >
      {/* Top navigation */}
      <TopNav />
      
      {/* Main content container - full width */}
      {/* Add top padding to account for fixed navbar, except on homepage and buy-land page */}
      <main className={`flex-1 w-full relative z-10 ${noPadding ? '' : 'pt-24'}`}>
        <Outlet />
      </main>
    </div>
  )
}
