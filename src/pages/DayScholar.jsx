import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const DayScholar = () => {
  const features = [
    {
      title: 'Safe Transportation',
      description: 'GPS-enabled buses with trained drivers and attendants ensuring safe commute for your child',
      icon: '🚌',
    },
    {
      title: 'Student Safety',
      description: '24/7 CCTV surveillance, trained security staff, and strict visitor protocols',
      icon: '🛡️',
    },
    {
      title: 'Daily Routine',
      description: 'Structured schedule from morning assembly to dismissal with balanced learning and activities',
      icon: '⏰',
    },
    {
      title: 'Nutritious Meals',
      description: 'Hygienic, balanced meals prepared in our modern kitchen with quality ingredients',
      icon: '🍽️',
    },
    {
      title: 'Medical Support',
      description: 'On-campus medical room with trained staff for immediate health care needs',
      icon: '🏥',
    },
    {
      title: 'Parent Communication',
      description: 'Regular updates through SMS, app, and parent-teacher meetings',
      icon: '📱',
    },
  ]

  const routine = [
    { time: '8:00 AM', activity: 'Morning Assembly' },
    { time: '8:30 AM', activity: 'Classes Begin' },
    { time: '12:00 PM', activity: 'Lunch Break' },
    { time: '1:00 PM', activity: 'Afternoon Classes' },
    { time: '3:30 PM', activity: 'Activities & Sports' },
    { time: '4:30 PM', activity: 'Dismissal' },
  ]

  return (
    <>
      <Helmet>
        <title>Day Scholar - Winfield School</title>
        <meta name="description" content="Day Scholar program at Winfield School - Safe transportation, structured routine, and nurturing environment." />
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
              A Safe & Structured Day at School
            </h1>
            <p className="text-xl text-text font-body max-w-3xl mx-auto leading-relaxed font-light">
              Comprehensive day scholar program ensuring safety, learning, and holistic development
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-8 hover:shadow-medium transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="text-text font-body text-base leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Daily Routine Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-soft p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                Daily Routine
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routine.map((item, index) => (
                <div key={index} className="bg-background rounded-xl p-6 border-l-4 border-accent">
                  <div className="text-accent font-heading font-bold text-lg mb-2">{item.time}</div>
                  <div className="text-text font-body text-base">{item.activity}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default DayScholar
