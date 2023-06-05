import zxcvbn from 'zxcvbn'
import './passwordstrength.scss'
import { useEffect, useState } from 'react'

const PasswordStrength = ({ password }: { password: string }) => {
  const passwordStrength = zxcvbn(password)
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']

  const strength = passwordStrength.score
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const passwordStrength = zxcvbn(password)
    const meetsLengthRequirement = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasUppercase = /[A-ZА-ЯІЇЄ]/.test(password)
    const hasLowercase = /[a-zа-яіїє]/.test(password)

    let message = ''

    if (!hasUppercase) {
      console.log('password', password)
      message += 'One uppercase letter is required. '
    }

    if (!hasLowercase) {
      console.log('password', password)
      message += 'One lowercase letter is required. '
    }

    if (!hasNumber) {
      console.log('password', password)
      message += 'One digit is required. '
    }

    if (!meetsLengthRequirement) {
      console.log('password', password)
      message += 'Minimum of 8 characters is required. '
    }

    setErrorMessage(message.trim())

    if (meetsLengthRequirement && hasNumber && hasUppercase && hasLowercase) {
      // Password meets all requirements
      console.log('Password meets all requirements')
    }
  }, [password])

  const strengthBars = Array.from({ length: 4 }).map((_, index) => {
    const barColor = index <= strength ? getColorByIndex(index) : '#ccc'
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

const getColorByIndex = (index: number) => {
  const colors = ['#ff4d4d', '#ffa64d', '#ffd24d', '#a3ff4d']
  return colors[index]
}

export default PasswordStrength
