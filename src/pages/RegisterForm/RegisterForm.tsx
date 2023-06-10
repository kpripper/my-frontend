import { ChangeEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './registerform.scss'
import { instanceNotAuth } from '../../api/request'
import PasswordStrength from './PasswordStrength'
import store from '../../store/store'
import { authentificate } from '../../store/modules/user/actions'

function RegisterForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [error, setError] = useState('')

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handlePasswordRepeat = (event: any) => {
    setPasswordRepeat(event.target.value)
  }

  useEffect(() => {
    const isPasswordsEqual = () => {
      if (password !== passwordRepeat) {
        setError('Passwords do not match')
      } else {
        setError('')
      }
    }

    isPasswordsEqual()
  }, [password, passwordRepeat])

  const handleRegister = async () => {
    const formData = {
      email: username,
      password: password,
    }

    try {
      const response: any = await instanceNotAuth.post('/user', formData)

      if (response.data.result === 'Created') {
        const authorized: any = await instanceNotAuth.post('/login', formData)

        if (authorized.data.result === 'Authorized') {
          store.dispatch(authentificate(true))
          localStorage.setItem('token', authorized.data.token)
          localStorage.setItem('refreshToken', authorized.data.refreshToken)
          navigate('/')
        } else {
          console.log('not authorized', authorized.result)
        }
      }
    } catch (response: any) {
      setError(`Error: ${response.response.data.error}`)
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
          <PasswordStrength password={password} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Pepeat password</label>
          <input
            type="password"
            id="password"
            value={passwordRepeat}
            onChange={handlePasswordRepeat}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="button" onClick={handleRegister} className="login-button">
          Register
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <Link className="register-link" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm
