import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const CBSE = () => {
  const navigate = useNavigate()
  const advantages = [
    { title: 'National-Level Curriculum', description: 'Recognized across India with standardized evaluation', icon: '🌍' },
    { title: 'Concept-Based Learning', description: 'Focus on understanding over rote memorization', icon: '💡' },
    { title: 'Continuous Assessment', description: 'Regular evaluations for consistent improvement', icon: '📊' },
    { title: 'Competitive Exam Foundation', description: 'Strong base for IIT, NEET, and other exams', icon: '🎯' },
    { title: 'Holistic Development', description: 'Balanced focus on academics and co-curricular', icon: '🌟' },
  ]

  const academicStructure = [
    { level: 'Primary (1–5)', description: 'Activity-based learning with focus on foundations', icon: '🎨' },
    { level: 'Middle (6–8)', description: 'Concept clarity and skill building', icon: '🔬' },
    { level: 'Secondary (9–10)', description: 'Exam readiness with subject depth', icon: '📖' },
  ]

  const calendar = [
    { month: 'April - September', events: ['Term 1', 'Quarterly Exams', 'Mid-Term Exams'] },
    { month: 'October - March', events: ['Term 2', 'Half-Yearly Exams', 'Final Exams', 'Annual Day'] },
  ]

  const labs = [
    { title: 'Science Labs', description: 'Physics, Chemistry, Biology labs with modern equipment', icon: '🧪' },
    { title: 'Computer Labs', description: 'Advanced computing facilities for digital literacy', icon: '💻' },
    { title: 'Robotics & STEM', description: 'Hands-on robotics and practical learning', icon: '🤖' },
    { title: 'Experiments', description: 'Regular hands-on experiments and projects', icon: '🔭' },
  ]

  const sports = [
    { title: 'Outdoor Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Indoor Games', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Cultural Programs', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { title: 'Clubs & Activities', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
  ]

  return (
    <>
      <Helmet>
        <title>CBSE Curriculum - Winfield School</title>
        <meta name="description" content="CBSE Curriculum at Winfield School - Future-ready education with structured learning" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-indigo-900/80"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-10 md:p-16">
              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 leading-tight text-white">
                Empowering Future Leaders with CBSE Excellence
              </h1>
              <p className="text-xl md:text-2xl font-body mb-16 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
                A future-ready education system designed to build confidence, knowledge, and success.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/admissions"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-heading font-semibold px-12 py-5 rounded-lg transition-all duration-400 text-lg shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Apply Now
                </Link>
                <Link
                  to="/academics"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-heading font-semibold px-12 py-5 rounded-lg transition-all duration-400 text-lg border border-white/40 hover:border-white/60 hover:scale-105"
                >
                  Explore Curriculum
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CBSE Advantage */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-heading font-bold text-purple-700 mb-6 leading-tight">
              Why Choose CBSE at Winfield
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 border border-purple-100 hover:border-purple-400 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-purple-700 mb-4">{item.title}</h3>
                <p className="text-gray-700 font-body text-base leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Structure */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-heading font-bold text-purple-700 mb-6 leading-tight">
              Our Academic Structure
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 border border-purple-100 hover:border-purple-400 transition-all duration-300"
            >
              <h3 className="text-xl font-heading font-semibold text-purple-700 mb-3">Primary Years</h3>
              <p className="text-gray-700 font-body text-base leading-relaxed">
                Activity-based learning focusing on creativity, storytelling, and strong foundations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 border border-purple-100 hover:border-purple-400 transition-all duration-300"
            >
              <h3 className="text-xl font-heading font-semibold text-purple-700 mb-3">Middle School</h3>
              <p className="text-gray-700 font-body text-base leading-relaxed">
                Focus on concept clarity, skill development, and practical learning.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-105 border border-purple-100 hover:border-purple-400 transition-all duration-300"
            >
              <h3 className="text-xl font-heading font-semibold text-purple-700 mb-3">Secondary School</h3>
              <p className="text-gray-700 font-body text-base leading-relaxed">
                Strong academic preparation, subject depth, and future readiness.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-heading font-bold text-purple-700 mb-6 leading-tight">
              Academic Calendar
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {calendar.map((term, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-heading font-bold text-purple-700 mb-4">{term.month}</h3>
                <ul className="space-y-3">
                  {term.events.map((event, i) => (
                    <li key={i} className="text-gray-700 font-body text-base flex items-center">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                      {event}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs & Innovation */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold text-cbse-primary mb-6 leading-tight">
              Innovation & Practical Learning
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labs.map((lab, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-cbse-bg rounded-2xl shadow-soft p-6 hover:shadow-lg border border-cbse-border hover:border-cbse-light transition-all duration-300"
              >
                <div className="w-14 h-14 bg-cbse-light/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">{lab.icon}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-cbse-primary mb-2">{lab.title}</h3>
                <p className="text-text font-body text-sm leading-relaxed">{lab.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports & Activities */}
      <section className="py-20 bg-cbse-bg">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold text-cbse-primary mb-6 leading-tight">
              Sports & Co-Curricular Excellence
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sports.map((sport, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-lg border border-cbse-border hover:border-cbse-light transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={sport.image}
                    alt={sport.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <h3 className="text-white font-heading font-bold text-lg">{sport.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IIT / NEET Foundation */}
      <section className="py-20 bg-gradient-to-br from-cbse-primary to-cbse-dark">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold text-white mb-6 leading-tight">
              Future-Ready Competitive Preparation
            </h2>
            <p className="text-xl text-white/90 font-body max-w-3xl mx-auto leading-relaxed font-light">
              Early preparation for IIT, NEET, and other competitive exams
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Early Concept Building', description: 'Strong foundation from early grades' },
              { title: 'Problem-Solving Approach', description: 'Develop analytical thinking skills' },
              { title: 'Advanced Math & Science', description: 'In-depth subject expertise' },
              { title: 'IIT / NEET Guidance', description: 'Expert counseling and preparation' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <h3 className="text-xl font-heading font-bold text-white mb-2">{item.title}</h3>
                <p className="text-white/80 font-body text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-heading font-bold text-cbse-primary mb-6 leading-tight">
              World-Class Facilities
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Smart Classrooms', icon: '📱' },
              { title: 'Modern Library', icon: '📚' },
              { title: 'Science Labs', icon: '🔬' },
              { title: 'Sports Infrastructure', icon: '🏆' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-cbse-bg rounded-2xl shadow-soft p-6 text-center hover:shadow-lg border border-cbse-border hover:border-cbse-light transition-all duration-300"
              >
                <div className="w-16 h-16 bg-cbse-light/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-cbse-primary">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-heading font-bold text-white mb-6 leading-tight">
              Start Your Child's Future Today
            </h2>
            <p className="text-white/90 font-body text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Admissions Open for CBSE Curriculum
            </p>
            <Link
              to="/admissions"
              className="inline-block bg-white hover:bg-gray-100 text-purple-700 font-heading font-semibold px-16 py-6 rounded-lg transition-all duration-400 text-xl shadow-lg hover:shadow-xl hover:scale-105"
            >
              Apply for CBSE Admission
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default CBSE
