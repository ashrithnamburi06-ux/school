import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logout, onAuthChange, getUserData } from '../firebase/auth'
import { getContacts, getAdmissions, getAllUsers, approveUser } from '../firebase/firestore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [users, setUsers] = useState([])
  const [currentUserData, setCurrentUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        if (user.email === 'ashrithnamburi06@gmail.com') {
          setCurrentUserData({ role: 'master_admin', name: 'Master Admin' })
        } else {
          const data = await getUserData(user.uid)
          if (data && (data.role === 'master_admin' || data.role === 'admin')) {
            setCurrentUserData(data)
          } else {
            navigate('/login')
          }
        }
        fetchData()
      } else {
        navigate('/login')
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [contactsResult, admissionsResult, usersResult] = await Promise.all([
      getContacts(),
      getAdmissions(),
      getAllUsers()
    ])
    
    if (contactsResult.success) {
      setContacts(contactsResult.data)
    }
    if (admissionsResult.success) {
      setAdmissions(admissionsResult.data)
    }
    if (usersResult.success) {
      setUsers(usersResult.data)
    }
    setLoading(false)
  }

  const handleApproveUser = async (userId, role) => {
    const result = await approveUser(userId, role, currentUserData?.role)
    if (result.success) {
      toast.success(`User approved as ${role} successfully`)
      fetchData() // Refresh list
    } else {
      toast.error(result.error || 'Failed to approve user')
    }
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
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 font-body font-medium transition-colors duration-200 ${
                    activeTab === 'users'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  Staff Management ({users.filter(u => !u.approved).length} Pending)
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
                ) : activeTab === 'admissions' ? (
                  admissions.length === 0 ? (
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
                  )
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">Pending Approvals</h3>
                      {users.filter(u => !u.approved).length === 0 ? (
                        <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                          <span className="text-4xl mb-4 block">✨</span>
                          <p className="text-gray-500 font-body italic">No pending approval requests at the moment.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {users.filter(u => !u.approved).map((user) => (
                            <div key={user.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-heading font-bold text-xl text-gray-800">{user.name}</h4>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase">
                                      {user.requestedRole || user.role}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600 font-body">
                                    <p><span className="font-semibold text-gray-400 mr-2">Email:</span> {user.email}</p>
                                    <p><span className="font-semibold text-gray-400 mr-2">Phone:</span> {user.phone || 'N/A'}</p>
                                    <p><span className="font-semibold text-gray-400 mr-2">Faculty ID:</span> {user.facultyId || 'N/A'}</p>
                                    <p><span className="font-semibold text-gray-400 mr-2">Applied:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6">
                                  <p className="text-xs font-bold text-gray-400 uppercase mb-2 sm:mb-0 sm:mr-4">Approve As:</p>
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {/* Faculty and Reception can be approved by both Master Admin and Admin */}
                                    <button
                                      onClick={() => handleApproveUser(user.id, 'faculty')}
                                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                      Faculty
                                    </button>
                                    <button
                                      onClick={() => handleApproveUser(user.id, 'reception')}
                                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                                    >
                                      Reception
                                    </button>
                                    
                                    {/* Admin approval is strictly for Master Admin only */}
                                    {currentUserData?.role === 'master_admin' && (
                                      <button
                                        onClick={() => handleApproveUser(user.id, 'admin')}
                                        className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                                      >
                                        Admin
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                      <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">Approved Staff</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Name</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Role</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Email</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.filter(u => u.approved).map((user) => (
                              <tr key={user.id} className="border-b border-gray-50">
                                <td className="py-3 px-4 font-body">{user.name}</td>
                                <td className="py-3 px-4 font-body capitalize">{user.role}</td>
                                <td className="py-3 px-4 font-body">{user.email}</td>
                                <td className="py-3 px-4 font-body">
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Approved</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
