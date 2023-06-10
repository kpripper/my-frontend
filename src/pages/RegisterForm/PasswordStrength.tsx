import './passwordstrength.scss'
import { useEffect, useState } from 'react'

const PasswordStrength = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const goodPasswordLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasUppercase = /[A-ZА-ЯІЇЄ]/.test(password)
    const hasLowercase = /[a-zа-яіїє]/.test(password)

    let message = ''

    if (!hasUppercase) {
      message += 'One uppercase letter is required. '
    }

    if (!hasLowercase) {
      message += 'One lowercase letter is required. '
    }

    if (!hasNumber) {
      message += 'One digit is required. '
    }

    if (!goodPasswordLength) {
      message += 'Minimum of 8 characters is required. '
    }

    setErrorMessage(message.trim())

    const passwordConditions =
      Number(goodPasswordLength) +
      Number(hasNumber) +
      Number(hasUppercase) +
      Number(hasLowercase)

    setStrength(passwordConditions)
  }, [password])

  const colors = ['#ff4d4d', '#ffa64d', '#ffd24d', '#a3ff4d']
  //_ - щоб передати що-небудь замість елемента і отримати доступ до індекса
  const strengthBars = Array.from({ length: 4 }).map((_, index) => {
    const barColor = index < strength ? colors[index] : '#ccc'
    return (
      <div
        key={index}
        className="strength-bar"
        style={{ backgroundColor: barColor }}
      />
    )
  })

  return (
    <>
      <div className="password-strength-meter">{strengthBars}</div>
      <div className="password-errors">
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </>
  )
}

export default PasswordStrength
