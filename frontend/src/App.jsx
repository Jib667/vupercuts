import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import Reviews from './pages/Reviews'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AdminProvider } from './contexts/AdminContext'
import './App.css'

function App() {
  return (
    <AdminProvider>
      <div className="app">
        <Navbar />
        <main className="content" style={{ 
          paddingTop: '0',
          position: 'relative',
          zIndex: 1
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AdminProvider>
  )
}

export default App 