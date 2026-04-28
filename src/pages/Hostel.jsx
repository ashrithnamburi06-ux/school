import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const Hostel = () => {
  const highlights = [
    {
      title: 'Separate Wings',
      description: 'Dedicated wings for boys and girls with separate dormitories and common areas',
      icon: '🏠',
    },
    {
      title: 'Study Areas',
      description: 'Well-lit, quiet study rooms with individual desks and modern amenities',
      icon: '📚',
    },
    {
      title: 'Recreation',
      description: 'Indoor games, TV room, and outdoor sports facilities for leisure time',
      icon: '🎮',
    },
    {
      title: 'Laundry Service',
      description: 'Regular laundry service ensuring clean uniforms and personal clothing',
      icon: '🧺',
    },
    {
      title: 'Nutritious Meals',
      description: 'Balanced, hygienic meals prepared in our modern kitchen with quality ingredients',
      icon: '🍽️',
    },
    {
      title: 'Medical Support',
      description: '24/7 medical care with on-campus nurse and tie-up with local hospitals',
      icon: '🏥',
    },
  ]

  const discipline = [
    'Structured daily routine for discipline and time management',
    'Regular study hours with supervised homework sessions',
    'Weekend recreational activities and outings',
    'Clean and hygienic living environment',
    'Respectful behavior and peer interaction encouraged',
    'Zero tolerance for bullying or misconduct',
  ]

  const routine = [
    { time: '5:30 AM', activity: 'Wake Up & Freshen Up' },
    { time: '6:00 AM', activity: 'Morning Exercise' },
    { time: '7:00 AM', activity: 'Breakfast' },
    { time: '8:00 AM', activity: 'School Classes' },
    { time: '1:00 PM', activity: 'Lunch Break' },
    { time: '4:30 PM', activity: 'Return to Hostel' },
    { time: '5:00 PM', activity: 'Snacks & Rest' },
    { time: '6:00 PM', activity: 'Study Hours' },
    { time: '8:00 PM', activity: 'Dinner' },
    { time: '9:00 PM', activity: 'Evening Study' },
    { time: '10:00 PM', activity: 'Lights Out' },
  ]

  const parentTrust = [
    {
      title: 'Communication System',
      description: 'Regular updates through SMS, app, and scheduled parent calls',
      icon: '📱',
    },
    {
      title: 'Emergency Care',
      description: 'Immediate medical attention and parent notification in emergencies',
      icon: '🚑',
    },
    {
      title: '24/7 Supervision',
      description: 'Trained wardens and staff available round the clock',
      icon: '👥',
    },
    {
      title: 'Visiting Schedule',
      description: 'Designated visiting hours for parents and guardians',
      icon: '📅',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Hostel - Winfield School</title>
        <meta name="description" content="Hostel facilities at Winfield School - A home away from home with safe, comfortable living and comprehensive care." />
      </Helmet>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 leading-tight">
              A Home Away From Home
            </h1>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Safe, comfortable, and nurturing hostel environment for your child
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-8 leading-tight">
              Hostel Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-soft p-8 hover:shadow-medium transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-4">
                    {item.title}
                  </h3>
                  <p className="text-text font-body text-base leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Discipline & Care */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                  Discipline & Care
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {discipline.map((item, index) => (
                  <li key={index} className="text-text font-body text-base flex items-start leading-relaxed">
                    <span className="text-accent mr-3 text-lg font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Daily Routine Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📅</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                  Daily Routine
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routine.map((item, index) => (
                  <div key={index} className="bg-background rounded-xl p-5 border-l-4 border-accent">
                    <div className="text-accent font-heading font-bold text-base mb-1">{item.time}</div>
                    <div className="text-text font-body text-sm">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Parent Trust */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-8 leading-tight text-center">
              Parent Trust & Communication
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {parentTrust.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-medium transition-shadow duration-300 text-center"
                >
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text font-body text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Hostel
