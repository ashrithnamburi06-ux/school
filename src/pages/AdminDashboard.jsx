import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { logout, onAuthChange, getUserData } from '../firebase/auth'
import { db } from '../firebase/config'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { 
  approveUser,
  bulkAddStudents
} from '../firebase/firestore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts')
  const [contacts, setContacts] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [users, setUsers] = useState([])
  const [students, setStudents] = useState([])
  const [attendanceReports, setAttendanceReports] = useState([])
  const [tests, setTests] = useState([])
  const [allMarks, setAllMarks] = useState([])
  const [isSeeding, setIsSeeding] = useState(false)
  const [analyticsData, setAnalyticsData] = useState({
    avg: 0,
    highest: 0,
    lowest: 0,
    totalStudents: 0,
    topPerformers: [],
    weakStudents: []
  })
  const [currentUserData, setCurrentUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ 
    class: '', 
    section: '', 
    date: '', 
    timeSlot: '',
    subject: '', 
    facultyId: '', 
    userSubject: '',
    testId: ''
  })
  const navigate = useNavigate()

  const timeSlots = [
    '09:00 – 11:00',
    '11:00 – 12:30',
    '01:00 – 03:30',
    '03:30 – 05:00'
  ]

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Computer Science',
    'Social Studies',
    'Physical Education'
  ]

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const sections = ['A', 'B', 'C']

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
        // Initial loading state handled by real-time listeners
      } else {
        navigate('/login')
      }
    })

    return () => unsubscribe()
  }, [])

  // Real-time listeners for contacts, admissions, and users
  useEffect(() => {
    setLoading(true)
    
    // Contacts listener
    const contactsQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'))
    const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
      const contactsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setContacts(contactsList)
    }, (error) => {
      console.error("Contacts listener error:", error)
    })

    // Admissions listener
    const admissionsQuery = query(collection(db, 'admissions'), orderBy('createdAt', 'desc'))
    const unsubscribeAdmissions = onSnapshot(admissionsQuery, (snapshot) => {
      const admissionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAdmissions(admissionsList)
    }, (error) => {
      console.error("Admissions listener error:", error)
    })

    // Users listener
    const usersQuery = query(collection(db, 'users'))
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setUsers(usersList)
      setLoading(false)
    }, (error) => {
      console.error("Users listener error:", error)
      setLoading(false)
    })

    return () => {
      unsubscribeContacts()
      unsubscribeAdmissions()
      unsubscribeUsers()
    }
  }, [])

  useEffect(() => {
    let unsubscribe = () => {}

    if (activeTab === 'students' && filter.class && filter.section) {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'students'),
          where('class', '==', String(filter.class)),
          where('section', '==', filter.section)
        )
        unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            const studentsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })).sort((a, b) => (a.rollNo || 0) - (b.rollNo || 0))
            setStudents(studentsList)
          } catch (err) {
            console.error("Error processing snapshot:", err)
          } finally {
            setLoading(false)
          }
        }, (error) => {
          console.error("onSnapshot error:", error)
          setLoading(false)
        })
      } catch (err) {
        console.error("Query setup error:", err)
        setLoading(false)
      }
    } else {
      setStudents([])
      // Don't set loading false here as fetchInitialData might be running
    }

    return () => unsubscribe()
  }, [activeTab, filter.class, filter.section])

  useEffect(() => {
    if (activeTab === 'tests') {
      setLoading(true)
      let q = collection(db, 'tests')
      const constraints = []
      if (filter.subject) constraints.push(where('subject', '==', filter.subject))
      if (filter.facultyId) constraints.push(where('facultyId', '==', filter.facultyId))
      
      const finalQuery = constraints.length > 0 ? query(q, ...constraints) : q
      
      const unsubscribe = onSnapshot(finalQuery, (snapshot) => {
        const testsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTests(testsList)
        setLoading(false)
      })
      return () => unsubscribe()
    }
  }, [activeTab, filter.subject, filter.facultyId])

  // Real-time attendance listener
  useEffect(() => {
    let unsubscribe = () => {}

    if (activeTab === 'attendance' && filter.date && filter.class && filter.section && filter.timeSlot) {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'attendance'),
          where('date', '==', filter.date),
          where('class', '==', String(filter.class)),
          where('section', '==', filter.section),
          where('timeSlot', '==', filter.timeSlot)
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            if (snapshot.empty) {
              setAttendanceReports([])
            } else {
              const attendanceData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
              setAttendanceReports(attendanceData)
            }
          } catch (err) {
            console.error("Error processing attendance snapshot:", err)
          } finally {
            setLoading(false)
          }
        }, (error) => {
          console.error("onSnapshot attendance error:", error)
          toast.error("Failed to load attendance data")
          setLoading(false)
        })
      } catch (err) {
        console.error("Attendance query setup error:", err)
        setLoading(false)
      }
    } else {
      setAttendanceReports([])
      // Don't set loading false here
    }

    return () => unsubscribe()
  }, [activeTab, filter.date, filter.class, filter.section, filter.timeSlot])

  const handleFilterAttendance = async () => {
    setLoading(true)
    const result = await getAllMarks({
      class: filter.class,
      section: filter.section,
      subject: filter.subject,
      testId: filter.testId
    })
    
    if (result.success) {
      const marks = result.data
      if (marks.length > 0) {
        const total = marks.reduce((sum, m) => sum + m.marks, 0)
        const avg = total / marks.length
        const highest = Math.max(...marks.map(m => m.marks))
        const lowest = Math.min(...marks.map(m => m.marks))
        
        // Top 5 Performers
        const topPerformers = [...marks]
          .sort((a, b) => b.marks - a.marks)
          .slice(0, 5)
        
        // Weak Students (< 40%)
        const weakStudents = marks.filter(m => m.marks < 40)
        
        setAnalyticsData({
          avg: avg.toFixed(2),
          highest,
          lowest,
          totalStudents: marks.length,
          topPerformers,
          weakStudents
        })
        setAllMarks(marks)
      } else {
        setAnalyticsData({
          avg: 0, highest: 0, lowest: 0, totalStudents: 0, topPerformers: [], weakStudents: []
        })
        setAllMarks([])
        toast.error('No performance data found for these filters')
      }
    }
    setLoading(false)
  }

  const handleSeedStudents = async () => {
    setIsSeeding(true)
    const studentsToSeed = [
      // Section A
      { name: "Arjun", class: "8", section: "A", rollNo: 1, stream: "Non-IIT" },
      { name: "Ravi", class: "8", section: "A", rollNo: 2, stream: "Non-IIT" },
      { name: "Kiran", class: "8", section: "A", rollNo: 3, stream: "Non-IIT" },
      { name: "Meena", class: "8", section: "A", rollNo: 4, stream: "Non-IIT" },
      { name: "Suresh", class: "8", section: "A", rollNo: 5, stream: "Non-IIT" },
      // Section B
      { name: "Sneha", class: "8", section: "B", rollNo: 6, stream: "Non-IIT" },
      { name: "Pooja", class: "8", section: "B", rollNo: 7, stream: "Non-IIT" },
      { name: "Rahul", class: "8", section: "B", rollNo: 8, stream: "Non-IIT" },
      { name: "Anjali", class: "8", section: "B", rollNo: 9, stream: "Non-IIT" },
      { name: "Vikas", class: "8", section: "B", rollNo: 10, stream: "Non-IIT" },
      // Section C
      { name: "Deepak", class: "8", section: "C", rollNo: 11, stream: "Non-IIT" },
      { name: "Neha", class: "8", section: "C", rollNo: 12, stream: "Non-IIT" },
      { name: "Rohit", class: "8", section: "C", rollNo: 13, stream: "Non-IIT" },
      { name: "Kavya", class: "8", section: "C", rollNo: 14, stream: "Non-IIT" },
      { name: "Aman", class: "8", section: "C", rollNo: 15, stream: "Non-IIT" }
    ]

    const result = await bulkAddStudents(studentsToSeed)
    if (result.success) {
      toast.success('Successfully seeded 15 students!')
    } else {
      toast.error('Failed to seed: ' + result.error)
    }
    setIsSeeding(false)
  }

  const handleApproveUser = async (userId, role) => {
    const result = await approveUser(userId, role, currentUserData?.role)
    if (result.success) {
      toast.success(`User approved as ${role} successfully`)
      fetchInitialData() // Refresh list
    } else {
      toast.error(result.error || 'Failed to approve user')
    }
  }

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/login')
    } else {
      toast.error('Logout failed')
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
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
          >
            <div className="bg-white rounded-2xl shadow-soft">
              <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-100 p-6">
                {[
                  { id: 'contacts', label: 'Contacts', count: contacts.length },
                  { id: 'admissions', label: 'Admissions', count: admissions.length },
                  { id: 'users', label: 'Users', count: users.filter(u => !u.approved).length },
                  { id: 'students', label: 'Students', count: null },
                  { id: 'attendance', label: 'Attendance', count: null },
                  { id: 'tests', label: 'Tests', count: null },
                  { id: 'analytics', label: 'Analytics', count: null },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-body font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {tab.label} {tab.count !== null && `(${tab.count})`}
                  </button>
                ))}
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
                ) : activeTab === 'users' ? (
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
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Filter by Subject</label>
                        <select
                          value={filter.userSubject}
                          onChange={(e) => setFilter({...filter, userSubject: e.target.value})}
                          className="w-full max-w-xs px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">All Subjects</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Name</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Role</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Subject</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Email</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold text-gray-800">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.filter(u => u.approved && (!filter.userSubject || u.subject === filter.userSubject)).map((user) => (
                              <tr key={user.id} className="border-b border-gray-50">
                                <td className="py-3 px-4 font-body">{user.name}</td>
                                <td className="py-3 px-4 font-body capitalize">{user.role}</td>
                                <td className="py-3 px-4 font-body">{user.subject || '-'}</td>
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
                ) : activeTab === 'students' ? (
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow items-end">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                          <select
                            value={filter.class}
                            onChange={(e) => setFilter({...filter, class: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                          >
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                          <select
                            value={filter.section}
                            onChange={(e) => setFilter({...filter, section: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                          >
                            <option value="">Select Section</option>
                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={handleSeedStudents}
                        disabled={isSeeding}
                        className="ml-4 bg-purple-100 text-purple-700 font-bold py-2 px-4 rounded-xl border-2 border-purple-200 hover:bg-purple-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {isSeeding ? 'Seeding...' : '🌱 Seed Sample Students (Class 8)'}
                      </button>
                    </div>

                    {students.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="text-left py-3 px-4 font-heading font-semibold">Roll No</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold">Name</th>
                              <th className="text-left py-3 px-4 font-heading font-semibold">Stream</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map(s => (
                              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-body font-bold text-purple-600">{s.rollNo}</td>
                                <td className="py-3 px-4 font-body">{s.name}</td>
                                <td className="py-3 px-4 font-body text-gray-500">{s.stream || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <EmptyState message="Select class and section to view students" icon="👨‍🎓" />
                    )}
                  </div>
                ) : activeTab === 'attendance' ? (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={filter.date}
                          onChange={(e) => setFilter({...filter, date: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                        <select
                          value={filter.class}
                          onChange={(e) => setFilter({...filter, class: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">Select Class</option>
                          {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                        <select
                          value={filter.section}
                          onChange={(e) => setFilter({...filter, section: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">Select Section</option>
                          {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Time Slot</label>
                        <select
                          value={filter.timeSlot}
                          onChange={(e) => setFilter({...filter, timeSlot: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">Select Time Slot</option>
                          {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                      <button
                        disabled
                        className="bg-purple-100 text-purple-600 font-bold py-2 px-6 rounded-xl shadow-sm opacity-70 cursor-not-allowed"
                      >
                        {filter.date && filter.class && filter.section && filter.timeSlot ? 'Live Sync Active' : 'Select All Filters'}
                      </button>
                    </div>

                    {attendanceReports.length > 0 ? (
                      <div className="space-y-6">
                        {attendanceReports.map(report => (
                          <div key={report.id} className="border border-gray-100 rounded-2xl p-6 bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                              <div>
                                <h4 className="text-xl font-heading font-bold text-gray-800">
                                  Class {report.class} - {report.section}
                                </h4>
                                <p className="text-sm text-gray-500 font-body">Date: {report.date} | Time: {report.timeSlot}</p>
                                <p className="text-sm text-purple-600 font-body mt-1">Faculty: {report.facultyName || 'Unknown'}</p>
                              </div>
                              <div className="text-right">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                                  Present: {report.records.filter(r => r.present).length}
                                </span>
                                <span className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                                  Absent: {report.records.filter(r => !r.present).length}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-purple-600 text-white">
                                    <th className="py-3 px-4 text-left font-heading font-semibold rounded-tl-lg">Roll No</th>
                                    <th className="py-3 px-4 text-left font-heading font-semibold">Student Name</th>
                                    <th className="py-3 px-4 text-center font-heading font-semibold rounded-tr-lg">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {report.records.map((record, i) => (
                                    <tr key={i} className={`${record.present ? 'bg-white' : 'bg-red-50'} hover:bg-gray-50 transition-colors`}>
                                      <td className="py-3 px-4 font-body font-medium">{record.rollNo}</td>
                                      <td className="py-3 px-4 font-body text-gray-800">{record.name}</td>
                                      <td className="py-3 px-4">
                                        <div className="flex justify-center">
                                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            record.present 
                                              ? 'bg-green-100 text-green-700' 
                                              : 'bg-red-100 text-red-700'
                                          }`}>
                                            {record.present ? 'PRESENT' : 'ABSENT'}
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message={filter.date && filter.class && filter.section && filter.timeSlot ? "No attendance found for selected time slot" : "Select date, class, section and time slot to view attendance"} icon="📅" />
                    )}
                  </div>
                ) : activeTab === 'analytics' ? (
                  <div className="p-4">
                    {/* Analytics Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                        <select
                          value={filter.class}
                          onChange={(e) => setFilter({...filter, class: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">All Classes</option>
                          {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                        <select
                          value={filter.section}
                          onChange={(e) => setFilter({...filter, section: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">All Sections</option>
                          {sections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                        <select
                          value={filter.subject}
                          onChange={(e) => setFilter({...filter, subject: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">All Subjects</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Test ID (Opt)</label>
                        <input
                          type="text"
                          value={filter.testId}
                          onChange={(e) => setFilter({...filter, testId: e.target.value})}
                          placeholder="Search Test ID"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <button
                        onClick={handleFilterAnalytics}
                        className="bg-primary text-white font-bold py-2 px-6 rounded-xl shadow-lg"
                      >
                        Analyze
                      </button>
                    </div>

                    {allMarks.length > 0 ? (
                      <div className="space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                            { label: 'Average Marks', value: analyticsData.avg, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Highest Mark', value: analyticsData.highest, color: 'text-green-600', bg: 'bg-green-50' },
                            { label: 'Lowest Mark', value: analyticsData.lowest, color: 'text-red-600', bg: 'bg-red-50' },
                            { label: 'Total Students', value: analyticsData.totalStudents, color: 'text-purple-600', bg: 'bg-purple-50' }
                          ].map((stat, i) => (
                            <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-white shadow-sm`}>
                              <p className="text-sm font-body text-gray-500 mb-1">{stat.label}</p>
                              <p className={`text-3xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Top Performers */}
                          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h4 className="text-xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
                              🏆 Top 5 Performers
                            </h4>
                            <div className="space-y-4">
                              {analyticsData.topPerformers.map((m, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                  <div>
                                    <p className="font-heading font-bold text-gray-800">{m.studentName}</p>
                                    <p className="text-xs text-gray-500">Roll No: {m.rollNo} | Class: {m.class}{m.section}</p>
                                  </div>
                                  <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-bold">
                                    {m.marks}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Weak Students */}
                          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h4 className="text-xl font-heading font-bold text-gray-800 mb-6 flex items-center gap-2">
                              ⚠️ Needs Improvement (&lt; 40%)
                            </h4>
                            {analyticsData.weakStudents.length > 0 ? (
                              <div className="space-y-4">
                                {analyticsData.weakStudents.map((m, i) => (
                                  <div key={i} className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                                    <div>
                                      <p className="font-heading font-bold text-gray-800">{m.studentName}</p>
                                      <p className="text-xs text-gray-500">Roll No: {m.rollNo} | Class: {m.class}{m.section}</p>
                                    </div>
                                    <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full font-bold">
                                      {m.marks}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center p-12 text-center">
                                <p className="text-gray-400 italic">No students found below 40% threshold. Great job!</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Detailed Table */}
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                          <div className="p-6 border-b border-gray-100">
                            <h4 className="text-xl font-heading font-bold text-gray-800">All Student Records</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50 text-gray-600">
                                  <th className="py-4 px-6 text-left font-heading font-semibold">Roll No</th>
                                  <th className="py-4 px-6 text-left font-heading font-semibold">Name</th>
                                  <th className="py-4 px-6 text-left font-heading font-semibold">Class</th>
                                  <th className="py-4 px-6 text-left font-heading font-semibold">Subject</th>
                                  <th className="py-4 px-6 text-center font-heading font-semibold">Marks</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {allMarks.map((m, i) => (
                                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-body font-medium">{m.rollNo}</td>
                                    <td className="py-4 px-6 font-body text-gray-800">{m.studentName}</td>
                                    <td className="py-4 px-6 font-body text-gray-500">{m.class}{m.section}</td>
                                    <td className="py-4 px-6 font-body text-gray-500">{m.subject}</td>
                                    <td className="py-4 px-6">
                                      <div className="flex justify-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          m.marks >= 80 ? 'bg-green-100 text-green-700' :
                                          m.marks >= 40 ? 'bg-blue-100 text-blue-700' :
                                          'bg-red-100 text-red-700'
                                        }`}>
                                          {m.marks}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyState message="Apply filters to see performance analytics" icon="📈" />
                    )}
                  </div>
                ) : activeTab === 'tests' ? (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 items-end">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subject Filter</label>
                        <select
                          value={filter.subject}
                          onChange={(e) => setFilter({...filter, subject: e.target.value})}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        >
                          <option value="">All Subjects</option>
                          <option value="Mathematics">Mathematics</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="English">English</option>
                          <option value="Computer Science">Computer Science</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Faculty Filter (Optional)</label>
                        <input
                          type="text"
                          value={filter.facultyId}
                          onChange={(e) => setFilter({...filter, facultyId: e.target.value})}
                          placeholder="Enter faculty ID or name"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>

                    {tests.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map(test => (
                          <div key={test.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                            <div className="mb-4">
                              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                                {test.subject}
                              </span>
                              <h4 className="text-lg font-heading font-bold text-gray-800">{test.title}</h4>
                              <p className="text-sm text-gray-500 font-body">Class {test.class} - {test.section || 'All Sections'}</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 font-body mb-4">
                              <p><strong>Date:</strong> {test.date}</p>
                              <p><strong>Duration:</strong> {test.duration}</p>
                              <p><strong>Faculty:</strong> {test.facultyName}</p>
                              {test.description && <p><strong>Description:</strong> {test.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="Filter by subject or faculty to view tests" icon="📝" />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AdminDashboard
