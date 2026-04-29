import { Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthChange } from '../firebase/auth'
import LoadingSpinner from '../components/LoadingSpinner'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Admin email check (Master Admin)
        if (currentUser.email === 'ashrithnamburi06@gmail.com') {
          setAuthorized(true)
        } else {
          // Check Firestore for approval and roles
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists() && userDoc.data().approved) {
            const data = userDoc.data()
            // Check if user is trying to access a restricted path based on role
            const path = location.pathname
            if (path.startsWith('/admin') && data.role !== 'master_admin') {
              setAuthorized(false)
            } else if (path.startsWith('/faculty') && data.role !== 'faculty') {
              setAuthorized(false)
            } else if (path.startsWith('/reception') && data.role !== 'reception') {
              setAuthorized(false)
            } else {
              setAuthorized(true)
            }
          } else {
            setAuthorized(false)
          }
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    // Redirect to login, but save the intended location
    const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login'
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  if (!authorized) {
    // If not approved, force them back to login where they will see the status message
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
