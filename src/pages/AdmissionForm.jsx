import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { addAdmission } from '../firebase/firestore'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import ErrorAlert from '../components/ErrorAlert'

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    studentName: '',
    parentContact: '',
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
    if (!formData.name.trim()) return 'Parent/Guardian Name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format'
    if (!formData.phone.trim()) return 'Phone is required'
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) return 'Invalid phone number (10 digits required)'
    if (!formData.class.trim()) return 'Class/Grade is required'
    if (!formData.studentName.trim()) return 'Student Name is required'
    if (!formData.parentContact.trim()) return 'Parent Contact is required'
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
    const result = await addAdmission(formData)
    setLoading(false)

    if (result.success) {
      toast.success('Application submitted successfully!')
      setFormData({ name: '', email: '', phone: '', class: '', studentName: '', parentContact: '' })
    } else {
      setError(result.error)
      toast.error('Failed to submit application')
    }
  }

  return (
    <>
      <Helmet>
        <title>Admissions - Winfield School</title>
        <meta name="description" content="Apply for admission to Winfield School. Start your child's journey to excellence today." />
      </Helmet>

      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
              Admission <span className="text-accent">Application</span>
            </h1>
            <p className="text-xl text-gray-600 font-body max-w-4xl mx-auto leading-relaxed">
              Start your child's journey to excellence. Fill out the form below to apply for admission.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-t-4 border-accent">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">Application Form</h2>
              <ErrorAlert message={error} />
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-semibold text-gray-700 mb-2">
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-body transition-all duration-200 hover:border-primary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block font-body font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-body transition-all duration-200 hover:border-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-body transition-all duration-200 hover:border-primary"
                      placeholder="1234567890"
                    />
                  </div>

                  <div>
                    <label className="block font-body font-semibold text-gray-700 mb-2">
                      Class/Grade Applying For *
                    </label>
                    <select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-body transition-all duration-200 hover:border-primary bg-white"
                    >
                      <option value="">Select Class</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-semibold text-gray-700 mb-2">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-body transition-all duration-200 hover:border-primary"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block font-body font-semibold text-gray-700 mb-2">
                      Parent Contact (Alternate) *
                    </label>
                    <input
                      type="tel"
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent font-body transition-all duration-200 hover:border-primary"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="font-heading font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-accent">ℹ️</span>
                    Important Information
                  </h3>
                  <ul className="space-y-3 text-gray-600 font-body">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      Applications are reviewed on a first-come, first-served basis
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      You will be contacted within 5-7 business days
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      Please ensure all information provided is accurate
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white font-heading font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default AdmissionForm
