import { motion, AnimatePresence } from 'framer-motion'
import { useChatbot } from '../hooks/useChatbot'
import MessageBubble from './MessageBubble'

const ChatWindow = () => {
  const { isOpen, messages, input, setInput, handleSend, messagesEndRef } = useChatbot()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-soft z-50 overflow-hidden"
        >
          <div className="bg-primary text-white p-4">
            <h3 className="font-heading font-bold text-lg">School Assistant</h3>
            <p className="text-sm text-gray-200">How can I help you today?</p>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 font-body py-8">
                <p>Ask me about:</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Admissions</li>
                  <li>• Fees</li>
                  <li>• Facilities</li>
                  <li>• Contact info</li>
                </ul>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ChatWindow
