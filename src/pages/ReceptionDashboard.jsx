import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { db } from '../firebase/config'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  bulkAddStudents 
} from '../firebase/firestore'
import { logout } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import * as XLSX from 'xlsx'

const ReceptionDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('manage') // manage, shuffle, upload
  const [students, setStudents] = useState([])
  const [selection, setSelection] = useState({ class: '', section: '' })
  
  // Form State
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    section: '',
    rollNo: '',
    stream: 'Non-IIT',
    board: 'CBSE'
  })

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const sections = ['A', 'B', 'C']
  const boards = ['CBSE', 'SSC']

  useEffect(() => {
    let unsubscribe = () => {}

    if (selection.class && selection.section) {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'students'),
          where('class', '==', String(selection.class)),
          where('section', '==', selection.section)
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
          toast.error("Failed to load students")
          setLoading(false)
        })
      } catch (err) {
        console.error("Query setup error:", err)
        setLoading(false)
      }
    } else {
      setStudents([])
      setLoading(false)
    }

    return () => unsubscribe()
  }, [selection.class, selection.section])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const studentData = {
      ...formData,
      class: parseInt(formData.class),
    }

    let result
    if (editingStudent) {
      result = await updateStudent(editingStudent.id, studentData)
    } else {
      result = await addStudent(studentData)
    }

    if (result.success) {
      toast.success(editingStudent ? 'Student updated!' : 'Student added!')
      setShowForm(false)
      setEditingStudent(null)
      setFormData({ name: '', class: '', section: '', rollNo: '', stream: 'Non-IIT', board: 'CBSE' })
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return
    setLoading(true)
    const result = await deleteStudent(id)
    if (result.success) {
      toast.success('Student deleted')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (evt) => {
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const data = XLSX.utils.sheet_to_json(ws)

      const formattedData = data.map(row => ({
        name: row.name,
        class: parseInt(row.class),
        section: row.section,
        rollNo: row.rollNo.toString(),
        stream: row.class >= 6 ? (row.stream || 'Non-IIT') : 'N/A'
      }))

      setLoading(true)
      const result = await bulkAddStudents(formattedData)
      if (result.success) {
        toast.success(`${result.count} students uploaded successfully!`)
      } else {
        toast.error(result.error)
      }
      setLoading(false)
    }
    reader.readAsBinaryString(file)
  }

  const handleSectionShuffle = async (studentId, newSection) => {
    const result = await updateStudent(studentId, { section: newSection })
    if (result.success) {
      setStudents(students.map(s => s.id === studentId ? { ...s, section: newSection } : s))
      toast.success('Section updated')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <>
      <Helmet>
        <title>Reception Dashboard | Winfield School</title>
      </Helmet>

      <section className="min-h-screen bg-purple-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-purple-700">Reception Dashboard</h1>
              <p className="text-gray-600 font-body">Manage students, sections, and bulk uploads</p>
            </div>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-heading font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg">
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-soft">
            {['manage', 'shuffle', 'upload'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-6 rounded-xl font-heading font-bold transition-all ${
                  activeTab === tab ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:bg-purple-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Selection Controls (for Manage & Shuffle) */}
          {activeTab !== 'upload' && (
            <div className="bg-white p-6 rounded-2xl shadow-soft mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Class</label>
                <select
                  value={selection.class}
                  onChange={(e) => setSelection({ ...selection, class: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">Choose Class</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Section</label>
                <select
                  value={selection.section}
                  onChange={(e) => setSelection({ ...selection, section: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                >
                  <option value="">Choose Section</option>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                disabled
                className="bg-purple-100 text-purple-600 font-heading font-semibold py-3.5 px-6 rounded-xl transition-all h-[52px] cursor-not-allowed opacity-70 shadow-sm"
              >
                {selection.class && selection.section ? (loading ? 'Syncing...' : 'Live Sync Active') : 'Choose Class & Section'}
              </button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="bg-white rounded-2xl shadow-soft min-h-[400px]">
            {loading && <div className="p-20"><LoadingSpinner /></div>}

            {!loading && activeTab === 'manage' && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-heading font-bold text-gray-800">Student Directory</h2>
                  <button
                    onClick={() => { setShowForm(true); setEditingStudent(null); }}
                    className="bg-green-600 hover:bg-green-700 text-white font-heading font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
                  >
                    + Add Student
                  </button>
                </div>

                {students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 text-left">
                          <th className="pb-4 font-heading font-bold text-gray-400 uppercase text-xs">Roll No</th>
                          <th className="pb-4 font-heading font-bold text-gray-400 uppercase text-xs">Name</th>
                          <th className="pb-4 font-heading font-bold text-gray-400 uppercase text-xs">Stream</th>
                          <th className="pb-4 font-heading font-bold text-gray-400 uppercase text-xs text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {students.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 font-body font-bold text-purple-600">{s.rollNo}</td>
                            <td className="py-4 font-body text-gray-800 font-medium">{s.name}</td>
                            <td className="py-4 font-body text-gray-500">{s.stream || 'N/A'}</td>
                            <td className="py-4 text-right space-x-2">
                              <button
                                onClick={() => { setEditingStudent(s); setFormData(s); setShowForm(true); }}
                                className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(s.id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState message="No students found. Load a class or add a new student." icon="👤" />
                )}
              </div>
            )}

            {!loading && activeTab === 'shuffle' && (
              <div className="p-8">
                <h2 className="text-2xl font-heading font-bold text-gray-800 mb-8">Section Shuffling</h2>
                {students.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {students.map((s) => (
                      <div key={s.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 hover:border-purple-200 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-xs font-bold text-purple-600 uppercase mb-1">Roll No: {s.rollNo}</p>
                            <h4 className="font-heading font-bold text-gray-800">{s.name}</h4>
                          </div>
                          <span className="bg-white px-3 py-1 rounded-lg text-sm font-bold shadow-sm">Sec: {s.section}</span>
                        </div>
                        <div className="flex gap-2">
                          {sections.map(sec => (
                            <button
                              key={sec}
                              onClick={() => handleSectionShuffle(s.id, sec)}
                              disabled={s.section === sec}
                              className={`flex-1 py-2 rounded-lg font-heading font-bold text-xs transition-all ${
                                s.section === sec ? 'bg-gray-200 text-gray-400' : 'bg-white hover:bg-purple-600 hover:text-white border border-gray-200 shadow-sm'
                              }`}
                            >
                              Move to {sec}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="Load a class to start shuffling sections." icon="🔄" />
                )}
              </div>
            )}

            {!loading && activeTab === 'upload' && (
              <div className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <span className="text-6xl mb-6 block">📊</span>
                  <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Bulk Student Upload</h2>
                  <p className="text-gray-600 font-body mb-8">
                    Upload an Excel (.xlsx) file with columns: <strong>name, class, section, rollNo, stream</strong>
                  </p>
                  <label className="block bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold py-4 px-8 rounded-2xl cursor-pointer transition-all shadow-xl shadow-purple-100">
                    <input type="file" accept=".xlsx" onChange={handleExcelUpload} className="hidden" />
                    Select Excel File
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add/Edit Student Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="bg-purple-600 p-8 text-white">
                <h3 className="text-2xl font-heading font-bold">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <p className="opacity-80">Enter student details below</p>
              </div>
              <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Student Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    >
                      <option value="">Select</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    >
                      <option value="">Select</option>
                      {sections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Roll No</label>
                    <input
                      type="text"
                      value={formData.rollNo}
                      onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                  {parseInt(formData.class) >= 6 && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Stream</label>
                      <select
                        value={formData.stream}
                        onChange={(e) => setFormData({...formData, stream: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                      >
                        <option value="IIT">IIT</option>
                        <option value="Non-IIT">Non-IIT</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Board</label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({...formData, board: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    >
                      {boards.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl font-heading font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 px-6 bg-purple-600 text-white rounded-2xl font-heading font-bold shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all"
                  >
                    {editingStudent ? 'Save Changes' : 'Add Student'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ReceptionDashboard
