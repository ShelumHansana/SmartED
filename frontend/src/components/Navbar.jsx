const Navbar = ({ onLoginClick, onSignupClick }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>SmartED</h1>
        <span className="tagline">Smart Learning Management System</span>
      </div>
      <div className="auth-buttons">
        <button className="login-button" onClick={onLoginClick}>Login</button>
        <button className="signup-button" onClick={onSignupClick}>Sign Up</button>
      </div>
    </nav>
  )
}

export default Navbar
