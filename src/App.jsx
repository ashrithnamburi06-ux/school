import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CBSE from './pages/CBSE'
import About from './pages/About'
import Academics from './pages/Academics'
import Facilities from './pages/Facilities'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AdmissionForm from './pages/AdmissionForm'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import ChatbotButton from './components/ChatbotButton'
import ChatWindow from './components/ChatWindow'

import StaffLogin from './pages/StaffLogin'
import FacultyDashboard from './pages/FacultyDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cbse" element={<CBSE />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admissions" element={<AdmissionForm />} />
            <Route path="/login" element={<StaffLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty/dashboard" 
              element={
                <ProtectedRoute>
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reception/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="p-20 text-center">
                    <h1 className="text-4xl font-heading font-bold text-purple-700">Reception Dashboard</h1>
                    <p className="mt-4 text-gray-600">Welcome to the Winfield Reception Portal</p>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <ChatbotButton />
        <ChatWindow />
      </div>
    </Router>
  )
}

export default App
