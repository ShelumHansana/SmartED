import { useState } from 'react'
import '../styles/LandingPage.css'
import Navbar from './Navbar'
import Login from './Login'
import Register from './Register'

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  return (
    <div className="landing-container">
      <Navbar 
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignup && <Register onClose={() => setShowSignup(false)} />}

      <main className="main-content">
        <div className="hero-section">
          <h2>Welcome to SmartED Learning</h2>
          <p>
            Transform your educational journey with our comprehensive 
            Learning Management System
          </p>
          <div className="hero-buttons">
            <button className="cta-button" onClick={() => setShowLogin(true)}>
              Get Started
            </button>
          </div>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>Easy Access</h3>
            <p>Access your learning materials anytime, anywhere</p>
          </div>
          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with detailed analytics</p>
          </div>
          <div className="feature-card">
            <h3>Interactive Learning</h3>
            <p>Engage with interactive content and real-time feedback</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
