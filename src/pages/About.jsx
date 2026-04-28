import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'

const About = () => {
  const values = [
    {
      title: 'Active Learning',
      description: 'Active learning is a form of learning in which teaching strives to involve students in the learning process more directly than in other methods.',
    },
    {
      title: 'Pre-School',
      description: 'Your child is growing up fast and ready for a little more independence, our pre school club will be a perfect introduction.',
    },
    {
      title: 'Winfield Learning',
      description: 'Every child\'s journey is personal. Lessons are tailored towards each child\'s strengths and interests with choices about what, how, when and where they learn.',
    },
  ]

  return (
    <>
      <Helmet>
        <title>About Us | Winfield High School</title>
        <meta name="description" content="About Winfield High School - Khammam" />
      </Helmet>

      <section className="py-32 bg-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-32"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-purple-700 mb-8 leading-tight">
              About Us
            </h1>
          </motion.div>

          {/* Welcome Section - Left Text / Right Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-purple-700 mb-8 leading-tight">
                Welcome TO Winfield School
              </h2>
              <p className="text-xl text-gray-600 font-body leading-loose">
                The Winfield High School, as a day & residential school, must maintain a sharp focus on the pursuit of excellence
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students Learning"
                className="w-full rounded-2xl shadow-soft"
              />
            </div>
          </motion.div>

          {/* Values Section - Elegant Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-purple-700 mb-8 leading-tight">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-white p-12 rounded-2xl shadow-soft border border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-2xl font-heading font-bold text-purple-700 mb-6">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 font-body text-lg leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default About
