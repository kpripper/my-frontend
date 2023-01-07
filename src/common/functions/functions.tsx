export const newNameValidation = (text: string) => {
    const pattern = /^[A-Za-z0-9 _\-.]*$/
    return text !== '' ? pattern.test(text) : false
  }