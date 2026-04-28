import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Welcome = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const savedCurriculum = localStorage.getItem('curriculum')
    if (savedCurriculum) {
      navigate(savedCurriculum === 'cbse' ? '/cbse' : '/home')
    }
  }, [navigate])

  const handleSelect = (curriculum) => {
    localStorage.setItem('curriculum', curriculum)
    navigate(curriculum === 'cbse' ? '/cbse' : '/home')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6 leading-tight">
            Welcome to Winfield School
          </h1>
          <p className="text-2xl text-text font-body font-light">
            Choose Your Learning Path
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={() => handleSelect('cbse')}
            className="bg-white rounded-2xl shadow-soft p-10 cursor-pointer hover:shadow-medium hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <span className="text-5xl">🎓</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              CBSE Curriculum
            </h2>
            <p className="text-text font-body text-lg leading-relaxed">
              A modern, future-ready education system with structured curriculum, innovation, and competitive exam preparation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={() => handleSelect('ssc')}
            className="bg-white rounded-2xl shadow-soft p-10 cursor-pointer hover:shadow-medium hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
              <span className="text-5xl">📚</span>
            </div>
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              SSC Curriculum
            </h2>
            <p className="text-text font-body text-lg leading-relaxed">
              A strong academic foundation with balanced learning and proven teaching methods.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
