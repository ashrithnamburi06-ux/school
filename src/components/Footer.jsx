import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-heading font-bold mb-4">Winfield School</h3>
            <p className="text-white/80 font-body leading-relaxed">
              Best International School in Khammam with CISCE & CIE Programme
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3 font-body">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="text-white/80 hover:text-white transition-colors">Academics</Link></li>
              <li><Link to="/facilities" className="text-white/80 hover:text-white transition-colors">Facilities</Link></li>
              <li><Link to="/gallery" className="text-white/80 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3 font-body text-white/80">
              <li>Mamata Hospital Road</li>
              <li>Khammam, Telangana</li>
              <li>Phone: +91 XXXXX XXXXX</li>
              <li>Email: info@winfieldschool.com</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-white/20 mt-12 pt-8 text-center font-body text-white/80"
        >
          <p>&copy; {new Date().getFullYear()} Winfield School. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
