export const newNameValidation = (board: string) => {
    const pattern = /^[A-Za-z0-9 _\-.]*$/
    return board !== '' ? pattern.test(board) : false
  }