import { useNavigate, useLocation } from 'react-router-dom'
import { Home, MapPin, FileText, DollarSign, User } from 'lucide-react'

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/buy-land', icon: MapPin, label: 'Buy Land' },
  { path: '/deeds', icon: FileText, label: 'Deeds' },
  { path: '/earn', icon: DollarSign, label: 'Earn' },
  { path: '/account', icon: User, label: 'Account' },
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

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-50">
      <div className="h-full max-w-full md:max-w-[1000px] mx-auto px-4">
        <div className="h-full flex justify-center sm:justify-between items-center">
          {/* Logo/Brand (hidden on mobile) */}
          <div 
            onClick={() => navigate('/home')}
            className="hidden sm:block cursor-pointer"
          >
            <h1 className="text-xl font-bold text-white">WorldTile</h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.path)
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-blue-500/10'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

