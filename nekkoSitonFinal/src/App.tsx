import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import WhyChooseUsPage from './pages/WhyChooseUsPage'
import AboutPage from './pages/AboutPage'
import OurProcessPage from './pages/OurProcessPage'
import ServicesPage from './pages/ServicesPage'
import GalleryPage from './pages/GalleryPage'
import LoadingPage from './pages/LoadingPage'
import LoginPage from './pages/LoginPage'
import BookingPage from './pages/BookingPage'
import AdminPage from './pages/AdminPage'
import ProfilePage from './pages/ProfilePage'
import ContactPage from './pages/ContactPage'
// import supabase from './utils/supabase'
import './App.css'


/* -------------------------
   Scrollable landing page
-------------------------- */
const MainPage = () => {
  return (
    <>
      <section id="home">
        <HomePage />
      </section>

      <section id="why-choose-us">
        <WhyChooseUsPage />
      </section>

      <section id="about">
        <AboutPage />
      </section>

      <section id="our-process">
        <OurProcessPage />
      </section>

         
    </>
  )
}

/* -------------------------
   App content (with loading)
-------------------------- */
const AppContent = () => {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Loading screen only on home
  useEffect(() => {
    if (location.pathname !== '/') {
      setLoading(false)
      return
    }

    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [location.pathname])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading && location.pathname === '/') {
    return <LoadingPage />
  }

  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="app">
      {!isAdminPage && <NavigationBar />}

      <main className="main-content">
        <Routes>
          {/* Scrollable landing page */}
          <Route path="/" element={<MainPage />} />

          {/* Separate pages */}
          <Route path="/services" element={<ServicesPage />} />
         <Route path ="/gallery" element={<GalleryPage />} />
         <Route path ="/login" element={<LoginPage />} />
         <Route path ="/booking" element={<BookingPage />} />
         <Route path ="/admin" element={<AdminPage />} />
        <Route path ="/contact" element={<ContactPage />} /> 
         <Route path ="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  )
}

/* -------------------------
   Root App
-------------------------- */
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}