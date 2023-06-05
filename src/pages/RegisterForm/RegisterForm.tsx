import { ChangeEvent, SetStateAction, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './registerform.scss'
import instance, { instanceNotAuth } from '../../api/request'
import zxcvbn from 'zxcvbn'
import PasswordStrength from './PasswordStrength'

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

  // const getPasswordStrength = (password: string) => {
  //   const result = zxcvbn(password)
  //   return result.score // Значення від 0 до 4, де 0 - найслабший пароль, 4 - найсильніший пароль
  // }

  const handleRegister = async () => {
    const formData = {
      email: username,
      password: password,
    }

    try {
      console.log('formData', formData)
      const response: any = await instanceNotAuth.post(
        '/user',
        formData
      )
      console.log('response', response)

      if (response.data.result === 'Created') {
        const authorized: {
          result: string
          token: string
          refreshToken: string
        } = await instanceNotAuth.post('/login', formData)

        if (authorized.result === 'Authorized') {
          localStorage.setItem('token', authorized.token)
          localStorage.setItem('refreshToken', authorized.refreshToken)
          navigate('/')
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
            // type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <PasswordStrength password={password} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Pepeat password</label>
          <input
            // type="password"
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
