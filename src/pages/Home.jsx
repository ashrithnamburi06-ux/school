import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const Home = () => {
  const navigate = useNavigate()
  const [showCurriculumModal, setShowCurriculumModal] = useState(false)
  const features = [
    {
      title: 'Holistic Development',
      description: 'Nurturing mind, body, and spirit through comprehensive education',
      icon: '�',
    },
    {
      title: 'Experienced Faculty',
      description: 'Qualified teachers passionate about bringing out the best in every child',
      icon: '👨‍🏫',
    },
    {
      title: 'Modern Infrastructure',
      description: 'State-of-the-art facilities for a complete learning experience',
      icon: '🏫',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Winfield School | Nurturing Young Minds</title>
        <meta name="description" content="Winfield School - Best International School in Khammam with CISCE & CIE Programme" />
      </Helmet>

      {/* Curriculum Selection Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
          >
            <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">
              Choose Your Curriculum
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => { setShowCurriculumModal(false); navigate('/cbse') }}
                className="bg-white border-2 border-cbse-primary rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 bg-cbse-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-cbse-primary mb-2">CBSE Curriculum</h3>
                <p className="text-text font-body text-sm">Modern, future-ready education with advanced academics and competitive preparation</p>
              </button>
              <button
                onClick={() => { setShowCurriculumModal(false) }}
                className="bg-white border-2 border-primary rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-2">SSC Curriculum</h3>
                <p className="text-text font-body text-sm">Strong foundational learning with balanced academics</p>
              </button>
            </div>
            <button
              onClick={() => setShowCurriculumModal(false)}
              className="mt-6 w-full text-gray-500 hover:text-gray-700 font-body text-sm"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero Section - Soft Green Gradient */}
      <section className="relative min-h-screen flex items-center bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary-light/85 to-accent/80"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-32 md:py-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center"
          >
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight text-white cursor-pointer hover:text-accent transition-colors duration-300"
              onClick={() => setShowCurriculumModal(true)}
            >
              Winfield High School
            </h1>
            <p className="text-xl md:text-2xl font-body mb-16 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              A journey of discovery, growth, and excellence from Class 1 to IIT and beyond
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => setShowCurriculumModal(true)}
                className="bg-accent hover:bg-accent-dark text-white font-heading font-semibold px-12 py-5 rounded-lg transition-all duration-400 text-lg shadow-lg"
              >
                Explore Curriculum
              </button>
              <Link
                to="/admissions"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-heading font-semibold px-12 py-5 rounded-lg transition-all duration-400 text-lg border border-white/40"
              >
                Apply Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STAGE 1: Class 1-5 (Little Learners) - Pale Yellow, Soft Green, Sky Blue */}
      <section className="py-32 bg-gradient-to-br from-stage1-yellow via-stage1-green to-stage1-blue">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <span className="text-primary font-heading font-semibold text-lg">Class 1–5</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Little Learners
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Playful beginnings with creativity, storytelling, and activity-based learning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Little Learners"
                className="w-full rounded-3xl shadow-soft"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-heading font-bold text-primary mb-3">Creative Learning</h3>
                <p className="text-text font-body text-lg leading-relaxed">Art, music, and hands-on activities that spark imagination</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-heading font-bold text-primary mb-3">Storytelling</h3>
                <p className="text-text font-body text-lg leading-relaxed">Building language skills through stories and rhymes</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft">
                <h3 className="text-2xl font-heading font-bold text-primary mb-3">Play-Based Activities</h3>
                <p className="text-text font-body text-lg leading-relaxed">Learning through play in a safe, joyful environment</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STAGE 2: Class 6-10 (Young Achievers) - Green and White */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-accent/10 px-6 py-2 rounded-full mb-6">
              <span className="text-accent font-heading font-semibold text-lg">Class 6–10</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Young Achievers
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Building confidence through sports, cultural activities, teamwork, and hands-on learning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6 order-2 md:order-1">
              <div className="bg-stage2-green/5 p-8 rounded-2xl border-2 border-accent/20">
                <h3 className="text-2xl font-heading font-bold text-accent mb-3">Sports Excellence</h3>
                <p className="text-text font-body text-lg leading-relaxed">Developing teamwork and physical fitness through various sports</p>
              </div>
              <div className="bg-stage2-green/5 p-8 rounded-2xl border-2 border-accent/20">
                <h3 className="text-2xl font-heading font-bold text-accent mb-3">Cultural Activities</h3>
                <p className="text-text font-body text-lg leading-relaxed">Expressing creativity through dance, music, and arts</p>
              </div>
              <div className="bg-stage2-green/5 p-8 rounded-2xl border-2 border-accent/20">
                <h3 className="text-2xl font-heading font-bold text-accent mb-3">Science Labs</h3>
                <p className="text-text font-body text-lg leading-relaxed">Hands-on experiments that bring concepts to life</p>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Young Achievers"
                className="w-full rounded-3xl shadow-medium"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STAGE 3: IIT / Future (Dream Builders) - Deep Blue and Gold */}
      <section className="py-32 bg-gradient-to-br from-stage3-blue to-primary">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-stage3-gold/20 px-6 py-2 rounded-full mb-6">
              <span className="text-stage3-gold font-heading font-semibold text-lg">IIT & Future</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Dream Builders
            </h2>
            <p className="text-xl text-white/90 font-body max-w-3xl mx-auto leading-relaxed font-light">
              Focused preparation for competitive exams, STEM excellence, and career building
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dream Builders"
                className="w-full rounded-3xl shadow-medium"
              />
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-stage3-gold mb-3">IIT Foundation</h3>
                <p className="text-white/90 font-body text-lg leading-relaxed">Structured preparation for IIT-JEE and competitive exams</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-stage3-gold mb-3">STEM Excellence</h3>
                <p className="text-white/90 font-body text-lg leading-relaxed">Advanced science, technology, engineering, and mathematics</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <h3 className="text-2xl font-heading font-bold text-stage3-gold mb-3">Career Guidance</h3>
                <p className="text-white/90 font-body text-lg leading-relaxed">Expert counseling for informed career decisions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Day Scholar Section */}
      <section className="py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Day Scholar Experience
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Comprehensive day scholar program ensuring safety, learning, and holistic development
            </p>
          </motion.div>

          {/* Transportation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-soft p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🚌</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Transportation
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Well-Maintained Buses</h4>
                <p className="text-text font-body text-base">Regularly serviced school buses for safe and reliable transport</p>
              </div>
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Experienced Drivers</h4>
                <p className="text-text font-body text-base">Trained and licensed drivers with years of experience</p>
              </div>
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Female Attendants</h4>
                <p className="text-text font-body text-base">Dedicated female attendants for student care during commute</p>
              </div>
            </div>
          </motion.div>

          {/* Safety */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-soft p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🛡️</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Safety
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Supervised Travel</h4>
                <p className="text-text font-body text-base">Continuous supervision during entire transportation</p>
              </div>
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Safe Pickup & Drop</h4>
                <p className="text-text font-body text-base">Designated safe pickup and drop points for all students</p>
              </div>
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Student Focus</h4>
                <p className="text-text font-body text-base">Priority on student safety and comfort at all times</p>
              </div>
            </div>
          </motion.div>

          {/* Daily Structure */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-soft p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">⏰</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Daily Structure
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Balanced Program</h4>
                <p className="text-text font-body text-base">Perfect blend of academics, sports, and co-curricular activities</p>
              </div>
              <div className="bg-background rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Guided Routine</h4>
                <p className="text-text font-body text-base">Structured schedule with supervision during school hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
              <h4 className="text-2xl font-heading font-bold text-primary leading-tight">
                Daily Routine
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { time: '8:00 AM', activity: 'Morning Assembly' },
                { time: '8:30 AM', activity: 'Classes Begin' },
                { time: '12:00 PM', activity: 'Lunch Break' },
                { time: '1:00 PM', activity: 'Afternoon Classes' },
                { time: '3:30 PM', activity: 'Activities & Sports' },
                { time: '4:30 PM', activity: 'Dismissal' },
              ].map((item, index) => (
                <div key={index} className="bg-background rounded-xl p-5 border-l-4 border-accent">
                  <div className="text-accent font-heading font-bold text-base mb-1">{item.time}</div>
                  <div className="text-text font-body text-sm">{item.activity}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hostel Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Hostel – A Home Away From Home
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Safe, comfortable, and nurturing hostel environment for your child
            </p>
          </motion.div>

          {/* Facilities */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-background rounded-2xl shadow-soft p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🏠</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Facilities
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Separate Wings</h4>
                <p className="text-text font-body text-base">Dedicated wings for boys and girls</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Dormitories</h4>
                <p className="text-text font-body text-base">Comfortable beds with storage</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Study Areas</h4>
                <p className="text-text font-body text-base">Quiet study rooms and recreation</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Daily Services</h4>
                <p className="text-text font-body text-base">Laundry and meals included</p>
              </div>
            </div>
          </motion.div>

          {/* Discipline & Care */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-background rounded-2xl shadow-soft p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">⭐</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Discipline & Care
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Clean Environment</h4>
                <p className="text-text font-body text-base">Organized and hygienic living spaces</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Supervised Routines</h4>
                <p className="text-text font-body text-base">Structured daily schedules with supervision</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Respectful Behavior</h4>
                <p className="text-text font-body text-base">Encouraging positive peer interactions</p>
              </div>
            </div>
          </motion.div>

          {/* Medical & Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-background rounded-2xl shadow-soft p-8 md:p-12 mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🏥</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Medical & Support
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Medical Care</h4>
                <p className="text-text font-body text-base">Access to school medical facilities</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Emergency Support</h4>
                <p className="text-text font-body text-base">Immediate assistance when needed</p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h4 className="text-lg font-heading font-bold text-primary mb-2">Parent Communication</h4>
                <p className="text-text font-body text-base">Regular updates and contact maintained</p>
              </div>
            </div>
          </motion.div>

          {/* Daily Routine */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-background rounded-2xl shadow-soft p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-3xl font-heading font-bold text-primary leading-tight">
                Daily Routine
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { time: '5:30 AM', activity: 'Wake Up' },
                { time: '6:00 AM', activity: 'Physical Activity' },
                { time: '7:00 AM', activity: 'Breakfast' },
                { time: '8:00 AM', activity: 'School' },
                { time: '1:00 PM', activity: 'Lunch' },
                { time: '4:30 PM', activity: 'Return to Hostel' },
                { time: '5:00 PM', activity: 'Sports' },
                { time: '6:00 PM', activity: 'Evening Study' },
                { time: '8:00 PM', activity: 'Dinner' },
                { time: '9:00 PM', activity: 'Study' },
                { time: '10:00 PM', activity: 'Lights Out' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border-l-4 border-accent">
                  <div className="text-accent font-heading font-bold text-sm mb-1">{item.time}</div>
                  <div className="text-text font-body text-xs">{item.activity}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us - Clean Layout */}
      <section className="py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Why Choose Winfield
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              A nurturing environment where every child thrives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-white p-12 rounded-2xl shadow-soft">
                  <div className="text-7xl mb-8">{feature.icon}</div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-text font-body text-lg leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities - Image-Focused Cards */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Our Facilities
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              World-class infrastructure for complete development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', title: 'Smart Classrooms', description: 'Modern digital classrooms with interactive boards' },
              { image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', title: 'Science Lab', description: 'Well-equipped labs for hands-on learning' },
              { image: 'https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', title: 'Library', description: 'Extensive collection of books and digital resources' },
              { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', title: 'Sports Ground', description: 'Multi-sport facilities for physical development' },
              { image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', title: 'Computer Lab', description: 'Advanced computing facilities for digital literacy' },
              { image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', title: 'Auditorium', description: 'Spacious auditorium for cultural events and assemblies' },
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white font-heading font-bold text-xl mb-1">{facility.title}</h3>
                    <p className="text-white/80 font-body text-sm">{facility.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Life - Real Images Grid */}
      <section className="py-32 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              Student Life
            </h2>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Moments of joy, learning, and growth
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image}
                    alt={`Student Life ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Strong Admissions */}
      <section className="py-32 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 leading-tight">
              Begin Your Child's Journey
            </h2>
            <p className="text-white/90 font-body text-xl max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Admissions Open for Academic Year 2026-27
            </p>
            <Link
              to="/admissions"
              className="inline-block bg-accent hover:bg-accent-dark text-white font-heading font-semibold px-16 py-6 rounded-lg transition-all duration-400 text-xl shadow-lg"
            >
              Apply Now
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Home
