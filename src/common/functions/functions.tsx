import { Dispatch, SetStateAction } from 'react'

export const newNameValidation = (text: string) => {
  const pattern = /^[A-Za-z0-9 _\-.]*$/
  return text !== '' ? pattern.test(text) : false
}

//приклад з дженеріками
// export const toggleState = <T extends boolean,>(
//   setState: Dispatch<SetStateAction<T>>
// ): void => {
//   //as T потрібно щоб повернути такий же тип який передали, 
//   //а не булеан, який повертає setState за замовчуванням якщо йому передати функцію
//   setState(prev => !prev as T)
// }

//використання:  toggleState(setSomeState);
export const toggleState = (setState: Dispatch<SetStateAction<boolean>>): void => {
  setState(prev => !prev);
}
