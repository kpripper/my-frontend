import { Dispatch, SetStateAction } from 'react'

export const newNameValidation = (text: string) => {
  const pattern = /^[A-Za-z0-9 _\-.]*$/
  return text !== '' ? pattern.test(text) : false
}

export const toggleState = (
  setState: Dispatch<SetStateAction<boolean>>,
): void => {
  setState(prev => !prev)
}
