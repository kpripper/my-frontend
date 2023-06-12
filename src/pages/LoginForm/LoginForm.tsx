import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './loginform.scss'
import instance, { instanceNotAuth } from '../../api/request'
import store from '../../store/store'
import { authentificate } from '../../store/modules/user/actions'

function LoginForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleUsernameChange = (event: any) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value)
  }

  const handleLogin = async () => {
    const formData = {
      email: username,
      password: password,
    }

    try {
      const response = await instanceNotAuth.post('/login', formData)
      if (response.status === 200) {
        const { token, refreshToken } = response.data
 
        store.dispatch(authentificate(true))
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        try {
          navigate('/')
        } catch (error) {
          console.log('Помилка при виконанні navigate:', error)
        }
      } else {
        setError('User with such email or password was not found')
      }
    } catch (error: any) {
      setError(error.response.data.error)
    }
  }
  return (
    <div className="login-form">
      <h2>Login</h2>
      <form>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="button" onClick={handleLogin} className="login-button">
          Sign in
        </button>
      </form>
      <p>
        New to our site?{' '}
        <Link className="register-link" to="/register">
          Register
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
