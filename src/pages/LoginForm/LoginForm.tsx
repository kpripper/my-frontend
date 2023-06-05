import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import './loginform.scss'
import instance, { instanceNotAuth } from '../../api/request'
import { SetState } from 'immer/dist/internal'

function LoginForm({
  setIsAuthenticated,
}: {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // useEffect(() => {
  //   const isAuthenticated = !!localStorage.getItem('token');
  //   if (isAuthenticated) {
  //     navigate('/');
  //   }
  // }, [navigate]);

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
      console.log('login formData', formData)

      const response = await instanceNotAuth.post('/login', formData)

      console.log('login response', response)

      if (response.status === 200) {
        console.log('response.status === 200')
        const { token, refreshToken } = response.data

        console.log('token 200', token)
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        // window.location.href = '/'
        setIsAuthenticated(true)
        try {
          navigate('/')
        } catch (error) {
          console.log('Помилка при виконанні navigate:', error)
        }
      } else {
        setError('User with such email or password was not found')
      }
    } catch (error: any) {
      console.log('Помилка при логіні', error)
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
