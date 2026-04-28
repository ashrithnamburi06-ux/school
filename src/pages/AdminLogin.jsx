import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../firebase/auth'
import toast from 'react-hot-toast'
import ErrorAlert from '../components/ErrorAlert'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    const result = await login(formData.email, formData.password)
    setLoading(false)

    if (result.success) {
      toast.success('Login successful!')
      navigate('/admin/dashboard')
    } else {
      setError(result.error)
      toast.error('Login failed')
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login - Winfield School</title>
        <meta name="description" content="Admin login for Winfield School dashboard." />
      </Helmet>

      <section className="min-h-screen flex items-center justify-center bg-background py-20">
        <div className="max-w-md w-full mx-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-heading font-bold text-primary mb-2">Admin Login</h1>
            <p className="text-gray-600 font-body">Access the admin dashboard</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white p-8 rounded-2xl shadow-soft">
              <ErrorAlert message={error} />

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    placeholder="admin@winfieldschool.com"
                  />
                </div>

                <div>
                  <label className="block font-body font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-heading font-semibold px-8 py-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AdminLogin
