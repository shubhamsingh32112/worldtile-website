import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MapPin, FileText, DollarSign, Settings } from 'lucide-react'

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/buy-land', icon: MapPin, label: 'Buy Land' },
  { path: '/deeds', icon: FileText, label: 'Deeds' },
  { path: '/earn', icon: DollarSign, label: 'Earn' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActiveRoute = (path: string): boolean => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home'
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 z-50">
      <div className="w-full px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.path)
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-colors flex-1 ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
