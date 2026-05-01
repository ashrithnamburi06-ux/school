import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const TestAttempt = () => {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  
  // Student identification
  const [rollNo, setRollNo] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testDoc = await getDoc(doc(db, 'tests', testId))
        if (testDoc.exists()) {
          const testData = testDoc.data()
          if (testData.isPublic) {
            setTest({ id: testDoc.id, ...testData })
          } else {
            navigate('/tests')
          }
        } else {
          navigate('/tests')
        }
      } catch (error) {
        console.error('Error fetching test:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [testId, navigate])

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer })
  }

  const calculateScore = () => {
    let correct = 0
    test.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++
    })
    return {
      correct,
      total: test.questions.length,
      percentage: Math.round((correct / test.questions.length) * 100)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!test) return null

  // Student Input Form - Before Test Starts
  if (!hasStarted) {
    return (
      <>
        <Helmet>
          <title>Start Test | {test.title}</title>
        </Helmet>
        <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-6">
          <div className="max-w-xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
                  {test.title}
                </h2>
                <p className="text-gray-500">
                  {test.subject} | Class {test.class} | {test.questions?.length || 0} Questions
                </p>
              </div>

              <h3 className="text-lg font-bold text-gray-700 mb-4">Enter Your Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Roll Number</label>
                  <input
                    type="number"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="Enter your roll number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Class</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                  >
                    <option value="">Select Class</option>
                    {['6', '7', '8', '9', '10'].map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (!rollNo || !studentClass) {
                      alert('Please enter your roll number and select your class')
                      return
                    }
                    setHasStarted(true)
                  }}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold py-4 rounded-xl transition-all"
                >
                  Start Test →
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <>
        <Helmet>
          <title>Test Results | {test.title}</title>
        </Helmet>
        <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <span className="text-6xl mb-4 block">
                {score.percentage >= 60 ? '🎉' : '📝'}
              </span>
              <h2 className="text-3xl font-heading font-bold text-gray-800 mb-2">
                Test Completed!
              </h2>
              <p className="text-gray-600 mb-8">{test.title}</p>
              
              <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {score.correct}/{score.total}
                </div>
                <p className="text-gray-600">
                  You scored {score.percentage}%
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {test.questions.map((q, idx) => (
                  <div key={idx} className={`p-4 rounded-xl text-left ${
                    answers[idx] === q.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <p className="font-semibold text-sm mb-2">Q{idx + 1}. {q.question}</p>
                    <p className="text-sm">
                      Your answer: <span className={answers[idx] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                        {answers[idx] || 'Not answered'}
                      </span>
                    </p>
                    {answers[idx] !== q.correctAnswer && (
                      <p className="text-sm text-green-600 mt-1">
                        Correct answer: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/tests')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                Back to Tests
              </button>
            </motion.div>
          </div>
        </section>
      </>
    )
  }

  const question = test.questions[currentQuestion]

  return (
    <>
      <Helmet>
        <title>{test.title} | Winfield High School</title>
      </Helmet>

      <section className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-heading font-bold text-gray-800">{test.title}</h1>
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                {currentQuestion + 1} of {test.questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Q{currentQuestion + 1}. {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    answers[currentQuestion] === option 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswer(currentQuestion, option)}
                    className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 font-medium text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 font-bold text-gray-600 disabled:opacity-50 hover:border-purple-400 transition-colors"
            >
              ← Previous
            </button>
            
            {currentQuestion < test.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => setShowResults(true)}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors"
              >
                Submit Test ✓
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default TestAttempt
