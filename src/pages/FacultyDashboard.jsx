import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { auth } from '../firebase/config'
import { getStudentsByClass, submitAttendance } from '../firebase/firestore'
import { logout } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [selection, setSelection] = useState({
    class: '',
    section: ''
  })

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const sections = ['A', 'B', 'C']

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/')
    }
  }

  const loadStudents = async () => {
    if (!selection.class || !selection.section) {
      toast.error('Please select both class and section')
      return
    }

    setLoading(true)
    const result = await getStudentsByClass(selection.class, selection.section)
    if (result.success) {
      setStudents(result.data)
      // Initialize all as present
      const initialAttendance = {}
      result.data.forEach(s => initialAttendance[s.id] = true)
      setAttendance(initialAttendance)
      if (result.data.length === 0) {
        toast.error('No students found for this class/section')
      }
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = async () => {
    if (students.length === 0) return

    setLoading(true)
    const records = students.map(s => ({
      studentId: s.id,
      name: s.name,
      rollNo: s.rollNo,
      present: attendance[s.id]
    }))

    const attendanceData = {
      class: selection.class,
      section: selection.section,
      facultyId: auth.currentUser?.uid,
      records: records
    }

    const result = await submitAttendance(attendanceData)
    if (result.success) {
      toast.success('Attendance saved successfully')
      setStudents([]) // Reset after success
      setSelection({ class: '', section: '' })
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  return (
    <>
      <Helmet>
        <title>Faculty Dashboard | Winfield High School</title>
      </Helmet>

      <section className="min-h-screen bg-purple-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-purple-700">Faculty Dashboard</h1>
              <p className="text-gray-600 font-body">Mark daily attendance for your students</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-heading font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Logout
            </button>
          </motion.div>

          {/* Selection Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-soft mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selection.class}
                onChange={(e) => setSelection({ ...selection, class: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={selection.section}
                onChange={(e) => setSelection({ ...selection, section: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              >
                <option value="">Select Section</option>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button
              onClick={loadStudents}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 h-[52px]"
            >
              {loading ? 'Loading...' : 'Load Students'}
            </button>
          </motion.div>

          {/* Attendance Table */}
          {students.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-soft overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-purple-600 text-white">
                      <th className="py-4 px-6 text-left font-heading font-semibold">Roll No</th>
                      <th className="py-4 px-6 text-left font-heading font-semibold">Student Name</th>
                      <th className="py-4 px-6 text-center font-heading font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => (
                      <tr 
                        key={student.id} 
                        className={`transition-colors ${!attendance[student.id] ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="py-4 px-6 font-body font-medium">{student.rollNo}</td>
                        <td className="py-4 px-6 font-body text-gray-800">{student.name}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <button
                              onClick={() => toggleAttendance(student.id)}
                              className={`w-24 py-2 rounded-full font-heading text-xs font-bold transition-all ${
                                attendance[student.id]
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {attendance[student.id] ? 'PRESENT' : 'ABSENT'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="text-gray-600 font-body">
                  Total Students: <span className="font-bold text-gray-800">{students.length}</span> | 
                  Present: <span className="font-bold text-green-600">{Object.values(attendance).filter(v => v).length}</span> | 
                  Absent: <span className="font-bold text-red-600">{Object.values(attendance).filter(v => !v).length}</span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold py-3 px-10 rounded-xl transition-all shadow-lg hover:shadow-purple-200 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Attendance'}
                </button>
              </div>
            </motion.div>
          )}

          {students.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-20 text-center shadow-soft">
              <span className="text-6xl mb-6 block">📚</span>
              <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">Ready to take attendance?</h3>
              <p className="text-gray-500 font-body italic">Select a class and section above to get started.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default FacultyDashboard
