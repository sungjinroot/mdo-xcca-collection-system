import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import './Login.css'

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Invalid username or password.');
        return;
      }

      const userData = result.user ?? result;
      sessionStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        credential: credentialResponse.credential,
        ...decoded
      };
      sessionStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
    } catch (err) {
      console.error('Failed to process login:', err);
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <img src="src/assets/xu-logo.png" className="card-logo" />
          <h1 className="login-title">Museo de Oro Collection Inventory Management System</h1>
          
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">Username</label>
            <input id="email" type="text" placeholder="Type your username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="password">Password</label>
            
            <div className="password-wrapper">
              <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Type your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="show-password-btn" onClick={() => setShowPassword(!showPassword)}>
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
  );
}

export default Login;