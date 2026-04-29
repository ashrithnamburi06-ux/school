import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { loginWithGoogle } from '../firebase/auth'
import toast from 'react-hot-toast'

const StaffLogin = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    facultyId: '',
    role: 'faculty'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoogleLogin = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.phone || !formData.facultyId) {
      toast.error('Please fill in all required details before continuing.')
      return
    }

    setLoading(true)
    try {
      const result = await loginWithGoogle(formData)
      if (result.success) {
        toast.success(`Welcome ${result.role}!`)
        // Redirect based on role
        if (result.role === 'master_admin' || result.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (result.role === 'faculty') {
          navigate('/faculty/dashboard')
        } else if (result.role === 'reception') {
          navigate('/reception/dashboard')
        }
      } else {
        // This handles both "Waiting for approval" and "Request submitted" messages from auth.js
        toast.error(result.error, { duration: 5000 })
      }
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Staff Registration & Login | Winfield High School</title>
      </Helmet>

      <section className="min-h-screen bg-purple-50 flex items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-heading font-bold text-purple-700 mb-2">Staff Portal</h1>
            <p className="text-gray-600 font-body">Complete your details to continue</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Faculty ID / Staff ID</label>
              <input
                type="text"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="e.g. WHS-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role Request</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
                <option value="faculty">Faculty</option>
                <option value="reception">Reception</option>
                <option value="admin">Admin Request</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border-2 border-purple-600 text-purple-700 font-heading font-semibold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-purple-50 transition-all disabled:opacity-50 shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                {loading ? 'Processing...' : 'Continue with Google'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-body leading-relaxed">
            New users require a one-time registration. Your details will be submitted for admin approval after Google authentication.
          </p>
        </motion.div>
      </section>
    </>
  )
}

export default StaffLogin
