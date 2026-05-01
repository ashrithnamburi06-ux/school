import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { db } from '../firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const PublicTests = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStream, setSelectedStream] = useState('Non-IIT')
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(false)

  const classes = ['6', '7', '8', '9', '10']
  const streams = ['IIT', 'Non-IIT']

  useEffect(() => {
    const fetchTests = async () => {
      if (!selectedClass || !selectedStream) {
        setTests([])
        return
      }

      setLoading(true)
      try {
        const q = query(
          collection(db, 'tests'),
          where('class', '==', parseInt(selectedClass)),
          where('stream', '==', selectedStream),
          where('isPublic', '==', true)
        )

        const snapshot = await getDocs(q)
        const testsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTests(testsList)
      } catch (error) {
        console.error('Error fetching tests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [selectedClass, selectedStream])

  return (
    <>
      <Helmet>
        <title>Public Tests | Winfield High School</title>
      </Helmet>

      <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-purple-700 mb-4">
              Practice Tests
            </h1>
            <p className="text-gray-600 font-body text-lg max-w-2xl mx-auto">
              Select your class and stream to access available practice tests. No login required.
            </p>
          </motion.div>

          {/* Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                >
                  <option value="">Choose Class</option>
                  {classes.map(c => (
                    <option key={c} value={c}>Class {c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Select Stream</label>
                <select
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                >
                  {streams.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Tests List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : tests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test, idx) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-purple-600 p-4">
                    <span className="text-purple-200 text-xs font-bold uppercase tracking-wider">
                      {test.subject}
                    </span>
                    <h3 className="text-white font-heading font-bold text-xl mt-1">
                      {test.title}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-purple-500">📅</span> {test.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-purple-500">⏱️</span> {test.duration}
                      </span>
                    </div>
                    {test.description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {test.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                        {test.questions?.length || 0} Questions
                      </span>
                      <Link
                        to={`/test/${test.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
                      >
                        Start Test →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : selectedClass ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Tests Available</h3>
              <p className="text-gray-500">
                No public tests found for Class {selectedClass} - {selectedStream}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <span className="text-6xl mb-4 block">👆</span>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Select Filters</h3>
              <p className="text-gray-500">
                Choose your class and stream to see available tests
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}

export default PublicTests
