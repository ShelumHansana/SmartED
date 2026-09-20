import { useState, useEffect } from 'react'
import '../styles/LandingPage.css'
import Navbar from './Navbar'
import Login from './Login'

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    document.body.classList.add('landing-page-active')
    return () => {
      document.body.classList.remove('landing-page-active')
    }
  }, [])

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="landing-container">
      {/* Dynamic ambient glowing light orbs for depth */}
      <div className="ambient-orb orb-1" aria-hidden="true"></div>
      <div className="ambient-orb orb-2" aria-hidden="true"></div>
      <div className="ambient-orb orb-3" aria-hidden="true"></div>

      <Navbar onLoginClick={() => setShowLogin(true)} />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      <main className="main-content">
        {/* Hero Area with Floating Glass Badges */}
        <div className="hero-container">
          {/* Floating Pill Badges */}
          <div className="floating-badge badge-left" aria-hidden="true">
            <span className="floating-icon">⭐</span>
            <div className="floating-info">
              <span className="floating-title">4.9 / 5.0</span>
              <span className="floating-sub">Student Rating</span>
            </div>
          </div>

          <div className="floating-badge badge-right" aria-hidden="true">
            <span className="floating-icon">🎓</span>
            <div className="floating-info">
              <span className="floating-title">10,000+</span>
              <span className="floating-sub">Active Students</span>
            </div>
          </div>

          <div className="hero-section">
            <div className="hero-pill">
              <span className="pill-dot"></span>
              <span>Next-Gen Smart Learning Platform</span>
            </div>

            <h2 className="hero-title">
              Achieve Your <span className="highlight-gradient">Educational Dreams</span>
            </h2>

            <p className="hero-description">
              Embark on a transformative learning journey with SmartED —
              Your gateway to academic excellence, real-time analytics, and collaborative education.
            </p>

            <div className="hero-buttons">
              <button 
                id="cta-start-learning"
                className="cta-button primary-cta" 
                onClick={() => setShowLogin(true)}
              >
                <span className="cta-label">Start Learning Today</span>
                <span className="cta-icon">→</span>
              </button>
              <button 
                id="cta-explore-features"
                className="cta-button secondary-cta" 
                onClick={scrollToFeatures}
              >
                <span className="cta-label">Explore Features</span>
                <span className="cta-icon">↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Platform Stats Strip */}
        <div className="stats-strip">
          <div className="stat-pill-item">
            <span className="stat-pill-icon">👥</span>
            <div>
              <span className="stat-pill-num">5,000+</span>
              <span className="stat-pill-desc">Active Students</span>
            </div>
          </div>
          <div className="stat-pill-divider"></div>
          <div className="stat-pill-item">
            <span className="stat-pill-icon">👨‍🏫</span>
            <div>
              <span className="stat-pill-num">120+</span>
              <span className="stat-pill-desc">Expert Educators</span>
            </div>
          </div>
          <div className="stat-pill-divider"></div>
          <div className="stat-pill-item">
            <span className="stat-pill-icon">📊</span>
            <div>
              <span className="stat-pill-num">98.6%</span>
              <span className="stat-pill-desc">Pass Rate</span>
            </div>
          </div>
          <div className="stat-pill-divider"></div>
          <div className="stat-pill-item">
            <span className="stat-pill-icon">⚡</span>
            <div>
              <span className="stat-pill-num">24/7</span>
              <span className="stat-pill-desc">Instant Access</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section" id="features-section">
          <div className="landing-features-header">
            <span className="landing-kicker">DISCOVER EXCELLENCE</span>
            <h3 className="landing-section-heading">Designed for Modern Learning</h3>
            <p className="landing-section-subheading">
              Everything you need to succeed academically, organized in one intuitive platform.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card card-animate-1" onClick={() => setShowLogin(true)}>
              <div className="feature-icon-bubble bubble-blue">
                <span className="feature-emoji">🚀</span>
              </div>
              <span className="feature-tag">Anytime Access</span>
              <h3>Easy Access</h3>
              <p>Access study materials, recorded lectures, and assignments anywhere on any device with instant cloud sync.</p>
              <div className="card-action">
                <span className="card-link-text">Get started</span>
                <span className="card-link-arrow">→</span>
              </div>
            </div>

            <div className="feature-card card-animate-2" onClick={() => setShowLogin(true)}>
              <div className="feature-icon-bubble bubble-cyan">
                <span className="feature-emoji">📈</span>
              </div>
              <span className="feature-tag">Smart Analytics</span>
              <h3>Track Progress</h3>
              <p>Monitor your GPA, attendance milestones, and subject progress with rich visual charts and personalized insights.</p>
              <div className="card-action">
                <span className="card-link-text">Explore analytics</span>
                <span className="card-link-arrow">→</span>
              </div>
            </div>

            <div className="feature-card card-animate-3" onClick={() => setShowLogin(true)}>
              <div className="feature-icon-bubble bubble-purple">
                <span className="feature-emoji">💡</span>
              </div>
              <span className="feature-tag">Real-Time Interaction</span>
              <h3>Interactive Learning</h3>
              <p>Engage with interactive course materials, collaborate with classmates, and receive direct teacher feedback.</p>
              <div className="card-action">
                <span className="card-link-text">Discover features</span>
                <span className="card-link-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Landing Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-icon">🎓</span>
            <span className="footer-title">SmartED</span>
            <span className="footer-separator">•</span>
            <span className="footer-tag">Smart Learning Management System</span>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} SmartED LMS. Designed for modern institutions, students & educators.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
