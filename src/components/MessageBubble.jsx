import { motion } from 'framer-motion'

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isBot
            ? 'bg-gray-100 text-gray-800 rounded-tl-none'
            : 'bg-primary text-white rounded-tr-none'
        }`}
      >
        {message.isTyping ? (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        ) : (
          <p className="font-body text-sm">{message.text}</p>
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble
