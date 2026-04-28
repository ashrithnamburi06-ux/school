import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { addContact } from '../firebase/firestore'
import toast from 'react-hot-toast'
import ErrorAlert from '../components/ErrorAlert'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format'
    if (!formData.phone.trim()) return 'Phone is required'
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) return 'Invalid phone number (10 digits required)'
    if (!formData.message.trim()) return 'Message is required'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    const result = await addContact(formData)
    setLoading(false)

    if (result.success) {
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } else {
      setError(result.error)
      toast.error('Failed to send message')
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Winfield School</title>
        <meta name="description" content="Get in touch with Winfield School." />
      </Helmet>

      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 font-body max-w-3xl mx-auto leading-relaxed">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-soft">
              <h2 className="text-2xl font-heading font-bold text-primary mb-8">Send a Message</h2>
              <ErrorAlert message={error} />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block font-body font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block font-body font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block font-body font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent-dark text-white font-heading font-semibold px-8 py-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Contact
