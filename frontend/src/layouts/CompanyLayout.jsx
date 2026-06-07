import { Link, Outlet, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/about', label: 'Tentang' },
  { to: '/services', label: 'Layanan' },
  { to: '/contact', label: 'Kontak' },
]

export default function CompanyLayout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Minion
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.to
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/pos"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Buka POS
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Minion. All rights reserved.
      </footer>
    </div>
  )
}
