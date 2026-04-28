import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className={`bg-white rounded-2xl shadow-card hover:shadow-card-hover p-6 transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card
