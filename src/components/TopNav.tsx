import { useNavigate, useLocation } from 'react-router-dom'
import GooeyNav from './GooeyNav'

const navItems = [
  { path: '/home', label: 'Home' },
  { path: '/buy-land', label: 'Buy Land' },
  { path: '/deeds', label: 'Deeds' },
  { path: '/earn', label: 'Earn' },
  { path: '/account', label: 'Account' },
]

export default function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActiveRoute = (path: string): boolean => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  // Derive active index from route
  const activeIndex = navItems.findIndex(item => isActiveRoute(item.path))

  const handleNavClick = (index: number) => {
    const targetPath = navItems[index].path
    
    // Always navigate - use replace: false to ensure it's treated as a new navigation
    // This ensures the route change is processed even if already on the route
    navigate(targetPath, { replace: false })
    
    // Scroll to top when navigating to home
    if (targetPath === '/home') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-full px-2">
      <GooeyNav
        items={navItems.map(item => ({ label: item.label }))}
        activeIndex={activeIndex >= 0 ? activeIndex : undefined}
        onItemClick={handleNavClick}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
    </nav>
  )
}
