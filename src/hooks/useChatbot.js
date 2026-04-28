import { useState, useEffect, useRef } from 'react'

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('enroll')) {
      return 'To apply for admission, please visit our Admissions page. You can fill out the application form there. Our team will review your application and contact you within 5-7 business days.'
    }

    if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('tuition')) {
      return 'Our fee structure varies by grade level. For detailed information about tuition and fees, please contact our admissions office at info@winfieldschool.com or call (555) 123-4567.'
    }

    if (lowerMessage.includes('facility') || lowerMessage.includes('campus') || lowerMessage.includes('infrastructure')) {
      return 'Our campus features modern classrooms, science labs, a library, sports complex, computer labs, art studios, cafeteria, and a health center. We provide state-of-the-art facilities to support holistic development.'
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('address') || lowerMessage.includes('location')) {
      return 'You can reach us at: Address: 123 Education Lane, City, State 12345. Phone: (555) 123-4567. Email: info@winfieldschool.com. Office hours: Monday - Friday, 8:00 AM - 4:00 PM.'
    }

    if (lowerMessage.includes('academic') || lowerMessage.includes('curriculum') || lowerMessage.includes('program')) {
      return 'We offer comprehensive academic programs from Grade 1 to Grade 12, including STEM courses, AP classes, arts, and athletics. Our curriculum is designed to prepare students for college and beyond.'
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! Welcome to Winfield School. How can I assist you today?'
    }

    return "I'm here to help! You can ask me about admissions, fees, facilities, contact information, or academic programs. For more detailed assistance, please contact our office directly."
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    const typingMessage = {
      id: Date.now() + 1,
      text: '',
      sender: 'bot',
      isTyping: true,
    }

    setMessages((prev) => [...prev, typingMessage])

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 2,
        text: getBotResponse(input),
        sender: 'bot',
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== typingMessage.id).concat(botResponse))

      // API-ready structure for future implementation
      // const apiResponse = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: input })
      // })
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    handleSend,
    messagesEndRef,
  }
}
