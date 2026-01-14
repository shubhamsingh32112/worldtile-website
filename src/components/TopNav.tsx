import { useNavigate } from 'react-router-dom'
import { FloatingDock } from './ui/floating-dock'
import { Home, Map, DollarSign, Settings } from 'lucide-react'

export default function TopNav() {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path, { replace: false })
    
    // Scroll to top when navigating to home
    if (path === '/home') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    }
  }

  const dockItems = [
    {
      title: 'Home',
      icon: <Home className="h-full w-full text-neutral-300" />,
      href: '#',
      onClick: () => handleNavigation('/home'),
    },
    {
      title: 'Buy Land',
      icon: <Map className="h-full w-full text-neutral-300" />,
      href: '#',
      onClick: () => handleNavigation('/buy-land'),
    },
    {
      title: 'Earn',
      icon: <DollarSign className="h-full w-full text-neutral-300" />,
      href: '#',
      onClick: () => handleNavigation('/earn'),
    },
    {
      title: 'Settings',
      icon: <Settings className="h-full w-full text-neutral-300" />,
      href: '#',
      onClick: () => handleNavigation('/settings'),
    },
  ]

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-full px-2">
      <FloatingDock
        items={dockItems}
        desktopClassName="translate-y-0"
        mobileClassName="translate-y-0"
      />
    </nav>
  )
}
