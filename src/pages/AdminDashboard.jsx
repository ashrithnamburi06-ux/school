import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logout } from '../firebase/auth'
import { getContacts, getAdmissions } from '../firebase/firestore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [contactsResult, admissionsResult] = await Promise.all([
      getContacts(),
      getAdmissions(),
    ])
    
    if (contactsResult.success) {
      setContacts(contactsResult.data)
    }
    if (admissionsResult.success) {
      setAdmissions(admissionsResult.data)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/admin/login')
    } else {
      toast.error('Logout failed')
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate()
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Winfield School</title>
        <meta name="description" content="Admin dashboard for Winfield School." />
      </Helmet>

      <section className="py-20 md:py-28 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 font-body">Manage submissions and inquiries</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-heading font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  {contacts.length}
                </div>
                <div className="text-gray-600 font-body">Contact Submissions</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-accent mb-2">
                  {admissions.length}
                </div>
                <div className="text-gray-600 font-body">Admission Applications</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-soft">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-green-600 mb-2">
                  {contacts.length + admissions.length}
                </div>
                <div className="text-gray-600 font-body">Total Submissions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-soft">
              <div className="flex gap-4 mb-8 border-b border-gray-100 p-6">
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`px-4 py-2 font-body font-medium transition-colors duration-200 ${
                    activeTab === 'contacts'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Contacts ({contacts.length})
                </button>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className={`px-4 py-2 font-body font-medium transition-colors duration-200 ${
                    activeTab === 'admissions'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Admissions ({admissions.length})
                </button>
              </div>

              <div className="px-6 pb-6">
                {loading ? (
                  <LoadingSpinner />
                ) : activeTab === 'contacts' ? (
                  contacts.length === 0 ? (
                    <EmptyState message="No contact submissions yet" icon="📬" />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Name</th>
                            <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Email</th>
                            <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Phone</th>
                            <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Message</th>
                            <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.map((contact) => (
                            <tr key={contact.id} className="border-b border-gray-50">
                              <td className="py-3 px-4 font-body">{contact.name}</td>
                              <td className="py-3 px-4 font-body">{contact.email}</td>
                              <td className="py-3 px-4 font-body">{contact.phone}</td>
                              <td className="py-3 px-4 font-body max-w-xs truncate">{contact.message}</td>
                              <td className="py-3 px-4 font-body text-sm text-gray-600">{formatDate(contact.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : admissions.length === 0 ? (
                  <EmptyState message="No admission applications yet" icon="📝" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Parent Name</th>
                          <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Email</th>
                          <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Phone</th>
                          <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Student Name</th>
                          <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Class</th>
                          <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admissions.map((admission) => (
                          <tr key={admission.id} className="border-b border-gray-50">
                            <td className="py-3 px-4 font-body">{admission.name}</td>
                            <td className="py-3 px-4 font-body">{admission.email}</td>
                            <td className="py-3 px-4 font-body">{admission.phone}</td>
                            <td className="py-3 px-4 font-body">{admission.studentName}</td>
                            <td className="py-3 px-4 font-body">{admission.class}</td>
                            <td className="py-3 px-4 font-body text-sm text-gray-600">{formatDate(admission.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AdminDashboard
