export const handleAxiosError = (error: string | unknown) => {
  return { type: 'AXIOS_ERROR', payload: error }
}

export const clearError = () => {
  return { type: 'CLEAR_ERROR'}
}
