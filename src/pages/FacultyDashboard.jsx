import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { auth } from '../firebase/config'
import { db } from '../firebase/config'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { 
  submitAttendance, 
  checkAttendanceExists,
  createTest, 
  getTests,
  saveMarks,
  getMarksByTest
} from '../firebase/firestore'
import { logout, getUserData } from '../firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const FacultyDashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('attendance') // attendance, tests, marks
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [isLocked, setIsLocked] = useState(false)
  const [tests, setTests] = useState([])
  const [marks, setMarks] = useState({}) // studentId -> mark
  const [selectedTest, setSelectedTest] = useState('')
  const [facultyData, setFacultyData] = useState(null)
  const [selection, setSelection] = useState({
    class: '',
    section: '',
    board: 'CBSE',
    timeSlot: '',
    date: new Date().toISOString().split('T')[0]
  })

  const timeSlots = [
    '09:00 – 11:00',
    '11:00 – 12:30',
    '01:00 – 03:30',
    '03:30 – 05:00'
  ]
  const boards = ['CBSE', 'SSC']
  const [showTestForm, setShowTestForm] = useState(false)
  const [testForm, setTestForm] = useState({
    title: '',
    subject: '',
    class: '',
    section: '',
    stream: 'Non-IIT',
    date: '',
    duration: '',
    description: '',
    isPublic: false,
    questions: []
  })

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const sections = ['A', 'B', 'C']

  useEffect(() => {
    if (auth.currentUser) {
      loadFacultyData()
    }
  }, [])

  const loadFacultyData = async () => {
    const data = await getUserData(auth.currentUser.uid)
    setFacultyData(data)
    if (data?.subject) {
      setTestForm(prev => ({ ...prev, subject: data.subject }))
    }
  }

  useEffect(() => {
    let unsubscribe = () => {}
    
    if (activeTab === 'tests' && auth.currentUser) {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'tests'),
          where('facultyId', '==', auth.currentUser.uid)
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            const testsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            setTests(testsList)
          } catch (err) {
            console.error("Error processing tests snapshot:", err)
          } finally {
            setLoading(false)
          }
        }, (error) => {
          console.error("onSnapshot tests error:", error)
          toast.error("Failed to load tests")
          setLoading(false)
        })
      } catch (err) {
        console.error("Tests query setup error:", err)
        setLoading(false)
      }
    }

    return () => unsubscribe()
  }, [activeTab])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      toast.success('Logged out successfully')
      navigate('/')
    }
  }

  const handleMarksChange = (studentId, value) => {
    const numericValue = value === '' ? '' : Number(value)
    if (numericValue !== '' && (numericValue < 0 || numericValue > 100)) {
      return // Don't update if out of range
    }
    setMarks(prev => ({
      ...prev,
      [studentId]: numericValue
    }))
  }

  const handleSaveMarks = async () => {
    if (students.length === 0 || !selectedTest) return

    setLoading(true)
    const records = students.map(s => ({
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      marks: marks[s.id] || 0
    }))

    const test = tests.find(t => t.id === selectedTest)
    const marksData = {
      testId: selectedTest,
      class: parseInt(selection.class),
      section: selection.section,
      subject: facultyData?.subject,
      facultyId: auth.currentUser?.uid,
      facultyName: facultyData?.name,
      records: records
    }

    const result = await saveMarks(marksData)
    if (result.success) {
      toast.success('Marks saved successfully')
      setStudents([])
      setSelection({ class: '', section: '', board: 'CBSE' })
      setSelectedTest('')
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  useEffect(() => {
    let unsubscribe = () => {}

    if ((activeTab === 'attendance' || activeTab === 'marks') && selection.class && selection.section) {
      setLoading(true)
      try {
        const constraints = [
          where('class', '==', String(selection.class)),
          where('section', '==', selection.section),
          where('board', '==', selection.board)
        ]
        const q = query(collection(db, 'students'), ...constraints)

        unsubscribe = onSnapshot(q, async (snapshot) => {
          try {
            const studentsList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })).sort((a, b) => (a.rollNo || 0) - (b.rollNo || 0))
            
            setStudents(studentsList)

            // Special handling for attendance locking
            if (activeTab === 'attendance' && selection.timeSlot && selection.date) {
              const checkResult = await checkAttendanceExists(selection.class, selection.section, selection.timeSlot, selection.date, selection.board)
              if (checkResult.success && checkResult.exists) {
                setIsLocked(true)
                toast.error('Attendance already submitted for this time slot on ' + selection.date)
              } else {
                setIsLocked(false)
              }
            } else {
              setIsLocked(false)
            }

            // If in marks tab, also load existing marks for this test
            if (activeTab === 'marks' && selectedTest) {
              const marksResult = await getMarksByTest(selectedTest)
              if (marksResult.success) {
                const existingMarks = {}
                marksResult.data.forEach(m => {
                  existingMarks[m.studentId] = m.marks
                })
                setMarks(existingMarks)
              }
            }
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
      setIsLocked(false)
      setLoading(false)
    }

    return () => unsubscribe()
  }, [activeTab, selection.class, selection.section, selection.board, selection.timeSlot, selectedTest])

  const toggleAttendance = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = async () => {
    if (students.length === 0 || !selection.timeSlot) {
      toast.error('Please select a time slot')
      return
    }

    setLoading(true)
    const records = students.map(s => ({
      studentId: s.id,
      name: s.name,
      rollNo: s.rollNo,
      present: !!attendance[s.id]
    }))

    const attendanceData = {
      date: selection.date,
      class: selection.class,
      section: selection.section,
      board: selection.board,
      timeSlot: selection.timeSlot,
      facultyId: auth.currentUser?.uid,
      facultyName: facultyData?.name || 'Faculty',
      records: records
    }

    const result = await submitAttendance(attendanceData)
    if (result.success) {
      toast.success('Attendance saved successfully for ' + selection.date)
      setStudents([])
      setSelection({ 
        class: '', 
        section: '', 
        board: 'CBSE',
        timeSlot: '',
        date: new Date().toISOString().split('T')[0]
      })
    } else {
      toast.error(result.error)
    }
    setLoading(false)
  }

  const handleCreateTest = async (e) => {
    e.preventDefault()
    if (!testForm.title || !testForm.subject || !testForm.class || !testForm.date || !testForm.duration) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    const testData = {
      title: testForm.title,
      subject: testForm.subject,
      class: parseInt(testForm.class),
      section: testForm.section || null,
      stream: testForm.stream,
      date: testForm.date,
      duration: testForm.duration,
      description: testForm.description || null,
      isPublic: testForm.isPublic,
      questions: testForm.questions,
      facultyId: auth.currentUser?.uid,
      facultyName: facultyData?.name || 'Faculty'
    }

    const result = await createTest(testData)
    if (result.success) {
      toast.success('Test created successfully')
      setShowTestForm(false)
      setTestForm({
        title: '',
        subject: facultyData?.subject || '',
        class: '',
        section: '',
        stream: 'Non-IIT',
        date: '',
        duration: '',
        description: '',
        isPublic: false,
        questions: []
      })
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
              <p className="text-gray-600 font-body">
                {facultyData?.subject ? `Subject: ${facultyData.subject}` : 'Mark attendance and create tests'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-heading font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Logout
            </button>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-6 py-3 rounded-xl font-heading font-bold transition-all ${
                activeTab === 'attendance'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-100'
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-6 py-3 rounded-xl font-heading font-bold transition-all ${
                activeTab === 'tests'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-100'
              }`}
            >
              Tests
            </button>
            <button
              onClick={() => { setActiveTab('marks'); setStudents([]); }}
              className={`px-6 py-3 rounded-xl font-heading font-bold transition-all ${
                activeTab === 'marks'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-purple-100'
              }`}
            >
              Enter Marks
            </button>
          </div>

          {activeTab === 'attendance' && (
            <>
              {/* Selection Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-soft mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input
                    type="date"
                    value={selection.date}
                    onChange={(e) => setSelection({ ...selection, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Board</label>
                  <select
                    value={selection.board}
                    onChange={(e) => setSelection({ ...selection, board: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  >
                    {boards.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                  <select
                    value={selection.timeSlot}
                    onChange={(e) => setSelection({ ...selection, timeSlot: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
                <div className="md:col-span-4 flex justify-end">
                  <button
                    disabled
                    className="bg-purple-100 text-purple-600 font-heading font-semibold py-3 px-6 rounded-lg transition-all h-[52px] cursor-not-allowed opacity-70"
                  >
                    {selection.class && selection.section && selection.timeSlot ? (loading ? 'Loading Students...' : 'Students Loaded') : 'Select All Filters'}
                  </button>
                </div>
              </motion.div>

              {/* Attendance Table */}
              {students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden"
                >
                  {isLocked && (
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center justify-center gap-2">
                      <span className="text-red-600 font-bold">🔒 Attendance Locked:</span>
                      <span className="text-red-500 font-medium italic">Submitted for this time slot. No further edits allowed.</span>
                    </div>
                  )}
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
                            className={`transition-colors ${!attendance[student.id] && !isLocked ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                          >
                            <td className="py-4 px-6 font-body font-medium">{student.rollNo}</td>
                            <td className="py-4 px-6 font-body text-gray-800">{student.name}</td>
                            <td className="py-4 px-6">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => toggleAttendance(student.id)}
                                  disabled={isLocked}
                                  className={`w-24 py-2 rounded-full font-heading text-xs font-bold transition-all ${
                                    attendance[student.id]
                                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                                  } ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    {!isLocked && (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold py-3 px-10 rounded-xl transition-all shadow-lg hover:shadow-purple-200 disabled:opacity-50"
                      >
                        {loading ? 'Submitting...' : 'Submit Attendance'}
                      </button>
                    )}
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
            </>
          )}

          {activeTab === 'marks' && (
            <>
              {/* Selection Controls for Marks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-soft mb-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select
                    value={selection.class}
                    onChange={(e) => setSelection({ ...selection, class: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select Section</option>
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Board</label>
                  <select
                    value={selection.board}
                    onChange={(e) => setSelection({ ...selection, board: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    {boards.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test</label>
                  <select
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">Select Test</option>
                    {tests.map(t => (
                      <option key={t.id} value={t.id}>{t.title} ({t.date})</option>
                    ))}
                  </select>
                </div>
                <button
                  disabled
                  className="bg-purple-100 text-purple-600 font-heading font-semibold py-3 px-6 rounded-lg transition-all h-[52px] cursor-not-allowed opacity-70"
                >
                  {selection.class && selection.section && selectedTest ? (loading ? 'Loading Students...' : 'Students Loaded') : 'Select All Filters'}
                </button>
              </motion.div>

              {/* Marks Table */}
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
                          <th className="py-4 px-6 text-center font-heading font-semibold w-40">Marks (0-100)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6 font-body font-medium">{student.rollNo}</td>
                            <td className="py-4 px-6 font-body text-gray-800">{student.name}</td>
                            <td className="py-4 px-6">
                              <div className="flex justify-center">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={marks[student.id] ?? ''}
                                  onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                  className="w-24 px-3 py-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                  placeholder="0"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={handleSaveMarks}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold py-3 px-10 rounded-xl transition-all shadow-lg hover:shadow-purple-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Marks'}
                    </button>
                  </div>
                </motion.div>
              )}

              {students.length === 0 && !loading && (
                <div className="bg-white rounded-2xl p-20 text-center shadow-soft">
                  <span className="text-6xl mb-6 block">📊</span>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">Ready to enter marks?</h3>
                  <p className="text-gray-500 font-body italic">Select class, section, and test above to load students.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'tests' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-gray-800">Test Management</h2>
                <button
                  onClick={() => setShowTestForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
                >
                  + Create Test
                </button>
              </div>

              {loading ? (
                <div className="p-20"><LoadingSpinner /></div>
              ) : tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((test) => (
                    <div key={test.id} className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:border-purple-200 transition-all">
                      <div className="mb-4">
                        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                          {test.subject}
                        </span>
                        <h3 className="text-lg font-heading font-bold text-gray-800">{test.title}</h3>
                        <p className="text-sm text-gray-500 font-body">Class {test.class} - {test.section || 'All Sections'}</p>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 font-body">
                        <p><strong>Date:</strong> {test.date}</p>
                        <p><strong>Duration:</strong> {test.duration}</p>
                        {test.description && <p><strong>Description:</strong> {test.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-20 text-center shadow-soft">
                  <span className="text-6xl mb-6 block">📝</span>
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">No tests yet</h3>
                  <p className="text-gray-500 font-body italic">Click "Create Test" to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Test Creation Modal */}
      {showTestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-purple-600 p-8 text-white">
              <h3 className="text-2xl font-heading font-bold">Create New Test</h3>
              <p className="opacity-80">Enter test details below</p>
            </div>
            <form onSubmit={handleCreateTest} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Test Title</label>
                <input
                  type="text"
                  value={testForm.title}
                  onChange={(e) => setTestForm({...testForm, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={testForm.subject}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                  <select
                    value={testForm.class}
                    onChange={(e) => setTestForm({...testForm, class: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  >
                    <option value="">Select</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Section (Optional)</label>
                  <select
                    value={testForm.section}
                    onChange={(e) => setTestForm({...testForm, section: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="">All Sections</option>
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stream</label>
                  <select
                    value={testForm.stream}
                    onChange={(e) => setTestForm({...testForm, stream: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  >
                    <option value="IIT">IIT</option>
                    <option value="Non-IIT">Non-IIT</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={testForm.date}
                    onChange={(e) => setTestForm({...testForm, date: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={testForm.isPublic}
                      onChange={(e) => setTestForm({...testForm, isPublic: e.target.checked})}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="ml-3 text-sm font-bold text-gray-700">Make Test Public</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={testForm.duration}
                  onChange={(e) => setTestForm({...testForm, duration: e.target.value})}
                  placeholder="e.g. 1 hour 30 mins"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={testForm.description}
                  onChange={(e) => setTestForm({...testForm, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  rows="3"
                />
              </div>

              {/* Questions Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-700">Questions ({testForm.questions.length})</label>
                  <button
                    type="button"
                    onClick={() => {
                      const newQuestion = { question: '', options: ['', '', '', ''], correctAnswer: '' };
                      setTestForm({...testForm, questions: [...testForm.questions, newQuestion]});
                    }}
                    className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
                  >
                    + Add Question
                  </button>
                </div>
                
                {testForm.questions.map((q, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-bold text-purple-600">Q{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = testForm.questions.filter((_, i) => i !== idx);
                          setTestForm({...testForm, questions: updated});
                        }}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter question"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...testForm.questions];
                        updated[idx].question = e.target.value;
                        setTestForm({...testForm, questions: updated});
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 mb-3 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {q.options.map((opt, optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          placeholder={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const updated = [...testForm.questions];
                            updated[idx].options[optIdx] = e.target.value;
                            setTestForm({...testForm, questions: updated});
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      ))}
                    </div>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const updated = [...testForm.questions];
                        updated[idx].correctAnswer = e.target.value;
                        setTestForm({...testForm, questions: updated});
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    >
                      <option value="">Select Correct Answer</option>
                      {q.options.map((opt, optIdx) => opt && (
                        <option key={optIdx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTestForm(false)}
                  className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl font-heading font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-purple-600 text-white rounded-2xl font-heading font-bold shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default FacultyDashboard
