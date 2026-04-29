import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { onAuthChange, logout, getUserData } from '../firebase/auth'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // For master admin or existing user, fetch their role/data
        if (currentUser.email === 'ashrithnamburi06@gmail.com') {
          setUserData({ name: 'Master Admin', role: 'master_admin' })
        } else {
          const data = await getUserData(currentUser.uid)
          setUserData(data)
        }
      } else {
        setUserData(null)
      }
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/')
    }
  }

  const getDashboardPath = () => {
    if (!userData) return '/login'
    if (userData.role === 'master_admin' || userData.role === 'admin') return '/admin/dashboard'
    if (userData.role === 'faculty') return '/faculty/dashboard'
    if (userData.role === 'reception') return '/reception/dashboard'
    return '/login'
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/academics', label: 'Academics' },
    { path: '/facilities', label: 'Facilities' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
    { path: '/admissions', label: 'Admissions' },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-soft' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-heading font-bold text-primary">
              Winfield School
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-text hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-6 pl-4 border-l border-gray-100">
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-body">Welcome,</p>
                  <p className="text-sm font-heading font-bold text-primary truncate max-w-[120px]">
                    {userData?.name || 'User'}
                  </p>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="bg-primary hover:bg-primary-dark text-white font-body font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary hover:bg-primary-dark text-white font-body font-medium px-5 py-2 rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block font-body font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-text hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div className="px-2">
                    <p className="text-xs text-gray-500 font-body">Welcome,</p>
                    <p className="text-lg font-heading font-bold text-primary">
                      {userData?.name || 'User'}
                    </p>
                  </div>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsOpen(false)}
                    className="block bg-primary text-white font-body font-medium px-4 py-3 rounded-lg text-center"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full text-gray-500 font-body font-medium py-2 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-primary text-white font-body font-medium px-4 py-3 rounded-lg text-center transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
