import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import './Login.css'

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Andrei way buot')
  }

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const email = decoded.email;

      if (!email.endsWith('@my.xu.edu.ph')) {
        setError('Access restricted to @my.xu.edu.ph accounts only.');
        return;
      }

      setError('');
      onLoginSuccess({ email, name: decoded.name, picture: decoded.picture });

    } catch (err) {
      console.error('Failed to decode token:', err);
      setError('Login failed. Please try again.');
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  }

  return (
    <div className="login-page">
      <nav className="nav-container">
        <div className="logo">
          <img src="src/assets/logo.png" />
        </div>
      </nav>
      <div className="login-container">
        <div className="login-card">
          <img src="src/assets/xu-logo.png" className="card-logo" />
          <h1 className="login-title">Museo de Oro Inventory System</h1>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">Email</label>
            <input
              id="email" type="email" placeholder="Type your email"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password" type={showPassword ? 'text' : 'password'}
                placeholder="Type your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="google-login-wrapper">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login