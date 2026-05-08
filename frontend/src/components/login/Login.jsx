import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        alert('Andrei way buot')
    }

    const handleGoogleSuccess = (credentialResponse) => {
        console.log('Google login success:', credentialResponse)
        alert('Google SSO success')
    }

    const handleGoogleError = () => {
        console.log('Google login failed')
        alert('Google SSO failed')
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
                    <img src="src/assets/logo-login.png" className="card-logo" />
                    <h1 className="login-title">Museo de Oro Inventory System</h1>
                    <form onSubmit={handleSubmit} className="login-form">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Type your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Type your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="show-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        <button type="submit" className="login-btn">
                            Login
                        </button>
                    </form>
                    <div className="google-login-wrapper">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Login